'use client'

import { useMemo } from 'react'
import {
  WalletCards,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Target,
  Lightbulb,
  AlertTriangle,
  Repeat2,
  Plus,
  Receipt,
  TrendingUp,
  Sparkles,
} from 'lucide-react'
import { Transaction, Budget, RecurringItem, Goal } from '@/lib/types'

interface OverviewTabProps {
  transactions: Transaction[]
  budgets: Budget[]
  recurring: RecurringItem[]
  goals: Goal[]
  currency: string
  onNavigate: (tab: string) => void
  onAddTransaction: () => void
  onImportCsv: () => void
  onGenerateReport: () => void
}

export function OverviewTab({
  transactions,
  budgets,
  recurring,
  goals,
  currency,
  onNavigate,
  onAddTransaction,
  onImportCsv,
  onGenerateReport,
}: OverviewTabProps) {
  // Calculations
  const currentMonthStr = new Date().toISOString().slice(0, 7)
  const currentMonthTx = transactions.filter(t => t.date && t.date.startsWith(currentMonthStr))
  const activeTx = currentMonthTx.length > 0 ? currentMonthTx : transactions

  const incomeTx = activeTx.filter(t => t.type === 'income' || t.amount > 0)
  const expenseTx = activeTx.filter(t => t.type === 'expense' || t.amount < 0)

  const totalIncome = useMemo(() => incomeTx.reduce((sum, t) => sum + Math.abs(t.amount), 0), [incomeTx])
  const totalSpent = useMemo(() => expenseTx.reduce((sum, t) => sum + Math.abs(t.amount), 0), [expenseTx])
  const netCashFlow = totalIncome - totalSpent

  // Upcoming recurring commitments
  const totalRecurring = useMemo(
    () => recurring.filter(r => r.active !== false).reduce((sum, r) => sum + Number(r.amount), 0),
    [recurring]
  )

  // Goals progress
  const goalProgress = useMemo(() => {
    if (!goals.length) return 0
    const totalTarget = goals.reduce((sum, g) => sum + Number(g.target_amount), 0)
    const totalSaved = goals.reduce((sum, g) => sum + Number(g.current_amount), 0)
    return totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0
  }, [goals])

  // Category breakdown
  const categorySummary = useMemo(() => {
    const map: Record<string, number> = {}
    for (const t of expenseTx) {
      const cat = t.category || 'Other'
      map[cat] = (map[cat] || 0) + Math.abs(t.amount)
    }
    const total = Object.values(map).reduce((sum, v) => sum + v, 0) || 1
    const colors = ['bg-[#24463e]', 'bg-[#d7a84a]', 'bg-[#7f9f96]', 'bg-[#baa4c7]', 'bg-[#d87e57]', 'bg-[#89948d]']
    
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, amount], i) => ({
        name,
        amount,
        percent: Math.round((amount / total) * 100),
        tone: colors[i % colors.length],
      }))
  }, [expenseTx])

  // Dynamic daily/grouped activity for bar visualization – always exactly 14 slots
  const activityBars = useMemo(() => {
    const SLOTS = 14
    // Build a map of the last 14 calendar days (keyed by YYYY-MM-DD)
    const today = new Date()
    const dayKeys: string[] = []
    for (let i = SLOTS - 1; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      dayKeys.push(d.toISOString().slice(0, 10))
    }

    if (activeTx.length === 0) {
      // Subtle placeholder pattern so the chart doesn't look broken
      return [20, 35, 45, 30, 60, 40, 55, 70, 45, 65, 50, 80, 60, 75]
    }

    const dayMap: Record<string, number> = {}
    for (const t of activeTx) {
      if (!t.date) continue
      const key = t.date.slice(0, 10)
      dayMap[key] = (dayMap[key] || 0) + Math.abs(t.amount)
    }

    const values = dayKeys.map(k => dayMap[k] || 0)
    const max = Math.max(...values, 1) // avoid division by zero
    // Each bar is a percentage of the peak day; minimum 8% so zero days are still visible as a tiny tick
    return values.map(v => v === 0 ? 8 : Math.max(15, Math.min(100, Math.round((v / max) * 100))))
  }, [activeTx])

  // Dynamic observations
  const observations = useMemo(() => {
    const list: { tone: 'green' | 'orange'; title: string; text: string }[] = []

    if (netCashFlow >= 0 && totalIncome > 0) {
      list.push({
        tone: 'green',
        title: 'Positive Cash Flow',
        text: `You have saved ${currency}${netCashFlow.toLocaleString(undefined, { minimumFractionDigits: 2 })} this month. Great job keeping expenses under total earnings!`,
      })
    } else if (totalSpent > totalIncome && totalIncome > 0) {
      list.push({
        tone: 'orange',
        title: 'Spending Exceeds Income',
        text: `Your current outgoings (${currency}${totalSpent.toFixed(2)}) exceed your recorded income (${currency}${totalIncome.toFixed(2)}) by ${currency}${Math.abs(netCashFlow).toFixed(2)}.`,
      })
    }

    if (categorySummary.length > 0 && categorySummary[0].percent > 40) {
      list.push({
        tone: 'orange',
        title: `High Concentration in ${categorySummary[0].name}`,
        text: `${categorySummary[0].name} accounts for ${categorySummary[0].percent}% of all your recorded spending this month.`,
      })
    } else if (goals.length > 0) {
      list.push({
        tone: 'green',
        title: 'Savings Goal Momentum',
        text: `You're currently ${goalProgress}% towards your aggregate financial milestones across ${goals.length} target(s).`,
      })
    }

    return list
  }, [netCashFlow, totalIncome, totalSpent, categorySummary, goals, goalProgress, currency])

  return (
    <div className="flex flex-col gap-6">
      {/* Top Stat Cards */}
      <section className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Net Flow */}
        <div className="rounded-2xl border border-[#e5e6df] bg-white p-5 shadow-[0_1px_2px_rgba(30,50,40,0.03)]">
          <div className="flex items-start justify-between">
            <p className="text-[13px] font-medium text-[#748078]">Cash flow this month</p>
            <WalletCards className="size-[18px] text-[#24463e]" strokeWidth={1.8} />
          </div>
          <p className="mt-3 text-[26px] font-semibold tracking-[-0.04em] text-[#1d2d28]">
            {netCashFlow >= 0 ? '+' : '-'}{currency}{Math.abs(netCashFlow).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="mt-2 flex items-center gap-1 text-xs font-medium text-[#748078]">
            <span className={netCashFlow >= 0 ? 'text-[#468367] flex items-center gap-0.5' : 'text-[#b06c43] flex items-center gap-0.5'}>
              {netCashFlow >= 0 ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
              {totalIncome > 0 ? `${Math.round((netCashFlow / totalIncome) * 100)}% net rate` : 'Real cash flow'}
            </span>
          </div>
        </div>

        {/* Total Spending */}
        <div className="rounded-2xl border border-[#e5e6df] bg-white p-5 shadow-[0_1px_2px_rgba(30,50,40,0.03)]">
          <div className="flex items-start justify-between">
            <p className="text-[13px] font-medium text-[#748078]">Total spending</p>
            <ArrowDownRight className="size-[18px] text-[#b06c43]" strokeWidth={1.8} />
          </div>
          <p className="mt-3 text-[26px] font-semibold tracking-[-0.04em] text-[#1d2d28]">
            {currency}{totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="mt-2 flex items-center gap-1 text-xs font-medium text-[#748078]">
            <span>{expenseTx.length} expense transactions</span>
          </div>
        </div>

        {/* Upcoming Commitments */}
        <div className="rounded-2xl border border-[#e5e6df] bg-white p-5 shadow-[0_1px_2px_rgba(30,50,40,0.03)]">
          <div className="flex items-start justify-between">
            <p className="text-[13px] font-medium text-[#748078]">Recurring commitments</p>
            <CalendarDays className="size-[18px] text-[#9b7a35]" strokeWidth={1.8} />
          </div>
          <p className="mt-3 text-[26px] font-semibold tracking-[-0.04em] text-[#1d2d28]">
            {currency}{totalRecurring.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="mt-2 flex items-center gap-1 text-xs font-medium text-[#748078]">
            <span>{recurring.length} active subscriptions/bills</span>
          </div>
        </div>

        {/* Goal Progress */}
        <div className="rounded-2xl border border-[#e5e6df] bg-white p-5 shadow-[0_1px_2px_rgba(30,50,40,0.03)]">
          <div className="flex items-start justify-between">
            <p className="text-[13px] font-medium text-[#748078]">Goal progress</p>
            <Target className="size-[18px] text-[#7a6592]" strokeWidth={1.8} />
          </div>
          <p className="mt-3 text-[26px] font-semibold tracking-[-0.04em] text-[#1d2d28]">
            {goalProgress}%
          </p>
          <div className="mt-2 flex items-center gap-1 text-xs font-medium text-[#468367]">
            <TrendingUp className="size-3.5" />
            <span>{goals.length} target goals tracked</span>
          </div>
        </div>
      </section>

      {/* Middle Section: Spending Activity & Category Breakdown */}
      <section className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        {/* Spending Overview Chart */}
        <div className="rounded-2xl border border-[#e5e6df] bg-white p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[#1d2d28]">Spending activity</h2>
              <p className="mt-0.5 text-xs text-[#89948d]">Daily rhythm & net cash balance</p>
            </div>
            <button
              onClick={() => onNavigate('Transactions')}
              className="text-xs font-medium text-[#24463e] hover:underline"
            >
              Ledger view →
            </button>
          </div>

          <div className="mt-6 grid grid-cols-[1fr_150px] items-center gap-5">
            <div className="h-[172px] rounded-xl bg-[#fbfcf8] p-3 border border-[#edf0eb]">
              <div className="flex h-full items-end gap-2 sm:gap-3">
                {activityBars.map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-[#cfe0d1] transition-all hover:bg-[#24463e]"
                    style={{ height: `${height}%` }}
                    title={`Activity index: ${height}%`}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-[11px] font-medium text-[#89948d]">Total Spent</p>
                <p className="mt-0.5 text-lg font-semibold text-[#1d2d28]">
                  {currency}{totalSpent.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-[#89948d]">Total Income</p>
                <p className="mt-0.5 text-lg font-semibold text-[#468367]">
                  {currency}{totalIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-medium text-[#24463e]">
                <Sparkles className="size-3" /> Real-time Supabase sync
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="rounded-2xl border border-[#e5e6df] bg-white p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[#1d2d28]">Spending by category</h2>
              <p className="mt-0.5 text-xs text-[#89948d]">Top expense distributions</p>
            </div>
            <button onClick={() => onNavigate('Budgets')} className="text-xs font-medium text-[#24463e] hover:underline">
              Budgets →
            </button>
          </div>

          <div className="mt-5 flex flex-col gap-4">
            {categorySummary.length === 0 ? (
              <p className="py-8 text-center text-xs text-[#89948d]">
                No expense transactions recorded yet.
              </p>
            ) : (
              categorySummary.map(cat => (
                <div key={cat.name}>
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span className="font-medium text-[#536159]">{cat.name}</span>
                    <span className="font-semibold text-[#1d2d28]">
                      {currency}{cat.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} ({cat.percent}%)
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#eef1eb]">
                    <div className={`h-full rounded-full ${cat.tone}`} style={{ width: `${cat.percent}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Bottom Section: Recent Transactions & Upcoming Commitments */}
      <section className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
        {/* Recent Transactions */}
        <div className="rounded-2xl border border-[#e5e6df] bg-white">
          <div className="flex items-center justify-between border-b border-[#edf0eb] p-5">
            <div>
              <h2 className="text-sm font-semibold text-[#1d2d28]">Recent activity</h2>
              <p className="mt-0.5 text-xs text-[#89948d]">Live transactions recorded in Supabase</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onAddTransaction}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#24463e] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1b3630]"
              >
                <Plus className="size-3.5" /> Add
              </button>
              <button
                onClick={() => onNavigate('Transactions')}
                className="text-xs font-semibold text-[#315b50] hover:underline"
              >
                See all →
              </button>
            </div>
          </div>

          <div className="divide-y divide-[#f0f2ee]">
            {transactions.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#89948d]">
                No transactions yet. Click &quot;Add&quot; or &quot;Import data&quot; to begin!
              </div>
            ) : (
              transactions.slice(0, 5).map((tx, idx) => (
                <div key={tx.id || idx} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#fafbf9]">
                  <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#e8f0e8] text-xs font-bold text-[#315646]">
                    {tx.merchant ? tx.merchant[0].toUpperCase() : 'T'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-[#1d2d28]">{tx.merchant}</p>
                    <p className="mt-0.5 truncate text-[10px] text-[#89948d]">{tx.detail || tx.category}</p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-[10px] text-[#89948d]">{tx.date}</p>
                    <span className="text-[10px] font-medium text-[#748078]">{tx.category}</span>
                  </div>
                  <p className={`text-xs font-semibold ${tx.type === 'income' || tx.amount > 0 ? 'text-[#468367]' : 'text-[#1d2d28]'}`}>
                    {tx.type === 'income' || tx.amount > 0 ? '+' : '-'}{currency}{Math.abs(tx.amount).toFixed(2)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Commitments */}
        <div className="rounded-2xl border border-[#e5e6df] bg-white p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[#1d2d28]">Upcoming recurring</h2>
              <p className="mt-0.5 text-xs text-[#89948d]">Subscriptions & regular obligations</p>
            </div>
            <button onClick={() => onNavigate('Recurring')} className="text-xs font-medium text-[#24463e] hover:underline">
              Manage →
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-2.5">
            {recurring.length === 0 ? (
              <p className="py-6 text-center text-xs text-[#89948d]">
                No recurring items added yet.
              </p>
            ) : (
              recurring.slice(0, 4).map(item => (
                <div key={item.id || item.name} className="flex items-center gap-3 rounded-xl bg-[#fbfcf8] p-3 border border-[#edf0eb]">
                  <div className="grid size-8 place-items-center rounded-lg bg-[#eef3ee] text-xs font-bold text-[#24463e]">
                    {item.name[0].toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#1d2d28]">{item.name}</p>
                    <p className="mt-0.5 text-[10px] text-[#89948d]">
                      {item.cadence} · Day {item.billing_day || 1}
                    </p>
                  </div>
                  <p className="text-xs font-semibold text-[#1d2d28]">
                    {currency}{Number(item.amount).toFixed(2)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Dynamic Observations */}
      {observations.length > 0 && (
        <section className="grid gap-6 md:grid-cols-2">
          {observations.map((obs, i) => (
            <div
              key={i}
              className={`rounded-2xl border p-5 ${
                obs.tone === 'green' ? 'border-[#dfebe2] bg-[#edf5ee]' : 'border-[#f0dfd2] bg-[#fff8f2]'
              }`}
            >
              <div className="flex gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-white shadow-2xs">
                  {obs.tone === 'green' ? (
                    <Lightbulb className="size-[18px] text-[#315646]" />
                  ) : (
                    <AlertTriangle className="size-[18px] text-[#b06c43]" />
                  )}
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#1d2d28]">{obs.title}</h2>
                  <p className="mt-1 text-[13px] leading-relaxed text-[#536159]">{obs.text}</p>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
