export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  user_id?: string
  merchant: string
  detail?: string
  amount: number
  category: string
  date: string
  type: TransactionType
  created_at?: string
}

export interface Budget {
  id: string
  user_id?: string
  category: string
  monthly_limit: number
  period?: string
  created_at?: string
}

export interface RecurringItem {
  id: string
  user_id?: string
  name: string
  amount: number
  cadence: 'monthly' | 'yearly' | 'weekly'
  billing_day: number
  category: string
  active: boolean
  created_at?: string
}

export interface Goal {
  id: string
  user_id?: string
  title: string
  target_amount: number
  current_amount: number
  target_date?: string
  created_at?: string
}

export interface Profile {
  id: string
  email?: string
  full_name?: string
  currency: string
  gemini_api_key?: string
  created_at?: string
  updated_at?: string
}

export interface CategorySummary {
  name: string
  amount: number
  percentage: number
  budget?: number
  isOverBudget?: boolean
}

export interface FinancialSummary {
  totalIncome: number
  totalExpenses: number
  netCashFlow: number
  categories: CategorySummary[]
  recurringTotal: number
  goalProgressPercent: number
  activeGoalsCount: number
}
