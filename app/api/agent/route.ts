import { GoogleGenAI } from '@google/genai'
import { NextResponse } from 'next/server'

const AI_REQUEST_LIMIT = 15
// Server-side in-memory tracker per IP per day (best-effort, client is primary limiter)
// Also respects client-sent count to prevent bypass
const serverCounts = new Map<string, { count: number; date: string }>()

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function getServerCount(ip: string): number {
  const entry = serverCounts.get(ip)
  const today = todayKey()
  if (!entry || entry.date !== today) {
    serverCounts.set(ip, { count: 0, date: today })
    return 0
  }
  return entry.count
}

function incrementServerCount(ip: string): number {
  const today = todayKey()
  const cur = getServerCount(ip)
  const next = cur + 1
  serverCounts.set(ip, { count: next, date: today })
  return next
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { question, mode = 'qa', financialContext = '', apiKey: bodyApiKey, useEnvKey: bodyUseEnvKey } = body

    // Header flags
    const authHeader = request.headers.get('x-gemini-api-key') || ''
    const useEnvHeader = request.headers.get('x-use-env-key') === 'true'
    const clientCountHeader = parseInt(request.headers.get('x-ai-request-count') || '', 10)
    const useEnvKey = Boolean(bodyUseEnvKey || useEnvHeader)

    // Client-side count enforcement (pre-check before calling Gemini)
    const clientCount = Number.isFinite(clientCountHeader) ? clientCountHeader : null
    if (clientCount !== null && clientCount >= AI_REQUEST_LIMIT) {
      return NextResponse.json(
        {
          error: `AI request limit reached (${AI_REQUEST_LIMIT}/day). Please try again tomorrow. Your remaining: 0/${AI_REQUEST_LIMIT}.`,
          limitReached: true,
          remaining: 0,
          limit: AI_REQUEST_LIMIT,
        },
        { status: 429 }
      )
    }

    // Server-side IP-based limit
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = (forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown').slice(0, 80)
    const serverCount = getServerCount(ip)
    if (serverCount >= AI_REQUEST_LIMIT) {
      return NextResponse.json(
        {
          error: `Server AI rate limit reached for this client (${AI_REQUEST_LIMIT}/day). Resets at midnight UTC.`,
          limitReached: true,
          remaining: 0,
          limit: AI_REQUEST_LIMIT,
        },
        { status: 429 }
      )
    }

    // Priority: if user selected "use env key" -> use only env var, else body -> header -> env fallback
    let apiKey: string
    if (useEnvKey) {
      apiKey = (process.env.GEMINI_API_KEY || '').trim()
      if (!apiKey) {
        return NextResponse.json(
          {
            error: 'App default API key (.env) is not configured on server. Set GEMINI_API_KEY in .env or Vercel Environment Variables, or add your own key.',
            requiresKey: true,
          },
          { status: 400 }
        )
      }
    } else {
      apiKey = (bodyApiKey || authHeader || process.env.GEMINI_API_KEY || '').trim()
    }

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'Google Gemini API key is required. Please add your API key in Onboarding or Settings, or enable "Use app default key".',
          requiresKey: true,
        },
        { status: 400 }
      )
    }

    if (!question && mode !== 'report') {
      return NextResponse.json({ error: 'A question or prompt is required.' }, { status: 400 })
    }

    const systemInstruction = `You are FinPilot, an expert personal finance copilot.
You provide clear, grounded, practical decision support and insights based directly on the user's real transactions, budgets, recurring commitments, and savings goals.
Rules:
1. Always reference the actual numbers, categories, and merchants provided in the user's data context.
2. Format responses with clean, readable Markdown (bullet points, bold figures, headers).
3. Do NOT provide speculative investment, stock picking, or securities trading advice. Explain that FinPilot is focused on personal cash flow, budgeting, and everyday savings discipline.
4. Keep answers concise, actionable, and friendly.`

    let prompt = ''
    if (mode === 'report') {
      prompt = `Generate a structured Monthly Financial Report based on my live financial context below:\n\n${financialContext}\n\n` +
        `Include the following structured sections:\n` +
        `### 📊 Executive Summary\n- Total income, expenses, and net cash flow\n` +
        `### 🔍 Key Spending Observations & Anomalies\n- Top expense categories and any notable patterns\n` +
        `### 💳 Budget & Subscription Audit\n- Review of category budget utilization and recurring commitments\n` +
        `### 🎯 Goals & Projections\n- Progress toward savings targets\n` +
        `### 💡 3 Concrete Action Items\n- Specific, realistic actions to optimize finances this month.`
    } else {
      prompt = `Here is my current live financial snapshot:\n\n${financialContext}\n\nUser Question: "${question}"\n\nProvide a direct, helpful, and data-grounded answer.`
    }

    const ai = new GoogleGenAI({ apiKey })

    // Use gemini-2.5-flash for fast, high-quality responses
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    })

    const answer = response.text || 'No response generated from Gemini.'
    const nextServerCount = incrementServerCount(ip)
    const remaining = Math.max(0, AI_REQUEST_LIMIT - (clientCount !== null ? clientCount + 1 : nextServerCount))

    // Track request (server log for observability)
    console.log(`[FinPilot AI] ${ip} ${mode} count=${nextServerCount} clientCount=${clientCount} useEnv=${useEnvKey} remaining=${remaining}`)

    return NextResponse.json(
      { answer, remaining, limit: AI_REQUEST_LIMIT, used: clientCount !== null ? clientCount + 1 : nextServerCount },
      {
        headers: {
          'X-AI-Remaining': String(remaining),
          'X-AI-Limit': String(AI_REQUEST_LIMIT),
        },
      }
    )

  } catch (error: any) {
    console.error('FinPilot Gemini agent error:', error)
    const errorMsg = error?.message || 'Failed to communicate with Gemini AI.'

    if (errorMsg.includes('API_KEY_INVALID') || errorMsg.includes('API key not valid')) {
      return NextResponse.json(
        { error: 'The provided Google Gemini API key is invalid. Please check your key from Google AI Studio.', requiresKey: true },
        { status: 401 }
      )
    }

    if (errorMsg.includes('RESOURCE_EXHAUSTED') || errorMsg.includes('quota')) {
      return NextResponse.json(
        { error: 'Gemini API quota exceeded for this key. Please verify your quota in Google AI Studio.' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    )
  }
}
