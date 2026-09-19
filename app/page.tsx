'use client'

import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Bot,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  FileUp,
  Filter,
  Home,
  LayoutDashboard,
  Lightbulb,
  MoreHorizontal,
  Paperclip,
  Plus,
  Receipt,
  Repeat2,
  Search,
  Settings2,
  Sparkles,
  Target,
  Upload,
  WalletCards,
  X,
} from 'lucide-react'

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Transactions', icon: Receipt },
  { label: 'Recurring', icon: Repeat2 },
  { label: 'Budgets', icon: BarChart3 },
  { label: 'Goals', icon: Target },
  { label: 'Reports', icon: FileUp },
]

const transactions = [
  { merchant: 'Whole Foods Market', detail: 'Groceries · Visa •• 4821', date: 'Sep 18, 2026', amount: '-$86.42', category: 'Food', color: 'bg-emerald-100 text-emerald-700', mark: 'W' },
  { merchant: 'Acme Utilities', detail: 'Utilities · Checking •• 1092', date: 'Sep 17, 2026', amount: '-$142.18', category: 'Utilities', color: 'bg-amber-100 text-amber-700', mark: 'A' },
  { merchant: 'Stripe payout', detail: 'Income · Checking •• 1092', date: 'Sep 16, 2026', amount: '+$2,450.00', category: 'Income', color: 'bg-sky-100 text-sky-700', mark: 'S' },
  { merchant: 'Netflix.com', detail: 'Subscription · Visa •• 4821', date: 'Sep 15, 2026', amount: '-$22.99', category: 'Subscriptions', color: 'bg-violet-100 text-violet-700', mark: 'N' },
  { merchant: 'Metro Transit', detail: 'Transport · Visa •• 4821', date: 'Sep 14, 2026', amount: '-$48.00', category: 'Transport', color: 'bg-orange-100 text-orange-700', mark: 'M' },
]

const subscriptions = [
  { name: 'Netflix', cadence: 'Monthly · next Sep 22', amount: '$22.99', tone: 'bg-red-100 text-red-700', initial: 'N' },
  { name: 'Notion', cadence: 'Monthly · next Sep 24', amount: '$12.00', tone: 'bg-slate-100 text-slate-700', initial: 'N' },
  { name: 'Spotify', cadence: 'Monthly · next Sep 28', amount: '$11.99', tone: 'bg-green-100 text-green-700', initial: 'S' },
]

const categoryBars = [
  { name: 'Housing', amount: '$1,850', width: '92%', tone: 'bg-[#24463e]' },
  { name: 'Food & dining', amount: '$624', width: '57%', tone: 'bg-[#d7a84a]' },
  { name: 'Transport', amount: '$318', width: '35%', tone: 'bg-[#7f9f96]' },
  { name: 'Subscriptions', amount: '$146', width: '16%', tone: 'bg-[#baa4c7]' },
]

function StatCard({ label, value, change, positive, icon: Icon, accent = 'text-[#24463e]' }: { label: string; value: string; change: string; positive?: boolean; icon: typeof WalletCards; accent?: string }) {
  return (
    <div className="rounded-2xl border border-[#e5e6df] bg-white p-5 shadow-[0_1px_2px_rgba(30,50,40,0.03)]">
      <div className="flex items-start justify-between"><p className="text-[13px] font-medium text-[#748078]">{label}</p><Icon className={`size-[18px] ${accent}`} strokeWidth={1.8} /></div>
      <p className="mt-3 text-[27px] font-semibold tracking-[-0.04em] text-[#1d2d28]">{value}</p>
      <div className="mt-2 flex items-center gap-1 text-xs font-medium text-[#748078]"><span className={positive ? 'text-[#468367]' : 'text-[#b06c43]'}>{positive ? <ArrowUpRight className="inline size-3.5" /> : <ArrowDownRight className="inline size-3.5" />}{change}</span> vs last month</div>
    </div>
  )
}

