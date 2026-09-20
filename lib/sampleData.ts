import { Transaction, Budget, RecurringItem, Goal } from './types'

export const sampleTransactions: Omit<Transaction, 'id'>[] = [
  { merchant: 'Whole Foods Market', detail: 'Organic groceries & produce', date: '2026-09-18', amount: -86.42, category: 'Food & Dining', type: 'expense' },
  { merchant: 'Acme Utilities', detail: 'Monthly electricity bill', date: '2026-09-17', amount: -142.18, category: 'Utilities', type: 'expense' },
  { merchant: 'Tech Corp Salary', detail: 'Direct deposit salary', date: '2026-09-15', amount: 3850.00, category: 'Income', type: 'income' },
  { merchant: 'Metro Transit Pass', detail: 'Subway monthly pass', date: '2026-09-14', amount: -48.00, category: 'Transport', type: 'expense' },
  { merchant: 'The Green Fork', detail: 'Dinner with colleagues', date: '2026-09-12', amount: -74.50, category: 'Food & Dining', type: 'expense' },
  { merchant: 'Equinox Gym', detail: 'Monthly membership', date: '2026-09-08', amount: -120.00, category: 'Healthcare', type: 'expense' },
  { merchant: 'Blue Bottle Coffee', detail: 'Morning coffee', date: '2026-09-05', amount: -16.20, category: 'Food & Dining', type: 'expense' },
  { merchant: 'Downtown Apartment', detail: 'Monthly rent transfer', date: '2026-09-01', amount: -1750.00, category: 'Housing', type: 'expense' },
]

export const sampleBudgets: Omit<Budget, 'id'>[] = [
  { category: 'Housing', monthly_limit: 1850 },
  { category: 'Food & Dining', monthly_limit: 650 },
  { category: 'Transport', monthly_limit: 200 },
  { category: 'Utilities', monthly_limit: 250 },
  { category: 'Subscriptions', monthly_limit: 100 },
]

export const sampleRecurring: Omit<RecurringItem, 'id'>[] = [
  { name: 'Netflix 4K', amount: 22.99, cadence: 'monthly', billing_day: 22, category: 'Subscriptions', active: true },
  { name: 'Notion Plus', amount: 12.00, cadence: 'monthly', billing_day: 24, category: 'Subscriptions', active: true },
  { name: 'Spotify Premium', amount: 11.99, cadence: 'monthly', billing_day: 28, category: 'Subscriptions', active: true },
  { name: 'Home Internet', amount: 65.00, cadence: 'monthly', billing_day: 15, category: 'Utilities', active: true },
]

export const sampleGoals: Omit<Goal, 'id'>[] = [
  { title: 'Emergency Fund (6 Months)', target_amount: 15000, current_amount: 6400, target_date: '2027-04-30' },
  { title: 'Tokyo Autumn Trip', target_amount: 3200, current_amount: 1850, target_date: '2026-11-15' },
]
