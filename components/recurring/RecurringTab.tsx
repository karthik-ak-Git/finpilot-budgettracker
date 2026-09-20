'use client'

import { useState, useMemo } from 'react'
import { Plus, Repeat2, Calendar, Trash2, Edit2, X, Check } from 'lucide-react'
import { RecurringItem } from '@/lib/types'

interface RecurringTabProps {
  recurring: RecurringItem[]
  currency: string
  onSaveRecurring: (item: Omit<RecurringItem, 'id'>, id?: string) => Promise<void>
  onDeleteRecurring: (id: string) => Promise<void>
}

export function RecurringTab({
  recurring,
  currency,
  onSaveRecurring,
  onDeleteRecurring,
}: RecurringTabProps) {
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<RecurringItem | null>(null)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [cadence, setCadence] = useState<'monthly' | 'yearly' | 'weekly'>('monthly')
  const [billingDay, setBillingDay] = useState('1')
  const [category, setCategory] = useState('Subscriptions')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalMonthly = useMemo(() => {
    return recurring
      .filter(r => r.active !== false)
      .reduce((sum, r) => {
        const amt = Number(r.amount) || 0
        if (r.cadence === 'yearly') return sum + amt / 12
        if (r.cadence === 'weekly') return sum + (amt * 52) / 12
        return sum + amt
      }, 0)
  }, [recurring])

  const handleOpenModal = (item?: RecurringItem) => {
    if (item) {
      setEditingItem(item)
      setName(item.name)
      setAmount(String(item.amount))
      setCadence(item.cadence)
      setBillingDay(String(item.billing_day || 1))
      setCategory(item.category || 'Subscriptions')
    } else {
      setEditingItem(null)
      setName('')
      setAmount('')
      setCadence('monthly')
      setBillingDay('1')
      setCategory('Subscriptions')
    }
    setError(null)
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please provide a valid amount.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await onSaveRecurring(
        {
          name: name.trim(),
          amount: parsedAmount,
          cadence,
          billing_day: parseInt(billingDay, 10) || 1,
          category,
          active: true,
        },
        editingItem?.id
      )
      setShowModal(false)
    } catch (err: any) {
      setError(err.message || 'Failed to save recurring item.')
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
              <Repeat2 className="size-4 text-[#24463e]" />
              <h2 className="text-sm font-semibold text-[#1d2d28]">Recurring Payments & Subscriptions</h2>
            </div>
            <p className="mt-1 text-xs text-[#89948d]">
              Total monthly commitment: <strong className="text-[#1d2d28] font-semibold">{currency}{totalMonthly.toFixed(2)}/mo</strong> across {recurring.length} regular services
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#24463e] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1b3630]"
          >
            <Plus className="size-3.5" /> Add Subscription / Bill
          </button>
        </div>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {recurring.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-[#d6ded7] bg-[#fbfcf8] p-10 text-center text-xs text-[#89948d]">
            No recurring payments configured. Track Spotify, Netflix, Rent, Gym, and Internet to keep on top of billing!
          </div>
        ) : (
          recurring.map(item => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-[#e5e6df] bg-white p-5 shadow-[0_1px_2px_rgba(30,50,40,0.02)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid size-9 place-items-center rounded-xl bg-[#eef3ee] text-xs font-bold text-[#24463e]">
                    {item.name[0]?.toUpperCase() || 'R'}
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-[#1d2d28]">{item.name}</h3>
                    <p className="text-[11px] text-[#89948d] capitalize">
                      {item.cadence} · {item.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="rounded-lg p-1 text-[#8c9890] hover:bg-[#f1f4ef] hover:text-[#24463e]"
                  >
                    <Edit2 className="size-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteRecurring(item.id)}
                    className="rounded-lg p-1 text-[#8c9890] hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#f2f4f0] pt-3 text-xs">
                <div className="flex items-center gap-1.5 text-[11px] text-[#6c7b72]">
                  <Calendar className="size-3.5 text-[#8c9890]" />
                  <span>Bills on day {item.billing_day || 1}</span>
                </div>
                <p className="text-sm font-semibold text-[#1d2d28]">
                  {currency}{Number(item.amount).toFixed(2)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#16251f]/40 p-4 backdrop-blur-xs" role="dialog">
          <div className="w-full max-w-sm rounded-2xl border border-[#dce4dd] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#1d2d28]">
                {editingItem ? 'Edit Recurring Item' : 'Add Recurring Service'}
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
                <label className="mb-1 block text-xs font-semibold text-[#48564e]">Service or Bill Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Netflix, Gym, Rent, Spotify"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#d6dfd7] bg-[#fafbf9] px-3 py-2 text-xs text-[#1d2d28] outline-none focus:border-[#24463e]"
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
                    placeholder="15.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full rounded-xl border border-[#d6dfd7] bg-[#fafbf9] px-3 py-2 text-xs text-[#1d2d28] outline-none focus:border-[#24463e]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#48564e]">Cadence</label>
                  <select
                    value={cadence}
                    onChange={e => setCadence(e.target.value as any)}
                    className="w-full rounded-xl border border-[#d6dfd7] bg-[#fafbf9] px-3 py-2 text-xs text-[#1d2d28]"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#48564e]">Billing Day (1-31)</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    required
                    value={billingDay}
                    onChange={e => setBillingDay(e.target.value)}
                    className="w-full rounded-xl border border-[#d6dfd7] bg-[#fafbf9] px-3 py-2 text-xs text-[#1d2d28] outline-none focus:border-[#24463e]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#48564e]">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-[#d6dfd7] bg-[#fafbf9] px-3 py-2 text-xs text-[#1d2d28] outline-none focus:border-[#24463e]"
                  />
                </div>
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
                  {loading ? 'Saving…' : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
