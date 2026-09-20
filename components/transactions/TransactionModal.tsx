'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Receipt, Check } from 'lucide-react'
import { Transaction, TransactionType } from '@/lib/types'

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  currency: string
  transactionToEdit?: Transaction | null
  onSave: (data: Omit<Transaction, 'id'>, id?: string) => Promise<void>
}

const defaultCategories = [
  'Food & Dining',
  'Housing',
  'Utilities',
  'Transport',
  'Subscriptions',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Education',
  'Income',
  'Other',
]

export function TransactionModal({
  isOpen,
  onClose,
  currency,
  transactionToEdit,
  onSave,
}: TransactionModalProps) {
  const [type, setType] = useState<TransactionType>('expense')
  const [merchant, setMerchant] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food & Dining')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [detail, setDetail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (transactionToEdit) {
      setType(transactionToEdit.type || (transactionToEdit.amount > 0 ? 'income' : 'expense'))
      setMerchant(transactionToEdit.merchant || '')
      setAmount(String(Math.abs(transactionToEdit.amount) || ''))
      setCategory(transactionToEdit.category || 'Food & Dining')
      setDate(transactionToEdit.date || new Date().toISOString().slice(0, 10))
      setDetail(transactionToEdit.detail || '')
    } else {
      setType('expense')
      setMerchant('')
      setAmount('')
      setCategory('Food & Dining')
      setDate(new Date().toISOString().slice(0, 10))
      setDetail('')
    }
    setError(null)
  }, [transactionToEdit, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount greater than 0.')
      return
    }

    if (!merchant.trim()) {
      setError('Please provide a merchant or description.')
      return
    }

    setLoading(true)
    try {
      await onSave(
        {
          merchant: merchant.trim(),
          amount: type === 'expense' ? -Math.abs(parsedAmount) : Math.abs(parsedAmount),
          category: type === 'income' ? 'Income' : category,
          date,
          detail: detail.trim() || undefined,
          type,
        },
        transactionToEdit?.id
      )
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to save transaction.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#16251f]/40 p-4 backdrop-blur-xs" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-2xl border border-[#dce4dd] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl bg-[#24463e] text-white">
              <Receipt className="size-4" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#1d2d28]">
                {transactionToEdit ? 'Edit Transaction' : 'Add New Transaction'}
              </h2>
              <p className="text-xs text-[#718078]">Keep your personal financial ledger accurate</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1 text-[#89948d] hover:bg-[#f1f4ef]">
            <X className="size-4" />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3.5">
          {/* Type Selector (Expense vs Income) */}
          <div className="flex rounded-xl bg-[#f0f4ee] p-1">
            <button
              type="button"
              onClick={() => {
                setType('expense')
                if (category === 'Income') setCategory('Food & Dining')
              }}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                type === 'expense'
                  ? 'bg-white text-[#24463e] shadow-xs'
                  : 'text-[#6e7d73] hover:text-[#24463e]'
              }`}
            >
              Expense (-)
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income')
                setCategory('Income')
              }}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                type === 'income'
                  ? 'bg-white text-[#24463e] shadow-xs'
                  : 'text-[#6e7d73] hover:text-[#24463e]'
              }`}
            >
              Income (+)
            </button>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#48564e]">Merchant or Payee</label>
            <input
              type="text"
              required
              placeholder="e.g. Trader Joe's, Netflix, Salary"
              value={merchant}
              onChange={e => setMerchant(e.target.value)}
              className="w-full rounded-xl border border-[#d6dfd7] bg-[#fafbf9] px-3 py-2 text-xs text-[#1d2d28] outline-none focus:border-[#24463e] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#48564e]">Amount ({currency})</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full rounded-xl border border-[#d6dfd7] bg-[#fafbf9] px-3 py-2 text-xs text-[#1d2d28] outline-none focus:border-[#24463e] focus:bg-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#48564e]">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full rounded-xl border border-[#d6dfd7] bg-[#fafbf9] px-3 py-2 text-xs text-[#1d2d28] outline-none focus:border-[#24463e] focus:bg-white"
              />
            </div>
          </div>

          {type === 'expense' && (
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#48564e]">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full rounded-xl border border-[#d6dfd7] bg-[#fafbf9] px-3 py-2 text-xs text-[#1d2d28] outline-none focus:border-[#24463e] focus:bg-white"
              >
                {defaultCategories.filter(c => c !== 'Income').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#48564e]">Notes / Account (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Visa •• 4821, Grocery run"
              value={detail}
              onChange={e => setDetail(e.target.value)}
              className="w-full rounded-xl border border-[#d6dfd7] bg-[#fafbf9] px-3 py-2 text-xs text-[#1d2d28] outline-none focus:border-[#24463e] focus:bg-white"
            />
          </div>

          <div className="mt-3 flex items-center justify-end gap-2 border-t border-[#edf0eb] pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-[#718078] hover:bg-[#f1f4ef]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#24463e] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1b3630] disabled:opacity-50"
            >
              <Check className="size-3.5" />
              {loading ? 'Saving…' : transactionToEdit ? 'Update Transaction' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
