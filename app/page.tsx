import Link from 'next/link'
import {
  Sparkles,
  LayoutDashboard,
  Receipt,
  BarChart3,
  Repeat2,
  Target,
  FileText,
  Bot,
  Upload,
  ShieldCheck,
  Zap,
  Database,
  FileSpreadsheet,
  TrendingUp,
  Wallet,
  Brain,
  Lock,
  ArrowRight,
  Check,
  CheckCircle2,
  Play,
  Mail,
  ChevronRight,
  CircleHelp,
  Layers,
  PiggyBank,
  CalendarDays,
  Search,
  LineChart,
  ArrowUpRight,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f6f7f2] text-[#1d2d28] selection:bg-[#24463e] selection:text-white">
      {/* Top Banner */}
      <div className="bg-[#24463e] px-4 py-2 text-center text-[12px] font-medium text-[#d6e7da]">
        <span className="inline-flex items-center gap-2">
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase">New</span>
          Gemini 2.5 Flash Copilot is live — grounded in your real transactions, budgets & goals.
          <Link href="/dashboard" className="hidden sm:inline-flex items-center gap-1 font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
            Open app <ArrowUpRight className="size-3.5" />
          </Link>
        </span>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-[#e4e8df] bg-[#fbfcf8]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[64px] max-w-[1200px] items-center justify-between px-5 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-xl bg-[#24463e] text-white shadow-sm">
              <Sparkles className="size-4" />
            </span>
            <span className="text-[18px] font-semibold tracking-[-0.03em]">FinPilot</span>
            <span className="hidden sm:inline-flex rounded-full border border-[#dbe6dc] bg-[#eef4ee] px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase text-[#24463e]">AI Finance</span>
          </Link>

          <nav className="hidden items-center gap-6 text-[13px] font-medium text-[#5a6b62] lg:flex">
            <a href="#features" className="hover:text-[#1d2d28]">Features</a>
            <a href="#ai" className="hover:text-[#1d2d28]">AI Copilot</a>
            <a href="#how-it-works" className="hover:text-[#1d2d28]">How it works</a>
            <a href="#tech" className="hover:text-[#1d2d28]">Tech</a>
            <a href="#faq" className="hover:text-[#1d2d28]">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-[#d9e1d8] bg-white px-3.5 py-2 text-[13px] font-semibold text-[#24463e] hover:bg-[#f0f4ed]">
              <LayoutDashboard className="size-4" /> Dashboard
            </Link>
            <Link href="/dashboard" className="inline-flex items-center gap-1.5 rounded-xl bg-[#24463e] px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-[#1b3630]">
              Open App <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#eef4ee] via-[#f6f7f2] to-[#f6f7f2]" />
        <div className="absolute -top-24 right-0 -z-10 size-[700px] rounded-full bg-[#d6e7da]/40 blur-[90px]" />
        <div className="absolute -bottom-40 -left-40 -z-10 size-[600px] rounded-full bg-[#fff3d6]/60 blur-[90px]" />

        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#cde0d1] bg-white px-3 py-1 text-[11px] font-semibold text-[#24463e] shadow-xs">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Financial Intelligence • Supabase + Gemini
            </div>

            <h1 className="mt-5 text-[34px] font-semibold leading-[0.95] tracking-[-0.04em] sm:text-[44px] lg:text-[52px]">
              Understand your money
              <span className="block bg-gradient-to-r from-[#24463e] to-[#5b8a7a] bg-clip-text text-transparent">with AI that knows</span>
              <span className="block">your actual numbers.</span>
            </h1>

            <p className="mt-4 max-w-[56ch] text-[14px] leading-relaxed text-[#5a6b62] sm:text-[15px]">
              FinPilot is a modern personal finance cockpit — not a mock dashboard. Import your bank CSV, track every transaction, watch budgets live, and ask a Gemini 2.5 Flash copilot grounded in your real cash flow, budgets, subscriptions and goals.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-[#24463e] px-5 py-3 text-[14px] font-semibold text-white shadow-sm hover:bg-[#1b3630]">
                <Play className="size-4 fill-white" /> Try FinPilot free
              </Link>
              <a href="#features" className="inline-flex items-center gap-2 rounded-xl border border-[#d9e1d8] bg-white px-5 py-3 text-[14px] font-semibold text-[#24463e] hover:bg-[#f0f4ed]">
                Explore features <ChevronRight className="size-4" />
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-[12px] text-[#6e7d74]">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-4 text-emerald-600" /> No credit card</span>
              <span className="size-1 rounded-full bg-[#cbd5c9]" />
              <span className="inline-flex items-center gap-1.5"><Lock className="size-3.5" /> RLS-secured by Supabase</span>
              <span className="size-1 rounded-full bg-[#cbd5c9]" />
              <span className="inline-flex items-center gap-1.5"><Zap className="size-3.5" /> Guest demo works offline</span>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
              {[
                { k: '8+', label: 'Bank CSV formats', sub: 'Chase, BofA, Amex...' },
                { k: '14-day', label: 'Spending pulse', sub: 'Daily activity bars' },
                { k: '<1.2s', label: 'AI report', sub: 'Gemini 2.5 Flash' },
              ].map(s => (
                <div key={s.k} className="rounded-2xl border border-[#e4e8df] bg-white p-3 sm:p-4">
                  <div className="text-[18px] font-semibold tracking-[-0.03em] text-[#24463e]">{s.k}</div>
                  <div className="text-[12px] font-semibold">{s.label}</div>
                  <div className="text-[11px] text-[#7a8a80]">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Mock */}
          <div className="relative">
            <div className="rounded-[24px] border border-[#dde5dd] bg-white p-3 shadow-[0_20px_60px_rgba(36,70,62,0.12)] sm:p-4">
              {/* Window chrome */}
              <div className="flex items-center justify-between rounded-xl bg-[#f6f7f2] px-3 py-2">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="size-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#8aa094]">
                  <span className="hidden sm:inline">finpilot.app</span> <ShieldCheck className="size-3.5" /> Secure
                </div>
                <div className="hidden sm:flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-[#24463e] border border-[#e4e8df]"><Bot className="size-3.5" /> Gemini 2.5</div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: 'Net Cash Flow', value: '+$1,247', sub: 'This month', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                  { label: 'Total Spend', value: '$2,603', sub: 'vs $4.2k budget', color: 'text-[#24463e] bg-[#eef4ee] border-[#dbe6dc]' },
                  { label: 'Recurring', value: '$89 /mo', sub: '4 active', color: 'text-[#5a6b62] bg-white border-[#e4e8df]' },
                  { label: 'Goal Progress', value: '43%', sub: 'Emergency $6.4k/15k', color: 'text-amber-800 bg-amber-50 border-amber-200' },
                ].map(c => (
                  <div key={c.label} className={`rounded-2xl border p-3 ${c.color}`}>
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">{c.label}</div>
                    <div className="mt-1 text-[16px] font-semibold tracking-[-0.03em]">{c.value}</div>
                    <div className="text-[11px] opacity-70">{c.sub}</div>
                  </div>
                ))}
              </div>

              <div className="mt-3 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-2xl border border-[#e4e8df] bg-[#fbfcf8] p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold">Spending activity</p>
                    <span className="text-[10px] font-medium text-[#7a8a80]">Last 14 days</span>
                  </div>
                  <div className="mt-3 flex items-end gap-1">
                    {[20, 35, 45, 18, 60, 72, 55, 30, 80, 42, 65, 50, 38, 90].map((h, i) => (
                      <div key={i} className="flex-1">
                        <div className={`mx-auto w-full rounded-t-md ${i === 13 ? 'bg-[#24463e]' : 'bg-[#cfe0d2]'}`} style={{ height: `${h}px` }} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex gap-2 text-[11px]">
                    <span className="rounded-full bg-white border border-[#e4e8df] px-2 py-0.5 font-medium">Top: Housing 67%</span>
                    <span className="rounded-full bg-white border border-[#e4e8df] px-2 py-0.5 font-medium">Food 12%</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-[#e4e8df] bg-white p-3">
                  <p className="text-xs font-semibold">Ask FinPilot</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-[#6e7d74]">Powered by Gemini 2.5 Flash — grounded in your live data.</p>
                  <div className="mt-3 rounded-xl border border-[#d3e1d5] bg-[#f6f7f2] p-2.5 text-[11px]">
                    <div className="flex items-center gap-1.5 font-semibold text-[#24463e]"><Search className="size-3.5" /> Where did I spend the most?</div>
                    <div className="mt-1.5 rounded-lg bg-white p-2 leading-relaxed text-[#31443b] border border-[#e4e8df]">
                      <span className="font-semibold">Housing</span> — $1,750 (67% of spend). You’re at 95% of your $1,850 limit…
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-xl bg-[#24463e] px-3 py-2.5 text-white">
                <span className="text-xs font-medium">Ready to import your statement?</span>
                <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-[#24463e]">Import CSV <Upload className="size-3.5" /></span>
              </div>
            </div>

            <div className="pointer-events-none absolute -right-6 -top-6 hidden rotate-3 rounded-2xl border border-[#e4e8df] bg-white px-3 py-2 text-xs font-semibold shadow-lg lg:flex">
              <span className="grid size-6 place-items-center rounded-lg bg-amber-100 text-amber-800 mr-2"><PiggyBank className="size-3.5" /></span> Emergency Fund 43% → $15k
            </div>
          </div>
        </div>
      </section>

      {/* Feature pillars */}
      <section id="features" className="mx-auto max-w-[1200px] px-5 sm:px-6">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8aa094]">Everything you need to stay on top of money</p>
          <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.04em] sm:text-[36px]">A complete finance workspace, not a spreadsheet.</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-[#5a6b62]">Six focused modules share one live data layer. Every card, chart and AI answer is computed from your actual transactions — no mock filler.</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Receipt, title: 'Transactions Ledger', desc: 'Full CRUD with search, category filters, expense/income toggle, sorting and one-click CSV export. Signed amounts, merchant avatars, mobile-optimized rows.', bullets: ['Create / edit / delete with validation', 'Export finpilot-transactions-YYYY-MM-DD.csv'], accent: 'bg-[#eef4ee] text-[#24463e]' },
            { icon: FileSpreadsheet, title: 'Bank CSV Importer', desc: 'Drag-and-drop parser with auto column detection (date, merchant, amount, category). Handles Chase, BofA, Amex, Apple Card, Stripe generic.', bullets: ['PapaParse + header regex mapping', '5-row preview before batch insert'], accent: 'bg-amber-50 text-amber-800' },
            { icon: BarChart3, title: 'Dynamic Budgets', desc: 'Category limits vs live spend for the current month. Color thresholds at 80% / 100%, with “On track / Approaching / Exceeded” states and health ring.', bullets: ['Global budget health card', 'Per-budget progress + delete'], accent: 'bg-[#eef4ee] text-[#24463e]' },
            { icon: Repeat2, title: 'Recurring & Subscriptions', desc: 'Monthly / yearly / weekly cadence normalized to $/mo. Billing-day countdown, total commitment banner, activate or pause anytime.', bullets: ['Netflix $22.99 · Notion $12 etc.', 'Yearly ÷12 · Weekly ×52/12'], accent: 'bg-blue-50 text-blue-800' },
            { icon: Target, title: 'Savings Goals', desc: 'Track milestones like Emergency Fund & travel with progress bars, “to go” states and quick Add Funds deposits.', bullets: ['Create with target date (optional)', '+Add Funds → current + additional'], accent: 'bg-emerald-50 text-emerald-800' },
            { icon: FileText, title: 'Reports & Audit', desc: 'Instant snapshot (income / expenses / net / savings rate) plus a one-click Gemini Monthly Audit with 5 structured sections.', bullets: ['Executive summary → 3 action items', 'Copy report to clipboard'], accent: 'bg-violet-50 text-violet-800' },
          ].map(f => (
            <div key={f.title} className="rounded-[20px] border border-[#e4e8df] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className={`grid size-9 place-items-center rounded-xl ${f.accent}`}><f.icon className="size-5" /></div>
              <h3 className="mt-3 text-[15px] font-semibold tracking-[-0.02em]">{f.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#5a6b62]">{f.desc}</p>
              <ul className="mt-3 space-y-1.5">
                {f.bullets.map(b => (
                  <li key={b} className="flex items-start gap-1.5 text-[12px] text-[#3a4940]"><Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Secondary features */}
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            { icon: LayoutDashboard, t: 'Overview Dashboard', d: '4 live stat cards, 14-day bar pulse, top-5 categories, recent activity & observations that flag concentration risk or momentum.' },
            { icon: ShieldCheck, t: 'Supabase Auth + RLS', d: 'Email/password with auto-refresh, Row Level Security per user on all 5 tables — fully isolated, no cross-reads.' },
            { icon: Layers, t: 'Dual Persistence', d: 'Guest mode uses localStorage so you can explore instantly. Sign in upgrades to cloud sync with sample-data seeding.' },
          ].map(x => (
            <div key={x.t} className="rounded-2xl border border-[#dde5dd] bg-[#fbfcf8] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold"><x.icon className="size-4 text-[#24463e]" /> {x.t}</div>
              <p className="mt-1.5 text-[12px] leading-relaxed text-[#5a6b62]">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Copilot */}
      <section id="ai" className="mx-auto mt-14 max-w-[1200px] px-5 sm:px-6">
        <div className="grid gap-6 rounded-[24px] border border-[#dbe6dc] bg-gradient-to-br from-[#eaf3ed] via-[#eef4ee] to-white p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#24463e] px-3 py-1 text-[11px] font-bold tracking-widest uppercase text-white"><Bot className="size-3.5" /> Gemini 2.5 Flash Copilot</div>
            <h2 className="mt-3 text-[26px] font-semibold tracking-[-0.03em] sm:text-[32px]">Grounded answers, not generic advice.</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-[#3a4940]">Every AI response is built from a deterministic <span className="font-semibold">buildFinancialContext()</span> snapshot — current-month income/expenses, net flow, category totals sorted desc, budget utilization, active recurring, goals progress, and last 6 transactions.</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#dbe6dc] bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-semibold"><Search className="size-4 text-[#24463e]" /> Q&A mode</div>
                <p className="mt-1 text-xs leading-relaxed text-[#5a6b62]">Ask “Am I over budget?” or “How can I save $200?” — the proxy composes your snapshot + question and returns markdown with bold figures.</p>
                <code className="mt-2 block rounded-lg bg-[#f6f7f2] px-2 py-1 text-[11px]">POST /api/agent {'{mode:"qa"}'}</code>
              </div>
              <div className="rounded-2xl border border-[#dbe6dc] bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-semibold"><FileText className="size-4 text-[#24463e]" /> Report mode</div>
                <p className="mt-1 text-xs leading-relaxed text-[#5a6b62]">One click generates a 5-section monthly audit: Executive Summary → Observations → Budget Audit → Goals → 3 Actions.</p>
                <code className="mt-2 block rounded-lg bg-[#f6f7f2] px-2 py-1 text-[11px]">POST /api/agent {'{mode:"report"}'}</code>
              </div>
            </div>

            <ul className="mt-5 space-y-2 text-[13px]">
              {['System instruction: cite actual numbers, markdown, no stock tips, concise & friendly.', 'Temperature 0.3 for reliable, repeatable financial guidance.', 'Key priority: body apiKey → x-gemini-api-key header → GEMINI_API_KEY env.'].map(b => (
                <li key={b} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-emerald-600" /><span className="text-[#3a4940]">{b}</span></li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-2">
              {['Where did I spend the most?', 'Am I over budget?', 'Recurring total?', 'Save $200 more?'].map(q => (
                <span key={q} className="rounded-full border border-[#cbe0d0] bg-white px-3 py-1 text-xs font-medium text-[#315646]">“{q}”</span>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] border border-[#e4e8df] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold flex items-center gap-2"><Sparkles className="size-4 text-amber-600" /> Prompt preview</p>
              <span className="rounded-full bg-[#eef4ee] px-2 py-0.5 text-[11px] font-semibold text-[#24463e]">temp 0.3</span>
            </div>
            <div className="mt-3 rounded-xl bg-[#0f1e1a] p-4 font-mono text-[11px] leading-relaxed text-[#cde0d6]">
              <div className="text-[#8aa094]">// financialContext (generated)</div>
              <div>User Financial Overview:</div>
              <div>- Currency: $</div>
              <div>- Total Income: $3,850.00</div>
              <div>- Total Expenses: $2,603.12</div>
              <div>- Net: +$1,246.88</div>
              <div>- Top Categories: Housing $1,750…</div>
              <div>- Budgets: Housing $1,750/$1,850 (95%)</div>
              <div className="mt-2 text-[#8aa094]">// systemInstruction enforced</div>
              <div className="text-amber-200">You are FinPilot — reference real numbers,</div>
              <div className="text-amber-200">no securities advice, actionable.</div>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#f6f7f2] p-3 text-xs">
              <span className="grid size-7 place-items-center rounded-full bg-[#24463e] text-white"><Brain className="size-4" /></span>
              <div>
                <div className="font-semibold">Bring your own Gemini key</div>
                <div className="text-[11px] text-[#6e7d74]">Free from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline decoration-[#24463e]/30 underline-offset-2">aistudio.google.com/app/apikey</a> — verified live in onboarding.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto mt-14 max-w-[1200px] px-5 sm:px-6">
        <div className="mx-auto max-w-[640px] text-center">
          <h2 className="text-[26px] font-semibold tracking-[-0.03em]">From CSV to clarity in 3 steps</h2>
          <p className="mt-2 text-sm text-[#5a6b62]">No bank connection required. You stay in control of your data and your Gemini key.</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { step: '01', icon: Upload, title: 'Add your data', desc: 'Import a statement CSV (drag & drop, auto-maps columns) or add transactions manually. Works fully offline as guest via localStorage.' },
            { step: '02', icon: Wallet, title: 'Watch it come alive', desc: 'Overview computes net flow, 14-day pulse, category breakdown & warnings. Budgets, recurring and goals update live against this month.' },
            { step: '03', icon: Brain, title: 'Ask & act', desc: 'Type any money question or generate the Monthly Audit. Gemini cites your real figures and suggests 3 concrete next steps.' },
          ].map(s => (
            <div key={s.step} className="relative rounded-[20px] border border-[#e4e8df] bg-white p-6">
              <div className="absolute right-4 top-4 text-[28px] font-bold tracking-[-0.05em] text-[#e4e8df]">{s.step}</div>
              <div className="grid size-10 place-items-center rounded-xl bg-[#24463e] text-white"><s.icon className="size-5" /></div>
              <h3 className="mt-4 text-[15px] font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#5a6b62]">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-[#e4e8df] bg-[#fbfcf8] p-4 sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-xl bg-white border border-[#e4e8df] text-[#24463e]"><CalendarDays className="size-4" /></span>
            <div>
              <p className="text-sm font-semibold">Guest demo → cloud sync without friction</p>
              <p className="text-xs text-[#6e7d74]">Explore with sample data, then sign in and optionally seed starter transactions to Supabase.</p>
            </div>
          </div>
          <Link href="/dashboard" className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[#24463e] px-4 py-2 text-xs font-semibold text-white sm:mt-0">Open Dashboard <ArrowRight className="size-3.5" /></Link>
        </div>
      </section>

      {/* App detail specs */}
      <section className="mx-auto mt-14 max-w-[1200px] px-5 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[20px] border border-[#e4e8df] bg-white p-6">
            <h3 className="flex items-center gap-2 text-[15px] font-semibold"><TrendingUp className="size-4 text-[#24463e]" /> What you can track</h3>
            <div className="mt-4 grid grid-cols-2 gap-3 text-[13px]">
              {[
                { k: 'Transactions', v: 'Merchant, amount (± by type), category (9), date, detail — with local + Supabase dual write.' },
                { k: 'Budgets', v: 'Per-category monthly limit, overall health %, remaining / over, editable category + limit.' },
                { k: 'Recurring', v: 'Name, amount, cadence (M/Y/W), billing day 1-31, category, active toggle.' },
                { k: 'Goals', v: 'Title, target, current, target date — progress 0-100%, add-funds flow, complete state.' },
              ].map(x => (
                <div key={x.k} className="rounded-xl bg-[#f6f7f2] p-3">
                  <div className="text-xs font-bold uppercase tracking-widest text-[#24463e]">{x.k}</div>
                  <div className="mt-1 text-xs leading-relaxed text-[#3a4940]">{x.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[20px] border border-[#e4e8df] bg-[#24463e] p-6 text-white">
            <h3 className="flex items-center gap-2 text-[15px] font-semibold"><LineChart className="size-4" /> Privacy & security in one glance</h3>
            <ul className="mt-4 space-y-2.5 text-[13px] leading-relaxed text-[#d6e7da]">
              <li className="flex gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0" /> RLS on all 5 tables — <span className="font-semibold text-white">auth.uid() = user_id</span> for every SELECT/INSERT/UPDATE/DELETE.</li>
              <li className="flex gap-2"><Lock className="mt-0.5 size-4 shrink-0" /> Gemini key stored in localStorage + profiles.gemini_api_key — never logged, only sent as header x-gemini-api-key.</li>
              <li className="flex gap-2"><Database className="mt-0.5 size-4 shrink-0" /> No stock-picking, no bank scraping — cash-flow and budgeting discipline only.</li>
              <li className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0" /> CSV sanitized (parseFloat after [^0-9.-]), no eval, no dangerouslySetInnerHTML — answers as whitespace-pre-wrap text.</li>
            </ul>
            <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-[#24463e]">
              <span className="grid size-4 place-items-center font-mono text-[10px] font-bold">&lt;/&gt;</span> Supabase schema in /supabase/schema.sql
            </div>
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section id="tech" className="mx-auto mt-14 max-w-[1200px] px-5 sm:px-6">
        <div className="rounded-[24px] border border-[#e4e8df] bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8aa094]">Tech stack — audited from package.json & codebase</p>
              <h2 className="mt-1 text-[22px] font-semibold tracking-[-0.03em]">Built on a modern, boring, reliable stack.</h2>
            </div>
            <Link href="/dashboard" className="inline-flex items-center gap-1.5 rounded-xl border border-[#d9e1d8] bg-[#f6f7f2] px-3 py-2 text-xs font-semibold text-[#24463e]">Live app is at /dashboard <ArrowUpRight className="size-3.5" /></Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Framework', val: 'Next.js 16.3.3 (App Router)', sub: 'React 19 · TypeScript 5.7 · pnpm 12.3.4' },
              { label: 'Styling', val: 'Tailwind CSS v4', sub: 'shadcn · lucide-react · tw-animate-css · Base UI' },
              { label: 'Data & Auth', val: 'Supabase 2.116', sub: 'PostgreSQL + RLS + Auth (persistSession)' },
              { label: 'AI Engine', val: 'Gemini 2.5 Flash', sub: '@google/genai 2.23 + Vercel AI SDK 7' },
              { label: 'CSV', val: 'PapaParse 5.7', sub: 'Auto header regex detection' },
              { label: 'Analytics', val: '@vercel/analytics 1.6', sub: 'Production only' },
              { label: 'Config', val: 'next.config.mjs', sub: 'Env fallback loader · unoptimized images' },
              { label: 'Deployment', val: 'Any Next host', sub: 'Env: NEXT_PUBLIC_SUPABASE_* (+ GEMINI_API_KEY)' },
            ].map(c => (
              <div key={c.label} className="rounded-2xl border border-[#eef0eb] bg-[#fbfcf8] p-4">
                <div className="text-[11px] font-bold uppercase tracking-widest text-[#8aa094]">{c.label}</div>
                <div className="mt-1 text-[13px] font-semibold">{c.val}</div>
                <div className="text-[11px] text-[#6e7d74]">{c.sub}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 overflow-x-auto rounded-xl border border-[#e4e8df]">
            <table className="w-full min-w-[640px] text-left text-[12px]">
              <thead className="bg-[#f6f7f2] text-[11px] uppercase tracking-widest text-[#6e7d74]">
                <tr><th className="px-4 py-2.5">Route / File</th><th className="px-4 py-2.5">Role</th><th className="px-4 py-2.5">LOC</th></tr>
              </thead>
              <tbody className="divide-y divide-[#eef0eb]">
                {[
                  ['app/dashboard/page.tsx', 'Orchestrator — state, fetch, mutations, layout, AI dock (client)', '912'],
                  ['app/api/agent/route.ts', 'Gemini proxy — qa/report modes, error mapping', '86'],
                  ['lib/gemini.ts', 'localStorage helpers + buildFinancialContext', '95'],
                  ['supabase/schema.sql', '5 tables + RLS + trigger', '178'],
                  ['components/*', '6 tabs + 5 modals + Overview 14-day pulse', '—'],
                ].map(([a, b, c]) => (
                  <tr key={a} className="bg-white"><td className="px-4 py-2 font-mono text-[11px]">{a}</td><td className="px-4 py-2 text-[#3a4940]">{b}</td><td className="px-4 py-2">{c}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto mt-14 max-w-[900px] px-5 sm:px-6">
        <h2 className="text-center text-[24px] font-semibold tracking-[-0.03em]">Frequently asked</h2>
        <div className="mt-6 grid gap-3">
          {[
            { q: 'Do I need to sign up to try FinPilot?', a: 'No. Guest demo uses localStorage so you can import a CSV, set budgets and quiz the AI immediately. Sign in when you want cloud sync — your data stays isolated by RLS.' },
            { q: 'Where does the Gemini key come from? Is it free?', a: 'Bring your own key from Google AI Studio (aistudio.google.com/app/apikey) — free tier includes Gemini 2.5 Flash. Paste it in Onboarding, it’s verified live with a test call before saving.' },
            { q: 'What CSV formats are supported?', a: 'Any CSV with Date / Merchant or Description / Amount and optional Category. Header regex auto-detects columns; you can override via 4 mapping selects and preview 5 rows before import.' },
            { q: 'Is my data private?', a: 'Yes. Supabase RLS enforces auth.uid() = user_id on transactions, budgets, recurring, goals and profiles. The API route never stores your financialContext — it’s forwarded to Gemini per request.' },
            { q: 'Can FinPilot give investment advice?', a: 'No. The system instruction explicitly blocks stock/securities picking. FinPilot focuses on cash flow, budget discipline and savings momentum.' },
            { q: 'What happens on sign out?', a: 'Supabase session is cleared and the app re-seeds localStorage sample data so you can keep exploring without an account.' },
          ].map(f => (
            <details key={f.q} className="group rounded-2xl border border-[#e4e8df] bg-white p-4 open:bg-[#fbfcf8]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14px] font-semibold">
                {f.q} <span className="grid size-6 shrink-0 place-items-center rounded-full border border-[#e4e8df] bg-white text-[#24463e] group-open:rotate-45 transition"><ChevronRight className="size-3.5" /></span>
              </summary>
              <p className="mt-2 text-[13px] leading-relaxed text-[#5a6b62]">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto mt-14 max-w-[1200px] px-5 sm:px-6">
        <div className="rounded-[24px] bg-[#24463e] p-6 text-white sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-[24px] font-semibold tracking-[-0.03em] sm:text-[28px]">Start with your real numbers, not a template.</h2>
              <p className="mt-2 max-w-[55ch] text-[13px] leading-relaxed text-[#cde0d6]">Open the dashboard, import a statement or seed sample data, and ask your first question. Your Gemini key stays yours — verification happens client-side.</p>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-medium"><Check className="size-3.5" /> Works offline as guest</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-medium"><ShieldCheck className="size-3.5" /> RLS-secured</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-medium"><Brain className="size-3.5" /> Gemini 2.5 Flash</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-[14px] font-semibold text-[#24463e] hover:bg-[#eef4ee]">
                Open FinPilot <ArrowRight className="size-4" />
              </Link>
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-[14px] font-semibold text-white hover:bg-white/15">
                Get Gemini key <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-10 border-t border-[#e4e8df] bg-[#fbfcf8]">
        <div className="mx-auto max-w-[1200px] px-5 py-8 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-xl bg-[#24463e] text-white"><Sparkles className="size-4" /></span>
                <span className="text-[16px] font-semibold tracking-[-0.03em]">FinPilot</span>
              </div>
              <p className="mt-2 max-w-[32ch] text-[12px] leading-relaxed text-[#6e7d74]">AI Personal Finance Decision Support — grounded in your live transactions, budgets, recurring and goals. Built with Next.js 16, Supabase & Gemini.</p>
              <div className="mt-4 flex gap-2">
                <a href="mailto:hello@finpilot.app" className="grid size-8 place-items-center rounded-xl border border-[#e4e8df] bg-white text-[#24463e] hover:bg-[#f6f7f2]"><Mail className="size-4" /></a>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="grid size-8 place-items-center rounded-xl border border-[#e4e8df] bg-white text-[#24463e] hover:bg-[#f6f7f2] font-mono text-[11px] font-bold">&lt;/&gt;</a>
                <Link href="/dashboard" className="grid size-8 place-items-center rounded-xl border border-[#e4e8df] bg-white text-[#24463e] hover:bg-[#f6f7f2]"><LayoutDashboard className="size-4" /></Link>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#8aa094]">Product</p>
              <ul className="mt-3 space-y-2 text-[13px] text-[#3a4940]">
                <li><a href="#features" className="hover:text-[#1d2d28]">Features</a></li>
                <li><a href="#ai" className="hover:text-[#1d2d28]">AI Copilot</a></li>
                <li><a href="#how-it-works" className="hover:text-[#1d2d28]">How it works</a></li>
                <li><Link href="/dashboard" className="hover:text-[#1d2d28]">Dashboard / App</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#8aa094]">Resources</p>
              <ul className="mt-3 space-y-2 text-[13px] text-[#3a4940]">
                <li><a href="#tech" className="hover:text-[#1d2d28]">Tech stack</a></li>
                <li><a href="#faq" className="hover:text-[#1d2d28]">FAQ</a></li>
                <li><a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="hover:text-[#1d2d28]">Google AI Studio</a></li>
                <li><Link href="/dashboard" className="hover:text-[#1d2d28]">Reports · AI Audit</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#8aa094]">Legal</p>
              <ul className="mt-3 space-y-2 text-[13px] text-[#3a4940]">
                <li><span className="text-[#6e7d74]">No securities advice</span></li>
                <li><span className="text-[#6e7d74]">Data via Supabase RLS</span></li>
                <li><span className="text-[#6e7d74]">© 2026 FinPilot</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-2 border-t border-[#e4e8df] pt-4 text-[11px] text-[#8aa094] sm:flex-row sm:items-center sm:justify-between">
            <span>FinPilot v0.1.0 · Next.js 16.3.3 · Built for decision support, not speculation.</span>
            <span className="inline-flex items-center gap-1.5"><CircleHelp className="size-3.5" /> Tour available inside the app → /dashboard</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
