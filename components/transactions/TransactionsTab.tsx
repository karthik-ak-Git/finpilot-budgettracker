'use client'

import { useState, useMemo } from 'react'
import { Plus, Search, Filter, Trash2, Edit2, Download, Upload, ArrowUpDown } from 'lucide-react'
import { Transaction } from '@/lib/types'

interface TransactionsTabProps {
  transactions: Transaction[]
  currency: string
  onAdd: () => void
  onImport: () => void
  onEdit: (tx: Transaction) => void
  onDelete: (id: string) => Promise<void>
}

export function TransactionsTab({
  transactions,
  currency,
  onAdd,
  onImport,
  onEdit,
  onDelete,
}: TransactionsTabProps) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState<'all' | 'expense' | 'income'>('all')
  const [sortField, setSortField] = useState<'date' | 'amount'>('date')
  const [sortAsc, setSortAsc] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Unique categories list
  const categories = useMemo(() => {
    const set = new Set<string>()
    transactions.forEach(t => t.category && set.add(t.category))
    return ['All', ...Array.from(set).sort()]
  }, [transactions])

  // Filtered and sorted transactions
  const filtered = useMemo(() => {
    return transactions
      .filter(tx => {
        const matchesSearch =
          !search ||
          tx.merchant.toLowerCase().includes(search.toLowerCase()) ||
          (tx.detail && tx.detail.toLowerCase().includes(search.toLowerCase()))

        const matchesCat = categoryFilter === 'All' || tx.category === categoryFilter

        const matchesType =
          typeFilter === 'all' ||
          (typeFilter === 'income' && (tx.type === 'income' || tx.amount > 0)) ||
          (typeFilter === 'expense' && (tx.type === 'expense' || tx.amount < 0))

        return matchesSearch && matchesCat && matchesType
      })
      .sort((a, b) => {
        if (sortField === 'date') {
          const dateA = new Date(a.date).getTime()
          const dateB = new Date(b.date).getTime()
          return sortAsc ? dateA - dateB : dateB - dateA
        } else {
          const amtA = Math.abs(a.amount)
          const amtB = Math.abs(b.amount)
          return sortAsc ? amtA - amtB : amtB - amtA
        }
      })
  }, [transactions, search, categoryFilter, typeFilter, sortField, sortAsc])

  // CSV Export helper
  const handleExportCsv = () => {
    if (filtered.length === 0) return
    const headers = ['Date', 'Merchant', 'Category', 'Type', 'Amount', 'Detail']
    const rows = filtered.map(t => [
      t.date,
      `"${t.merchant.replace(/"/g, '""')}"`,
      `"${(t.category || '').replace(/"/g, '""')}"`,
      t.type || (t.amount > 0 ? 'income' : 'expense'),
      Math.abs(t.amount).toFixed(2),
      `"${(t.detail || '').replace(/"/g, '""')}"`,
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `finpilot-transactions-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDeleteClick = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return
    setDeletingId(id)
    try {
      await onDelete(id)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="rounded-2xl border border-[#e5e6df] bg-white">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 border-b border-[#edf0eb] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[#1d2d28]">Transaction Ledger</h2>
          <p className="mt-0.5 text-xs text-[#89948d]">
            {filtered.length} of {transactions.length} transactions shown
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCsv}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#dce3dc] bg-[#fafbf9] px-3 py-2 text-xs font-semibold text-[#4b5a51] hover:bg-[#f2f6f1] disabled:opacity-40"
          >
            <Download className="size-3.5" /> Export CSV
          </button>
          <button
            onClick={onImport}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#dce3dc] bg-white px-3 py-2 text-xs font-semibold text-[#24463e] shadow-2xs hover:bg-[#f7faf6]"
          >
            <Upload className="size-3.5" /> Import CSV
          </button>
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#24463e] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1b3630]"
          >
            <Plus className="size-3.5" /> Add Record
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 border-b border-[#edf0eb] bg-[#fafbf9] p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-[#d6ded7] bg-white px-3 py-2 sm:max-w-[280px]">
          <Search className="size-3.5 text-[#8c9890]" />
          <input
            type="text"
            placeholder="Search merchant or detail…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs text-[#1d2d28] outline-none placeholder:text-[#9ea8a1]"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Type Filter */}
          <div className="flex rounded-xl border border-[#d6ded7] bg-white p-0.5 text-xs">
            {(['all', 'expense', 'income'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold capitalize transition ${
                  typeFilter === t ? 'bg-[#24463e] text-white' : 'text-[#637268] hover:text-[#1d2d28]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-[#d6ded7] bg-white px-2.5 py-1.5 text-xs text-[#31443b] outline-none"
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c === 'All' ? 'All Categories' : c}
              </option>
            ))}
          </select>

          {/* Sort Field */}
          <button
            onClick={() => {
              if (sortField === 'date') setSortAsc(!sortAsc)
              else {
                setSortField('date')
                setSortAsc(false)
              }
            }}
            className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-medium transition ${
              sortField === 'date'
                ? 'border-[#24463e] bg-[#eef4ef] text-[#24463e]'
                : 'border-[#d6ded7] bg-white text-[#637268]'
            }`}
          >
            <ArrowUpDown className="size-3" /> Date {sortField === 'date' && (sortAsc ? '↑' : '↓')}
          </button>

          <button
            onClick={() => {
              if (sortField === 'amount') setSortAsc(!sortAsc)
              else {
                setSortField('amount')
                setSortAsc(false)
              }
            }}
            className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-medium transition ${
              sortField === 'amount'
                ? 'border-[#24463e] bg-[#eef4ef] text-[#24463e]'
                : 'border-[#d6ded7] bg-white text-[#637268]'
            }`}
          >
            <ArrowUpDown className="size-3" /> Amount {sortField === 'amount' && (sortAsc ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="divide-y divide-[#f0f2ee]">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-xs text-[#89948d]">
            No transactions match the selected filters.
          </div>
        ) : (
          filtered.map(tx => {
            const isIncome = tx.type === 'income' || tx.amount > 0
            return (
              <div
                key={tx.id}
                className="flex items-center justify-between gap-3 px-5 py-3.5 transition hover:bg-[#fafbf9]"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#e8f0e8] text-xs font-bold text-[#315646]">
                    {tx.merchant ? tx.merchant[0].toUpperCase() : 'T'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-[#1d2d28]">{tx.merchant}</p>
                    <p className="mt-0.5 truncate text-[10px] text-[#89948d]">
                      {tx.detail || 'Standard Transaction'}
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex flex-col items-end text-right">
                  <p className="text-[10px] text-[#89948d]">{tx.date}</p>
                  <span className="mt-0.5 inline-block rounded-md bg-[#eef2ec] px-1.5 py-0.5 text-[10px] font-medium text-[#48564d]">
                    {tx.category || 'General'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <p className={`text-xs font-semibold ${isIncome ? 'text-[#468367]' : 'text-[#1d2d28]'}`}>
                    {isIncome ? '+' : '-'}{currency}{Math.abs(tx.amount).toFixed(2)}
                  </p>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEdit(tx)}
                      title="Edit transaction"
                      className="rounded-lg p-1.5 text-[#8a968e] hover:bg-[#eef2ec] hover:text-[#24463e]"
                    >
                      <Edit2 className="size-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(tx.id)}
                      disabled={deletingId === tx.id}
                      title="Delete transaction"
                      className="rounded-lg p-1.5 text-[#8a968e] hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
