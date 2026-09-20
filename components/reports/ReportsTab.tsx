'use client'

import { useState } from 'react'
import { FileText, Sparkles, Copy, Check, Download, AlertCircle } from 'lucide-react'
import { Transaction, Budget, RecurringItem, Goal } from '@/lib/types'
import { buildFinancialContext } from '@/lib/gemini'

interface ReportsTabProps {
  transactions: Transaction[]
  budgets: Budget[]
  recurring: RecurringItem[]
  goals: Goal[]
  currency: string
  geminiKey: string
  onOpenGeminiModal: () => void
}

export function ReportsTab({
  transactions,
  budgets,
  recurring,
  goals,
  currency,
  geminiKey,
  onOpenGeminiModal,
}: ReportsTabProps) {
  const [report, setReport] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Current month stats
  const currentMonthStr = new Date().toISOString().slice(0, 7)
  const currentMonthTx = transactions.filter(t => t.date && t.date.startsWith(currentMonthStr))
  const relevantTx = currentMonthTx.length > 0 ? currentMonthTx : transactions

  const incomeTx = relevantTx.filter(t => t.type === 'income' || t.amount > 0)
  const expenseTx = relevantTx.filter(t => t.type === 'expense' || t.amount < 0)

  const totalIncome = incomeTx.reduce((sum, t) => sum + Math.abs(t.amount), 0)
  const totalExpenses = expenseTx.reduce((sum, t) => sum + Math.abs(t.amount), 0)
  const netCashFlow = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? Math.round((Math.max(0, netCashFlow) / totalIncome) * 100) : 0

  const handleGenerateAiReport = async () => {
    if (!geminiKey) {
      onOpenGeminiModal()
      return
    }

    setLoading(true)
    setError(null)
    setReport('')

    try {
      const context = buildFinancialContext(currency, transactions, budgets, recurring, goals)
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': geminiKey,
        },
        body: JSON.stringify({
          mode: 'report',
          apiKey: geminiKey,
          financialContext: context,
        }),
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate financial audit with Gemini.')
      }

      setReport(data.answer)
    } catch (err: any) {
      setError(err.message || 'Report generation failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!report) return
    navigator.clipboard.writeText(report)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-[#e5e6df] bg-white p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-[#24463e]" />
              <h2 className="text-sm font-semibold text-[#1d2d28]">Monthly Financial Intelligence & Audits</h2>
            </div>
            <p className="mt-1 text-xs text-[#89948d]">
              Audited from your live transactions, category budgets, and recurring subscriptions.
            </p>
          </div>
          <button
            onClick={handleGenerateAiReport}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-[#24463e] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1b3630] disabled:opacity-50"
          >
            <Sparkles className="size-3.5" />
            {loading ? 'Analyzing with Google Gemini…' : 'Generate Full AI Monthly Audit'}
          </button>
        </div>

        {/* Snapshot metrics */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-[#f7faf6] p-3 border border-[#edf3ec]">
            <p className="text-[11px] font-medium text-[#718078]">Total Inflow</p>
            <p className="mt-1 text-base font-semibold text-[#468367]">
              {currency}{totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="rounded-xl bg-[#f7faf6] p-3 border border-[#edf3ec]">
            <p className="text-[11px] font-medium text-[#718078]">Total Outflow</p>
            <p className="mt-1 text-base font-semibold text-[#1d2d28]">
              {currency}{totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="rounded-xl bg-[#f7faf6] p-3 border border-[#edf3ec]">
            <p className="text-[11px] font-medium text-[#718078]">Net Cash Flow</p>
            <p className={`mt-1 text-base font-semibold ${netCashFlow >= 0 ? 'text-[#468367]' : 'text-[#b06c43]'}`}>
              {netCashFlow >= 0 ? '+' : '-'}{currency}{Math.abs(netCashFlow).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="rounded-xl bg-[#f7faf6] p-3 border border-[#edf3ec]">
            <p className="text-[11px] font-medium text-[#718078]">Savings Rate</p>
            <p className="mt-1 text-base font-semibold text-[#24463e]">
              {savingsRate}%
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Generated Report Display */}
      {report && (
        <div className="rounded-2xl border border-[#dce8df] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#edf0eb] pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-[#24463e]" />
              <h3 className="text-sm font-semibold text-[#1d2d28]">FinPilot AI Financial Audit</h3>
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#d6dfd7] bg-[#fafbf9] px-2.5 py-1 text-xs font-semibold text-[#48564e] hover:bg-[#f2f6f1]"
            >
              {copied ? <Check className="size-3.5 text-[#24463e]" /> : <Copy className="size-3.5" />}
              {copied ? 'Copied' : 'Copy Report'}
            </button>
          </div>

          <div className="prose prose-sm mt-5 max-w-none text-xs leading-relaxed text-[#31443b] whitespace-pre-wrap">
            {report}
          </div>
        </div>
      )}
    </div>
  )
}
