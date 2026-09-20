import { Transaction, Budget, RecurringItem, Goal } from './types'

export const GEMINI_KEY_STORAGE_KEY = 'finpilot_gemini_api_key'
export const CURRENCY_STORAGE_KEY = 'finpilot_currency'
export const USE_ENV_KEY_STORAGE_KEY = 'finpilot_use_env_key'
export const AI_REQUEST_COUNT_KEY = 'finpilot_ai_request_count'
export const AI_REQUEST_DATE_KEY = 'finpilot_ai_request_date'
export const AI_REQUEST_LOG_KEY = 'finpilot_ai_request_log'
export const AI_REQUEST_LIMIT = 15

export function getStoredGeminiKey(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(GEMINI_KEY_STORAGE_KEY) || ''
}

export function setStoredGeminiKey(key: string): void {
  if (typeof window === 'undefined') return
  if (key) {
    localStorage.setItem(GEMINI_KEY_STORAGE_KEY, key.trim())
  } else {
    localStorage.removeItem(GEMINI_KEY_STORAGE_KEY)
  }
}

export function getStoredCurrency(): string {
  if (typeof window === 'undefined') return '$'
  return localStorage.getItem(CURRENCY_STORAGE_KEY) || '$'
}

export function setStoredCurrency(symbol: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(CURRENCY_STORAGE_KEY, symbol)
}

export function getStoredUseEnvKey(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(USE_ENV_KEY_STORAGE_KEY) === 'true'
}

export function setStoredUseEnvKey(useEnv: boolean): void {
  if (typeof window === 'undefined') return
  if (useEnv) localStorage.setItem(USE_ENV_KEY_STORAGE_KEY, 'true')
  else localStorage.removeItem(USE_ENV_KEY_STORAGE_KEY)
}

// ---------- App URL (fixes Vercel localhost:3000 in confirm emails) ----------
export function getAppUrl(): string {
  // Client: prefer NEXT_PUBLIC_APP_URL, then VERCEL_URL, then window.location.origin
  if (typeof window !== 'undefined') {
    const envUrl = (process.env.NEXT_PUBLIC_APP_URL || '').trim().replace(/\/$/, '')
    if (envUrl && !envUrl.includes('localhost')) return envUrl
    // Vercel injects VERCEL_URL on client only if exposed as NEXT_PUBLIC_VERCEL_URL, fallback to origin
    // In production on Vercel, window.location.origin is the correct canonical URL (not localhost)
    if (window.location.origin && !window.location.origin.includes('localhost:3000') ) {
      // If we're on production domain, use it; dev keeps localhost:3000
      return window.location.origin
    }
    // Dev fallback
    if (window.location.origin) return window.location.origin
  }
  // Server: NEXT_PUBLIC_APP_URL > VERCEL_URL > localhost
  const publicUrl = (process.env.NEXT_PUBLIC_APP_URL || '').trim().replace(/\/$/, '')
  if (publicUrl) return publicUrl
  const vercelUrl = (process.env.VERCEL_URL || '').trim()
  if (vercelUrl) return `https://${vercelUrl.replace(/^https?:\/\//, '')}`
  return 'http://localhost:3000'
}

// ---------- AI Request Tracking (15 requests limit) ----------
export interface AiRequestLogEntry {
  ts: number
  mode: string
  questionPreview: string
}

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10) // YYYY-MM-DD
}

export function getAiRequestCount(): number {
  if (typeof window === 'undefined') return 0
  const storedDate = localStorage.getItem(AI_REQUEST_DATE_KEY)
  const today = getTodayKey()
  if (storedDate !== today) {
    // new day -> reset
    localStorage.setItem(AI_REQUEST_DATE_KEY, today)
    localStorage.setItem(AI_REQUEST_COUNT_KEY, '0')
    localStorage.setItem(AI_REQUEST_LOG_KEY, '[]')
    return 0
  }
  return parseInt(localStorage.getItem(AI_REQUEST_COUNT_KEY) || '0', 10) || 0
}

export function getRemainingAiRequests(): number {
  return Math.max(0, AI_REQUEST_LIMIT - getAiRequestCount())
}

export function canMakeAiRequest(): boolean {
  return getAiRequestCount() < AI_REQUEST_LIMIT
}

