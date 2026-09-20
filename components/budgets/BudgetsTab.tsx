'use client'

import { useState, useMemo } from 'react'
import { Plus, BarChart3, AlertCircle, CheckCircle2, Trash2, Edit2, X } from 'lucide-react'
import { Budget, Transaction } from '@/lib/types'

interface BudgetsTabProps {
  budgets: Budget[]
  transactions: Transaction[]
  currency: string
  onSaveBudget: (budget: Omit<Budget, 'id'>, id?: string) => Promise<void>
  onDeleteBudget: (id: string) => Promise<void>
}

const defaultCategoryOptions = [
  'Food & Dining',
  'Housing',
  'Utilities',
  'Transport',
  'Subscriptions',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Education',
  'Other',
]

export function BudgetsTab({
  budgets,
  transactions,
  currency,
  onSaveBudget,
  onDeleteBudget,
}: BudgetsTabProps) {
  const [showModal, setShowModal] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [category, setCategory] = useState('Food & Dining')
  const [monthlyLimit, setMonthlyLimit] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Current month transactions
  const currentMonthStr = new Date().toISOString().slice(0, 7)
  const monthTransactions = transactions.filter(t => t.date && t.date.startsWith(currentMonthStr))

  // Calculate actual spent per category
  const categorySpend = useMemo(() => {
    const map: Record<string, number> = {}
    monthTransactions
      .filter(t => t.type === 'expense' || t.amount < 0)
      .forEach(t => {
        const cat = t.category || 'Other'
        map[cat] = (map[cat] || 0) + Math.abs(t.amount)
      })
    return map
  }, [monthTransactions])

  // Overall budget metrics
  const totalBudgetLimit = useMemo(
    () => budgets.reduce((sum, b) => sum + Number(b.monthly_limit), 0),
    [budgets]
  )
  const totalBudgetSpent = useMemo(
    () => budgets.reduce((sum, b) => sum + (categorySpend[b.category] || 0), 0),
    [budgets, categorySpend]
  )
  const overallPercent = totalBudgetLimit > 0 ? Math.round((totalBudgetSpent / totalBudgetLimit) * 100) : 0

  const handleOpenModal = (budget?: Budget) => {
    if (budget) {
      setEditingBudget(budget)
      setCategory(budget.category)
      setMonthlyLimit(String(budget.monthly_limit))
    } else {
      setEditingBudget(null)
      setCategory('Food & Dining')
      setMonthlyLimit('')
    }
    setError(null)
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const limitNum = parseFloat(monthlyLimit)
    if (isNaN(limitNum) || limitNum <= 0) {
      setError('Please provide a monthly limit greater than 0.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      await onSaveBudget(
        {
          category,
          monthly_limit: limitNum,
          period: currentMonthStr,
        },
        editingBudget?.id
      )
      setShowModal(false)
    } catch (err: any) {
      setError(err.message || 'Failed to save budget.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Health Card */}
      <div className="rounded-2xl border border-[#e5e6df] bg-white p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4 text-[#24463e]" />
              <h2 className="text-sm font-semibold text-[#1d2d28]">Monthly Budget Health</h2>
            </div>
            <p className="mt-1 text-xs text-[#89948d]">
              {currency}{totalBudgetSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })} spent of {currency}{totalBudgetLimit.toLocaleString(undefined, { minimumFractionDigits: 2 })} committed · {overallPercent}% used
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#24463e] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1b3630]"
          >
            <Plus className="size-3.5" /> Add Category Budget
          </button>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-5">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#eef1eb]">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                overallPercent >= 100
                  ? 'bg-red-500'
                  : overallPercent >= 80
                  ? 'bg-[#d7a84a]'
                  : 'bg-[#24463e]'
              }`}
              style={{ width: `${Math.min(overallPercent, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {budgets.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-[#d6ded7] bg-[#fbfcf8] p-10 text-center text-xs text-[#89948d]">
            No category budgets created yet. Click &quot;Add Category Budget&quot; to set your monthly limits!
          </div>
        ) : (
          budgets.map(b => {
            const spent = categorySpend[b.category] || 0
            const pct = Math.round((spent / Number(b.monthly_limit)) * 100)
            const isOver = pct >= 100
            const isWarning = pct >= 80 && !isOver

            return (
              <div
                key={b.id}
                className="rounded-2xl border border-[#e5e6df] bg-white p-5 shadow-[0_1px_2px_rgba(30,50,40,0.02)]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-semibold text-[#1d2d28]">{b.category}</h3>
                    <p className="mt-0.5 text-[11px] text-[#89948d]">
                      {currency}{spent.toFixed(2)} of {currency}{Number(b.monthly_limit).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenModal(b)}
                      className="rounded-lg p-1 text-[#8c9890] hover:bg-[#f1f4ef] hover:text-[#24463e]"
                    >
                      <Edit2 className="size-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteBudget(b.id)}
                      className="rounded-lg p-1 text-[#8c9890] hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-1.5 flex justify-between text-[11px] font-medium">
                    <span className={isOver ? 'text-red-600 font-bold' : isWarning ? 'text-[#a2782b]' : 'text-[#637268]'}>
                      {pct}% consumed
                    </span>
                    <span className="text-[#8c9890]">
                      {isOver
                        ? `Over by ${currency}${(spent - Number(b.monthly_limit)).toFixed(2)}`
                        : `${currency}${(Number(b.monthly_limit) - spent).toFixed(2)} left`}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#eef1eb]">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isOver ? 'bg-red-500' : isWarning ? 'bg-[#d7a84a]' : 'bg-[#24463e]'
                      }`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1 text-[10px]">
                  {isOver ? (
                    <span className="flex items-center gap-1 text-red-600 font-semibold">
                      <AlertCircle className="size-3" /> Exceeded limit
                    </span>
                  ) : isWarning ? (
                    <span className="flex items-center gap-1 text-[#a2782b] font-medium">
                      <AlertCircle className="size-3" /> Approaching limit
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[#468367] font-medium">
                      <CheckCircle2 className="size-3" /> On track
                    </span>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Add / Edit Budget Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#16251f]/40 p-4 backdrop-blur-xs" role="dialog">
          <div className="w-full max-w-sm rounded-2xl border border-[#dce4dd] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#1d2d28]">
                {editingBudget ? 'Edit Budget Limit' : 'Add Category Budget'}
              </h3>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1 text-[#89948d] hover:bg-[#f1f4ef]">
                <X className="size-4" />
              </button>
            </div>

            {error && (
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#48564e]">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-[#d6dfd7] bg-[#fafbf9] px-3 py-2 text-xs text-[#1d2d28]"
                >
                  {defaultCategoryOptions.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#48564e]">Monthly Limit ({currency})</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  required
                  placeholder="e.g. 500"
                  value={monthlyLimit}
                  onChange={e => setMonthlyLimit(e.target.value)}
                  className="w-full rounded-xl border border-[#d6dfd7] bg-[#fafbf9] px-3 py-2 text-xs text-[#1d2d28] outline-none focus:border-[#24463e]"
                />
              </div>

              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl px-3 py-2 text-xs font-semibold text-[#718078] hover:bg-[#f1f4ef]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-[#24463e] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1b3630] disabled:opacity-50"
                >
                  {loading ? 'Saving…' : 'Save Budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
