import { gateway, generateText } from 'ai'
import { NextResponse } from 'next/server'

const financialContext = `User Jordan Davis has September 2026 demo data. Income $3,870. Expenses $3,186.48. Net cash flow $684.20. Largest categories: Housing $1,850, Food & dining $624, Transport $318, Subscriptions $146. Recurring subscriptions: Netflix $22.99 monthly, Notion $12 monthly, Spotify $11.99 monthly. Upcoming commitments: rent $1,850, utilities $142.18, subscriptions $46.98. Budget is $3,500 with $2,784 committed. Goal: emergency fund, 42.6% progress, projected 7 months at current savings rate. Food & dining is up 12% month-over-month. Possible duplicate Acme Utilities charge. This is decision support only, never investment advice.`

export async function POST(request: Request) {
  try {
    const { question, mode = 'qa' } = await request.json()
    if (!question || typeof question !== 'string') return NextResponse.json({ error: 'Question is required.' }, { status: 400 })
    const prompt = mode === 'report'
      ? `Create a concise monthly personal finance report with sections: Key observations, Watch items, and Concrete action items. Use plain language and dollar figures. Do not give investment advice or guarantees. Ground every statement in this data: ${financialContext}`
      : `Answer this personal finance question using only the supplied user data: "${question}". Be concise, plain-language, and specific. If the question asks for investment advice, explain that FinPilot does not provide investment advice and redirect to spending/budget context. Mention that this is based on demo data when useful. Data: ${financialContext}`
    const result = await generateText({ model: gateway('zai/glm-5.3'), system: 'You are FinPilot, a careful personal finance decision-support agent. Never recommend investments, securities, or financial products. Explain spending data and support everyday decisions.', prompt })
    return NextResponse.json({ answer: result.text })
  } catch (error) {
    console.error('[v0] FinPilot agent error', error)
    return NextResponse.json({ error: 'The agent is temporarily unavailable. Try again.' }, { status: 500 })
  }
}