export default function Page() {
  const [active, setActive] = useState('Overview')
  const [showUpload, setShowUpload] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [uploaded, setUploaded] = useState(false)

  const answerText = useMemo(() => {
    if (!question) return ''
    const q = question.toLowerCase()
    if (q.includes('subscription')) return 'You have 3 recurring subscriptions totaling $46.98/month: Netflix, Notion, and Spotify. Netflix is your largest subscription at $22.99.'
    if (q.includes('increased') || q.includes('last month')) return 'Food & dining increased the most, up 12% from August. Utilities also rose by $18 due to a higher summer bill.'
    if (q.includes('budget') || q.includes('committed')) return 'You have committed $2,784 of your $3,500 monthly budget (79%). Housing accounts for the largest share at $1,850.'
    return 'This month, Housing is your largest expense at $1,850, followed by Food & dining at $624. You are spending $684 less than your income so far.'
  }, [question])

  function ask(e: React.FormEvent) { e.preventDefault(); if (question.trim()) setAnswer(answerText) }

  return (
    <div className="min-h-screen bg-[#f6f7f2] text-[#1d2d28]">
      <aside className="fixed inset-y-0 left-0 hidden w-[232px] border-r border-[#e4e8df] bg-[#fbfcf8] px-4 py-6 lg:flex lg:flex-col">
        <div className="flex items-center gap-2 px-3"><div className="grid size-8 place-items-center rounded-xl bg-[#24463e] text-white"><Sparkles className="size-4" /></div><span className="text-[17px] font-semibold tracking-[-0.03em]">FinPilot</span></div>
        <p className="mb-3 mt-10 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#a0aaa2]">Workspace</p>
        <nav className="flex flex-col gap-1">{navItems.map((item) => <button key={item.label} onClick={() => setActive(item.label)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition ${active === item.label ? 'bg-[#e7efe9] text-[#24463e]' : 'text-[#718078] hover:bg-[#f0f4ed]'}`}><item.icon className="size-[17px]" strokeWidth={1.8} />{item.label}</button>)}</nav>
        <div className="mt-auto rounded-2xl bg-[#edf2ea] p-4"><div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-white text-[#24463e]"><CircleHelp className="size-4" /></div><p className="text-xs font-semibold text-[#31443b]">Need a hand?</p><p className="mt-1 text-[11px] leading-relaxed text-[#718078]">Ask FinPilot about your spending anytime.</p><button className="mt-3 text-[11px] font-semibold text-[#24463e]">Learn more →</button></div>
        <div className="mt-5 flex items-center gap-3 border-t border-[#e4e8df] px-3 pt-5"><div className="grid size-8 place-items-center rounded-full bg-[#d4e1d4] text-xs font-bold text-[#315646]">JD</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">Jordan Davis</p><p className="text-[10px] text-[#89948d]">Personal workspace</p></div><Settings2 className="size-4 text-[#89948d]" /></div>
      </aside>

      <main className="lg:pl-[232px]">
        <header className="flex h-[76px] items-center justify-between border-b border-[#e5e8e0] bg-[#fbfcf8] px-5 sm:px-8 lg:px-10"><div className="flex items-center gap-3 lg:hidden"><div className="grid size-8 place-items-center rounded-xl bg-[#24463e] text-white"><Sparkles className="size-4" /></div><span className="font-semibold">FinPilot</span></div><div className="hidden items-center gap-2 text-xs text-[#77847d] lg:flex"><Home className="size-3.5" /> / <span className="font-medium text-[#31443b]">{active}</span></div><div className="flex items-center gap-3"><button className="relative rounded-lg p-2 text-[#718078] hover:bg-[#eef2ec]"><Bell className="size-[18px]" /><span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#d87e57]" /></button><button className="flex items-center gap-2 rounded-lg border border-[#e1e6de] bg-white px-2.5 py-1.5 text-xs font-medium"><span className="grid size-6 place-items-center rounded-full bg-[#d4e1d4] text-[10px] font-bold text-[#315646]">JD</span><ChevronDown className="size-3.5 text-[#8c9890]" /></button></div></header>

        <div className="mx-auto max-w-[1320px] px-5 py-7 sm:px-8 lg:px-10">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-1 text-xs font-medium text-[#89948d]">Friday, September 19, 2026</p><h1 className="text-[30px] font-semibold tracking-[-0.05em] text-[#1d2d28]">Good morning, Jordan <span aria-hidden="true">.</span></h1><p className="mt-1 text-sm text-[#748078]">Here&apos;s your money at a glance.</p></div><div className="flex gap-2"><button onClick={() => setShowUpload(true)} className="inline-flex items-center gap-2 rounded-xl border border-[#d9e1d8] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#315646] shadow-sm hover:bg-[#f7faf6]"><Upload className="size-4" /> Import data</button><button onClick={() => setShowReport(true)} className="inline-flex items-center gap-2 rounded-xl bg-[#24463e] px-3.5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#315b50]"><FileUp className="size-4" /> Monthly report</button></div></div>

          {active === 'Overview' ? <>
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Cash flow this month" value="+$684.20" change="8.4%" positive icon={WalletCards} /><StatCard label="Total spending" value="$3,186.48" change="4.2%" icon={ArrowDownRight} accent="text-[#b06c43]" /><StatCard label="Upcoming commitments" value="$1,248.00" change="12.1%" icon={CalendarDays} accent="text-[#9b7a35]" /><StatCard label="Goal progress" value="42.6%" change="6.8%" positive icon={Target} accent="text-[#7a6592]" /></section>
            <section className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_1fr]"><div className="rounded-2xl border border-[#e5e6df] bg-white p-5"><div className="flex items-start justify-between"><div><h2 className="text-sm font-semibold">Spending overview</h2><p className="mt-1 text-xs text-[#89948d]">September 2026 · all accounts</p></div><button className="flex items-center gap-1.5 rounded-lg border border-[#e4e8e0] px-2.5 py-1.5 text-[11px] font-medium text-[#647169]">This month <ChevronDown className="size-3" /></button></div><div className="mt-6 grid grid-cols-[1fr_150px] items-center gap-5"><div className="h-[172px] rounded-xl bg-[#fbfcf8] p-3"><div className="flex h-full items-end gap-2 sm:gap-4">{[36,49,42,64,55,68,52,74,62,78,70,83,67,91,76,86,71,80,88,72,95,82,89,74,91,84,98,87,94,80].map((height, i) => <div key={i} className="flex-1 rounded-t-sm bg-[#cfe0d1]" style={{ height: `${height}%` }} />)}</div></div><div className="flex flex-col gap-3"><div><p className="text-[11px] text-[#89948d]">Spent</p><p className="mt-0.5 text-lg font-semibold">$3,186</p></div><div><p className="text-[11px] text-[#89948d]">Income</p><p className="mt-0.5 text-lg font-semibold text-[#468367]">$3,870</p></div><div className="flex items-center gap-1 text-[11px] text-[#468367]"><ArrowUpRight className="size-3" /> 8.4% net flow</div></div></div></div><div className="rounded-2xl border border-[#e5e6df] bg-white p-5"><div className="flex items-start justify-between"><div><h2 className="text-sm font-semibold">Spending by category</h2><p className="mt-1 text-xs text-[#89948d]">Top categories this month</p></div><MoreHorizontal className="size-4 text-[#9aa39d]" /></div><div className="mt-5 flex flex-col gap-4">{categoryBars.map((bar) => <div key={bar.name}><div className="mb-1.5 flex justify-between text-xs"><span className="font-medium text-[#536159]">{bar.name}</span><span className="font-semibold">{bar.amount}</span></div><div className="h-2 overflow-hidden rounded-full bg-[#eef1eb]"><div className={`h-full rounded-full ${bar.tone}`} style={{ width: bar.width }} /></div></div>)}</div><button className="mt-5 text-xs font-semibold text-[#315b50]">View all categories →</button></div></section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_1fr]"><div className="rounded-2xl border border-[#e5e6df] bg-white"><div className="flex items-center justify-between border-b border-[#edf0eb] p-5"><div><h2 className="text-sm font-semibold">Recent transactions</h2><p className="mt-1 text-xs text-[#89948d]">Your latest activity</p></div><button onClick={() => setActive('Transactions')} className="text-xs font-semibold text-[#315b50]">See all →</button></div><div className="divide-y divide-[#f0f2ee]">{transactions.map((tx) => <div key={tx.merchant} className="flex items-center gap-3 px-5 py-3.5"><div className={`grid size-8 shrink-0 place-items-center rounded-lg text-xs font-bold ${tx.color}`}>{tx.mark}</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">{tx.merchant}</p><p className="mt-0.5 truncate text-[10px] text-[#89948d]">{tx.detail}</p></div><div className="hidden text-right sm:block"><p className="text-[10px] text-[#89948d]">{tx.date}</p><span className="text-[10px] text-[#748078]">{tx.category}</span></div><p className={`text-xs font-semibold ${tx.amount.startsWith('+') ? 'text-[#468367]' : ''}`}>{tx.amount}</p></div>)}</div></div><div className="rounded-2xl border border-[#e5e6df] bg-white p-5"><div className="flex items-start justify-between"><div><h2 className="text-sm font-semibold">Upcoming commitments</h2><p className="mt-1 text-xs text-[#89948d]">Next 30 days</p></div><Repeat2 className="size-[18px] text-[#9b7a35]" /></div><div className="mt-4 flex flex-col gap-2.5">{subscriptions.map((item) => <div key={item.name} className="flex items-center gap-3 rounded-xl bg-[#fbfcf8] p-3"><div className={`grid size-8 place-items-center rounded-lg text-xs font-bold ${item.tone}`}>{item.initial}</div><div className="min-w-0 flex-1"><p className="text-xs font-semibold">{item.name}</p><p className="mt-0.5 text-[10px] text-[#89948d]">{item.cadence}</p></div><p className="text-xs font-semibold">{item.amount}</p></div>)}</div><div className="mt-4 flex items-center justify-between border-t border-[#edf0eb] pt-4"><span className="text-xs text-[#748078]">Total monthly</span><span className="text-sm font-semibold">$46.98</span></div></div></section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]"><div className="rounded-2xl border border-[#dfebe2] bg-[#edf5ee] p-5"><div className="flex gap-3"><div className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-[#d09235]"><Lightbulb className="size-[18px]" /></div><div><div className="flex items-center gap-2"><h2 className="text-sm font-semibold">A useful observation</h2><span className="rounded-full bg-[#d7eadc] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#468367]">New</span></div><p className="mt-2 text-[13px] leading-relaxed text-[#536159]">Dining out is <strong className="font-semibold text-[#315646]">$124 higher</strong> than your 3-month average. A lighter week could put you back on track for your emergency fund goal.</p><button className="mt-3 text-xs font-semibold text-[#315646]">Explore this insight →</button></div></div></div><div className="rounded-2xl border border-[#f0dfd2] bg-[#fff8f2] p-5"><div className="flex gap-3"><div className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-[#c36b40]"><AlertTriangle className="size-[18px]" /></div><div><h2 className="text-sm font-semibold">Needs your attention</h2><p className="mt-2 text-[13px] leading-relaxed text-[#6c5c52]">We found a possible duplicate charge from <strong className="font-semibold">Acme Utilities</strong> on Sep 17. Review before categorizing.</p><button onClick={() => setActive('Transactions')} className="mt-3 text-xs font-semibold text-[#a35b38]">Review transaction →</button></div></div></div></section>
          </> : <div className="rounded-2xl border border-[#e5e6df] bg-white p-8"><h2 className="text-xl font-semibold">{active}</h2><p className="mt-2 text-sm text-[#748078]">This view is ready for your imported data. Use the dashboard actions to explore the FinPilot prototype.</p><button onClick={() => setActive('Overview')} className="mt-5 rounded-xl bg-[#24463e] px-4 py-2 text-xs font-semibold text-white">Back to overview</button></div>}

          <section className="mt-8 rounded-2xl border border-[#dce8df] bg-[#eaf3ed] p-5 sm:p-6"><div className="flex flex-col gap-4 md:flex-row md:items-center"><div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#d6e7da] text-[#24463e]"><Bot className="size-5" /></div><div className="flex-1"><p className="text-sm font-semibold">Ask FinPilot anything about your money</p><p className="mt-1 text-xs text-[#718078]">Answers are based on your imported data, budgets, and goals — never investment advice.</p></div><form onSubmit={ask} className="flex w-full gap-2 md:max-w-[420px]"><div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-[#d3e1d5] bg-white px-3"><Search className="size-4 shrink-0 text-[#9aa79e]" /><input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Where did I spend the most?" className="min-w-0 flex-1 bg-transparent py-2.5 text-xs outline-none placeholder:text-[#a1aaa4]" /></div><button type="submit" className="rounded-xl bg-[#24463e] px-3.5 text-xs font-semibold text-white">Ask</button></form></div>{answer && <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#d5e4d7] bg-white p-4 text-xs leading-relaxed text-[#536159]"><Sparkles className="mt-0.5 size-4 shrink-0 text-[#d09235]" /><div><p className="mb-1 font-semibold text-[#315646]">FinPilot&apos;s answer</p>{answer}</div></div>}</section>
        </div>
      </main>

      {showUpload && <div className="fixed inset-0 z-50 grid place-items-center bg-[#16251f]/30 p-4" role="dialog" aria-modal="true"><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><h2 className="text-lg font-semibold">Import your financial data</h2><p className="mt-1 text-xs text-[#748078]">CSV, PDF, or spreadsheet files are supported.</p></div><button onClick={() => setShowUpload(false)} aria-label="Close" className="rounded-lg p-1 text-[#89948d] hover:bg-[#f1f4ef]"><X className="size-4" /></button></div><button onClick={() => setUploaded(true)} className="mt-6 flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#b9cdbd] bg-[#f8fbf7] px-5 py-8 text-center hover:bg-[#f0f7f1]"><div className="grid size-10 place-items-center rounded-xl bg-[#e3efe4] text-[#315b50]"><Paperclip className="size-5" /></div><p className="mt-3 text-xs font-semibold">Drop a file here or browse</p><p className="mt-1 text-[11px] text-[#89948d]">We&apos;ll normalize and categorize your transactions</p></button>{uploaded && <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#edf5ee] p-3 text-xs text-[#315646]"><Check className="size-4" />demo-september-statement.csv queued for import</div>}<div className="mt-6 flex justify-end gap-2"><button onClick={() => setShowUpload(false)} className="rounded-xl px-3.5 py-2 text-xs font-semibold text-[#748078]">Cancel</button><button onClick={() => { setShowUpload(false); setUploaded(false) }} className="rounded-xl bg-[#24463e] px-3.5 py-2 text-xs font-semibold text-white">Import file</button></div></div></div>}
      {showReport && <div className="fixed inset-0 z-50 grid place-items-center bg-[#16251f]/30 p-4" role="dialog" aria-modal="true"><div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-xs font-medium text-[#89948d]">September 2026</p><h2 className="mt-1 text-xl font-semibold">Your monthly financial report</h2></div><button onClick={() => setShowReport(false)} aria-label="Close" className="rounded-lg p-1 text-[#89948d] hover:bg-[#f1f4ef]"><X className="size-4" /></button></div><div className="mt-5 grid grid-cols-3 gap-2"><div className="rounded-xl bg-[#f5f8f3] p-3"><p className="text-[10px] text-[#89948d]">Income</p><p className="mt-1 text-sm font-semibold">$3,870</p></div><div className="rounded-xl bg-[#f5f8f3] p-3"><p className="text-[10px] text-[#89948d]">Expenses</p><p className="mt-1 text-sm font-semibold">$3,186</p></div><div className="rounded-xl bg-[#f5f8f3] p-3"><p className="text-[10px] text-[#89948d]">Net flow</p><p className="mt-1 text-sm font-semibold text-[#468367]">+$684</p></div></div><div className="mt-5 rounded-xl border border-[#e5e6df] p-4"><h3 className="text-xs font-semibold">Key observations</h3><ul className="mt-3 flex flex-col gap-2 text-xs leading-relaxed text-[#536159]"><li>• Food & dining is up 12% from last month.</li><li>• Three recurring subscriptions total $46.98/month.</li><li>• You&apos;re on track to reach your emergency fund goal in 7 months at the current savings rate.</li></ul></div><div className="mt-4 rounded-xl bg-[#edf5ee] p-4"><h3 className="text-xs font-semibold">Suggested next steps</h3><p className="mt-2 text-xs leading-relaxed text-[#536159]">Review the possible duplicate utility charge and consider a $124 lighter dining week to stay aligned with your goal.</p></div><button onClick={() => setShowReport(false)} className="mt-6 w-full rounded-xl bg-[#24463e] py-2.5 text-xs font-semibold text-white">Done</button></div></div>}
    </div>
  )
}
