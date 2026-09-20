import { GoogleGenAI } from '@google/genai'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { question, mode = 'qa', financialContext = '', apiKey: bodyApiKey } = body

    // Priority: Body key -> Header key -> Environment variable
    const authHeader = request.headers.get('x-gemini-api-key')
    const apiKey = (bodyApiKey || authHeader || process.env.GEMINI_API_KEY || '').trim()

    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'Google Gemini API key is required. Please add your API key in Onboarding or Settings.',
          requiresKey: true 
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
    return NextResponse.json({ answer })

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
