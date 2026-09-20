'use client'

import { useState } from 'react'
import { Plus, Target, CheckCircle2, Trash2, Edit2, X, DollarSign } from 'lucide-react'
import { Goal } from '@/lib/types'

interface GoalsTabProps {
  goals: Goal[]
  currency: string
  onSaveGoal: (goal: Omit<Goal, 'id'>, id?: string) => Promise<void>
  onDeleteGoal: (id: string) => Promise<void>
  onAddFunds: (goalId: string, currentAmount: number, additional: number) => Promise<void>
}

export function GoalsTab({
  goals,
  currency,
  onSaveGoal,
  onDeleteGoal,
  onAddFunds,
}: GoalsTabProps) {
  const [showModal, setShowModal] = useState(false)
  const [showFundsModal, setShowFundsModal] = useState(false)
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null)
  const [fundAmount, setFundAmount] = useState('')
  const [title, setTitle] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [currentAmount, setCurrentAmount] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOpenModal = (goal?: Goal) => {
    if (goal) {
      setActiveGoal(goal)
      setTitle(goal.title)
      setTargetAmount(String(goal.target_amount))
      setCurrentAmount(String(goal.current_amount))
      setTargetDate(goal.target_date || '')
    } else {
      setActiveGoal(null)
      setTitle('')
      setTargetAmount('')
      setCurrentAmount('0')
      setTargetDate('')
    }
    setError(null)
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const target = parseFloat(targetAmount)
    const current = parseFloat(currentAmount) || 0

    if (isNaN(target) || target <= 0) {
      setError('Please provide a target amount greater than 0.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await onSaveGoal(
        {
          title: title.trim(),
          target_amount: target,
          current_amount: current,
          target_date: targetDate || undefined,
        },
        activeGoal?.id
      )
      setShowModal(false)
    } catch (err: any) {
      setError(err.message || 'Failed to save goal.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddFundsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeGoal) return
    const add = parseFloat(fundAmount)
    if (isNaN(add) || add <= 0) return

    setLoading(true)
    try {
      await onAddFunds(activeGoal.id, Number(activeGoal.current_amount), add)
      setShowFundsModal(false)
      setFundAmount('')
    } catch (err: any) {
      setError(err.message || 'Failed to add funds.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-[#e5e6df] bg-white p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <Target className="size-4 text-[#24463e]" />
              <h2 className="text-sm font-semibold text-[#1d2d28]">Savings Goals & Milestones</h2>
            </div>
            <p className="mt-1 text-xs text-[#89948d]">
              Track progress toward an emergency fund, travel, home deposit, or personal milestones.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#24463e] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1b3630]"
          >
            <Plus className="size-3.5" /> Create Goal
          </button>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {goals.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-[#d6ded7] bg-[#fbfcf8] p-10 text-center text-xs text-[#89948d]">
            No savings goals established. Set up an emergency fund or trip goal to stay motivated!
          </div>
        ) : (
          goals.map(goal => {
            const pct =
              Number(goal.target_amount) > 0
                ? Math.min(100, Math.round((Number(goal.current_amount) / Number(goal.target_amount)) * 100))
                : 0
            const isComplete = pct >= 100

            return (
              <div
                key={goal.id}
                className="flex flex-col justify-between rounded-2xl border border-[#e5e6df] bg-white p-5 shadow-[0_1px_2px_rgba(30,50,40,0.02)]"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xs font-semibold text-[#1d2d28]">{goal.title}</h3>
                      {goal.target_date && (
                        <p className="mt-0.5 text-[10px] text-[#89948d]">Target by {goal.target_date}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenModal(goal)}
                        className="rounded-lg p-1 text-[#8c9890] hover:bg-[#f1f4ef] hover:text-[#24463e]"
                      >
                        <Edit2 className="size-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteGoal(goal.id)}
                        className="rounded-lg p-1 text-[#8c9890] hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-1.5 flex justify-between text-xs">
                      <span className="font-semibold text-[#1d2d28]">
                        {currency}{Number(goal.current_amount).toLocaleString()}
                      </span>
                      <span className="text-[#89948d]">
                        of {currency}{Number(goal.target_amount).toLocaleString()} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#eef1eb]">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isComplete ? 'bg-[#468367]' : 'bg-[#24463e]'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[#f2f4f0] pt-3">
                  <span className="text-[11px] font-medium text-[#6c7b72]">
                    {isComplete ? 'Goal achieved! 🎉' : `${currency}${(Number(goal.target_amount) - Number(goal.current_amount)).toLocaleString()} to go`}
                  </span>
                  <button
                    onClick={() => {
                      setActiveGoal(goal)
                      setFundAmount('')
                      setShowFundsModal(true)
                    }}
                    className="inline-flex items-center gap-1 rounded-lg bg-[#edf4ee] px-2.5 py-1 text-[11px] font-semibold text-[#24463e] hover:bg-[#dce9dd]"
                  >
                    + Add funds
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Add / Edit Goal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#16251f]/40 p-4 backdrop-blur-xs" role="dialog">
          <div className="w-full max-w-sm rounded-2xl border border-[#dce4dd] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#1d2d28]">
                {activeGoal ? 'Edit Savings Goal' : 'Create New Goal'}
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
                <label className="mb-1 block text-xs font-semibold text-[#48564e]">Goal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Emergency Fund, Japan Trip"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#d6dfd7] bg-[#fafbf9] px-3 py-2 text-xs text-[#1d2d28] outline-none focus:border-[#24463e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#48564e]">Target Amount ({currency})</label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
                    placeholder="5000"
                    value={targetAmount}
                    onChange={e => setTargetAmount(e.target.value)}
                    className="w-full rounded-xl border border-[#d6dfd7] bg-[#fafbf9] px-3 py-2 text-xs text-[#1d2d28] outline-none focus:border-[#24463e]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#48564e]">Current Saved ({currency})</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    placeholder="0"
                    value={currentAmount}
                    onChange={e => setCurrentAmount(e.target.value)}
                    className="w-full rounded-xl border border-[#d6dfd7] bg-[#fafbf9] px-3 py-2 text-xs text-[#1d2d28] outline-none focus:border-[#24463e]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#48564e]">Target Date (Optional)</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={e => setTargetDate(e.target.value)}
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
                  {loading ? 'Saving…' : 'Save Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Funds Modal */}
      {showFundsModal && activeGoal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#16251f]/40 p-4 backdrop-blur-xs" role="dialog">
          <div className="w-full max-w-sm rounded-2xl border border-[#dce4dd] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#1d2d28]">
                Add Funds to {activeGoal.title}
              </h3>
              <button onClick={() => setShowFundsModal(false)} className="rounded-lg p-1 text-[#89948d] hover:bg-[#f1f4ef]">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddFundsSubmit} className="mt-4 flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#48564e]">Amount to Add ({currency})</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  autoFocus
                  placeholder="100.00"
                  value={fundAmount}
                  onChange={e => setFundAmount(e.target.value)}
                  className="w-full rounded-xl border border-[#d6dfd7] bg-[#fafbf9] px-3 py-2 text-xs text-[#1d2d28] outline-none focus:border-[#24463e]"
                />
              </div>

              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFundsModal(false)}
                  className="rounded-xl px-3 py-2 text-xs font-semibold text-[#718078] hover:bg-[#f1f4ef]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-[#24463e] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1b3630] disabled:opacity-50"
                >
                  {loading ? 'Adding…' : 'Deposit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
