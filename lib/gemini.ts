import { Transaction, Budget, RecurringItem, Goal } from './types'

export const GEMINI_KEY_STORAGE_KEY = 'finpilot_gemini_api_key'
export const CURRENCY_STORAGE_KEY = 'finpilot_currency'

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