export function incrementAiRequestCount(entry?: AiRequestLogEntry): number {
  if (typeof window === 'undefined') return 0
  const today = getTodayKey()
  const storedDate = localStorage.getItem(AI_REQUEST_DATE_KEY)
  if (storedDate !== today) {
    localStorage.setItem(AI_REQUEST_DATE_KEY, today)
    localStorage.setItem(AI_REQUEST_COUNT_KEY, '0')
    localStorage.setItem(AI_REQUEST_LOG_KEY, '[]')
  }
  const next = getAiRequestCount() + 1
  localStorage.setItem(AI_REQUEST_COUNT_KEY, String(next))
  localStorage.setItem(AI_REQUEST_DATE_KEY, today)
  if (entry) {
    try {
      const log: AiRequestLogEntry[] = JSON.parse(localStorage.getItem(AI_REQUEST_LOG_KEY) || '[]')
      log.unshift({ ...entry, ts: Date.now() })
      localStorage.setItem(AI_REQUEST_LOG_KEY, JSON.stringify(log.slice(0, 50)))
    } catch {}
  }
  return next
}

export function getAiRequestLog(): AiRequestLogEntry[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(AI_REQUEST_LOG_KEY) || '[]')
  } catch {
    return []
  }
}

export function resetAiRequestCount(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(AI_REQUEST_COUNT_KEY, '0')
  localStorage.setItem(AI_REQUEST_DATE_KEY, getTodayKey())
}

export function buildFinancialContext(
  currency: string,
  transactions: Transaction[],
  budgets: Budget[],
  recurring: RecurringItem[],
  goals: Goal[]
): string {
  const currentMonthStr = new Date().toISOString().slice(0, 7) // 'YYYY-MM'
  
  // Filter for current month transactions
  const thisMonthTx = transactions.filter(t => t.date && t.date.startsWith(currentMonthStr))
  const relevantTx = thisMonthTx.length > 0 ? thisMonthTx : transactions

  const incomeTx = relevantTx.filter(t => t.type === 'income' || t.amount > 0)
  const expenseTx = relevantTx.filter(t => t.type === 'expense' || t.amount < 0)

  const totalIncome = incomeTx.reduce((sum, t) => sum + Math.abs(t.amount), 0)
  const totalExpenses = expenseTx.reduce((sum, t) => sum + Math.abs(t.amount), 0)
  const netCashFlow = totalIncome - totalExpenses

  // Category breakdown
  const categoryTotals: Record<string, number> = {}
  for (const t of expenseTx) {
    const cat = t.category || 'Other'
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Math.abs(t.amount)
  }

  const categorySummary = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, amt]) => `${cat}: ${currency}${amt.toFixed(2)}`)
    .join(', ')

  // Budget status
  const budgetStatus = budgets.map(b => {
    const spent = categoryTotals[b.category] || 0
    const pct = b.monthly_limit > 0 ? Math.round((spent / b.monthly_limit) * 100) : 0
    return `${b.category}: ${currency}${spent.toFixed(2)} of ${currency}${b.monthly_limit.toFixed(2)} limit (${pct}%)`
  }).join('; ')

  // Recurring subscriptions
  const activeRecurring = recurring.filter(r => r.active !== false)
  const recurringTotal = activeRecurring.reduce((sum, r) => sum + Number(r.amount), 0)
  const recurringList = activeRecurring.map(r => `${r.name} (${currency}${r.amount} ${r.cadence})`).join(', ')

  // Goals
  const goalsSummary = goals.map(g => {
    const pct = g.target_amount > 0 ? Math.round((g.current_amount / g.target_amount) * 100) : 0
    return `${g.title}: ${currency}${g.current_amount} of ${currency}${g.target_amount} (${pct}%)`
  }).join('; ')

  // Recent 5 transactions
  const recentList = transactions.slice(0, 6).map(t => 
    `${t.date}: ${t.merchant} (${t.type === 'income' ? '+' : '-'}${currency}${Math.abs(t.amount).toFixed(2)}, ${t.category})`
  ).join(' | ')

  return `User Financial Overview:
- Currency: ${currency}
- Total Income: ${currency}${totalIncome.toFixed(2)}
- Total Expenses: ${currency}${totalExpenses.toFixed(2)}
- Net Cash Flow: ${netCashFlow >= 0 ? '+' : '-'}${currency}${Math.abs(netCashFlow).toFixed(2)}
- Spending by Category: ${categorySummary || 'None recorded'}
- Budget Health: ${budgetStatus || 'No budgets configured'}
- Recurring Commitments: Total ${currency}${recurringTotal.toFixed(2)}/mo (${recurringList || 'None'})
- Savings Goals: ${goalsSummary || 'No active goals'}
- Recent Activity: ${recentList || 'None'}`
}
