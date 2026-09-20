'use client'

import { useState } from 'react'
import {
  X,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Receipt,
  BarChart3,
  Repeat2,
  Target,
  FileText,
  Bot,
  Upload,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'

interface Slide {
  icon: React.ElementType
  iconColor: string
  iconBg: string
  title: string
  subtitle: string
  description: string
  features: string[]
  tip?: string
}

const slides: Slide[] = [
  {
    icon: Sparkles,
    iconColor: 'text-white',
    iconBg: 'bg-[#24463e]',
    title: 'Welcome to FinPilot',
    subtitle: 'Your AI-powered personal finance cockpit',
    description:
      'FinPilot combines real-time Supabase database sync with Google Gemini AI to give you a living, breathing picture of your financial health — not just static numbers.',
    features: [
      'All your data saved securely in Supabase',
      'Google Gemini AI answers questions about your money',
      'Works offline in demo mode — no sign-in required',
      'CSV import for bulk statement uploads',
    ],
    tip: 'Sign in with your email to start syncing data across devices.',
  },
  {
    icon: LayoutDashboard,
    iconColor: 'text-[#24463e]',
    iconBg: 'bg-[#e7efe9]',
    title: 'Overview',
    subtitle: 'Your financial snapshot at a glance',
    description:
      'The Overview tab is your home base. See your cash flow, spending totals, recurring commitments, and goal progress — all calculated live from your real transactions.',
    features: [
      'Cash flow: income minus expenses this month',
      '14-day spending activity bar chart',
      'Category breakdown with percentage bars',
      'AI-generated observations about your patterns',
      'Quick-access buttons to add transactions',
    ],
    tip: 'The bar chart always shows exactly 14 days so you can spot daily spending rhythms.',
  },
  {
    icon: Receipt,
    iconColor: 'text-[#315646]',
    iconBg: 'bg-[#e8f0e8]',
    title: 'Transactions',
    subtitle: 'Every dollar in and out',
    description:
      'Log every income and expense transaction. Filter, search, and sort your history. Export to CSV for your accountant or personal records.',
    features: [
      'Add transactions with merchant, category, date, and amount',
      'Income vs expense toggle with amount sign',
      'Full-text search across merchant and detail fields',
      'Category and date filters',
      'CSV export of filtered results',
      'Inline edit and delete',
    ],
    tip: 'Use the "Import Statement" button in the header to bulk-upload bank CSV exports.',
  },
  {
    icon: Upload,
    iconColor: 'text-[#4a6958]',
    iconBg: 'bg-[#e4eee6]',
    title: 'CSV Import',
    subtitle: 'Bulk-upload your bank statements',
    description:
      'Download your bank statement as a CSV and upload it directly to FinPilot. The importer auto-detects columns for date, description, and amount.',
    features: [
      'Drag-and-drop or click to select a CSV file',
      'Preview rows before importing',
      'Auto-maps common bank column formats',
      'All imported transactions are assigned to your account',
    ],
    tip: 'Most banks let you export the last 90 days as a CSV from your online portal.',
  },
  {
    icon: BarChart3,
    iconColor: 'text-[#4a6958]',
    iconBg: 'bg-[#e4eee6]',
    title: 'Budgets',
    subtitle: 'Set spending limits per category',
    description:
      'Create monthly budgets for each expense category. FinPilot automatically tracks how much you have spent vs your limit and shows a visual progress bar.',
    features: [
      'Create a budget for any category (Food, Transport, etc.)',
      'Live progress bar: spent vs budget limit',
      'Over-budget categories highlighted in amber/red',
      'Budgets update in real time as you add transactions',
    ],
    tip: 'Start with your top 3 spending categories from the Overview pie chart.',
  },
  {
    icon: Repeat2,
    iconColor: 'text-[#9b7a35]',
    iconBg: 'bg-[#f5eddb]',
    title: 'Recurring',
    subtitle: 'Track subscriptions and regular bills',
    description:
      'Recurring items are bills and subscriptions that repeat on a regular schedule. FinPilot tracks the total commitment so you always know how much is leaving your account each month.',
    features: [
      'Add monthly, quarterly, or annual recurring items',
      'Set billing day for calendar awareness',
      'Total recurring commitment shown on Overview',
      'Toggle active/inactive without deleting',
    ],
    tip: 'Try listing Netflix, rent, gym, insurance — anything on a billing schedule.',
  },
  {
    icon: Target,
    iconColor: 'text-[#7a6592]',
    iconBg: 'bg-[#efe9f5]',
    title: 'Goals',
    subtitle: 'Save towards what matters most',
    description:
      'Set savings goals with a target amount and deadline. Manually add funds as you save. FinPilot tracks your progress and shows an aggregate percentage on the Overview.',
    features: [
      'Name, target amount, and target date per goal',
      '"Add Funds" button to record savings contributions',
      'Progress bar with percentage to target',
      'Aggregate goal progress shown on dashboard',
    ],
    tip: 'Create a goal for your emergency fund, vacation, or next big purchase.',
  },
  {
    icon: FileText,
    iconColor: 'text-[#315646]',
    iconBg: 'bg-[#e8f0e8]',
    title: 'Reports',
    subtitle: 'AI-generated financial analysis',
    description:
      'The Reports tab uses Google Gemini AI to analyze all your transactions, budgets, recurring items, and goals — then writes a personalized financial health report just for you.',
    features: [
      'One-click AI report generation',
      'Covers income, spending, savings rate, and outlook',
      'Personalized recommendations based on your real data',
      'Requires a Gemini API key (free tier available)',
    ],
    tip: 'Get your Gemini API key free at aistudio.google.com then paste it via the key button in the header.',
  },
  {
    icon: Bot,
    iconColor: 'text-[#24463e]',
    iconBg: 'bg-[#d6e7da]',
    title: 'AI Copilot',
    subtitle: 'Ask anything about your finances',
    description:
      'The AI Copilot panel at the bottom of every page lets you ask natural language questions about your money. Gemini reads your live transaction data to give grounded, accurate answers.',
    features: [
      '"Where did I spend the most this month?"',
      '"Am I over budget in any category?"',
      '"How much have I saved toward my goals?"',
      '"What are my total recurring subscriptions?"',
      '"How can I save $200 more this month?"',
    ],
    tip: 'Use the quick-prompt chips to get started without typing anything.',
  },
]

interface AppExplorerModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AppExplorerModal({ isOpen, onClose }: AppExplorerModalProps) {
  const [step, setStep] = useState(0)

  if (!isOpen) return null

  const slide = slides[step]
  const Icon = slide.icon
  const isFirst = step === 0
  const isLast = step === slides.length - 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-[#e5e8e0] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#edf0eb] px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#1d2d28]">App Explorer</span>
            <span className="rounded-full bg-[#e7efe9] px-2 py-0.5 text-[10px] font-bold text-[#24463e]">
              {step + 1} / {slides.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#89948d] hover:bg-[#f2f4ef] hover:text-[#1d2d28]"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-[#edf0eb]">
          <div
            className="h-full rounded-full bg-[#24463e] transition-all duration-300"
            style={{ width: `${((step + 1) / slides.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Icon + Title */}
          <div className="flex items-start gap-4">
            <div
              className={`grid size-12 shrink-0 place-items-center rounded-2xl ${slide.iconBg}`}
            >
              <Icon className={`size-6 ${slide.iconColor}`} strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#1d2d28]">{slide.title}</h2>
              <p className="text-xs text-[#89948d]">{slide.subtitle}</p>
            </div>
          </div>

          {/* Description */}
          <p className="mt-4 text-[13px] leading-relaxed text-[#536159]">{slide.description}</p>

          {/* Features */}
          <ul className="mt-4 flex flex-col gap-2">
            {slide.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-[#1d2d28]">
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[#468367]" />
                {f}
              </li>
            ))}
          </ul>

          {/* Tip */}
          {slide.tip && (
            <div className="mt-4 rounded-xl border border-[#dbe6dc] bg-[#eef4ee] px-4 py-3">
              <p className="text-[11px] font-semibold text-[#24463e]">💡 Tip</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-[#3d5c47]">{slide.tip}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between border-t border-[#edf0eb] px-6 py-4">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={isFirst}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#dce5dc] px-4 py-2 text-xs font-semibold text-[#536159] hover:bg-[#f2f4ef] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="size-3.5" /> Previous
          </button>

          {/* Dot indicators */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`size-1.5 rounded-full transition-all ${
                  i === step ? 'w-4 bg-[#24463e]' : 'bg-[#c8d5c8] hover:bg-[#8ca88c]'
                }`}
              />
            ))}
          </div>

          {isLast ? (
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#24463e] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1b3630]"
            >
              Get Started <Sparkles className="size-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setStep(s => Math.min(slides.length - 1, s + 1))}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#24463e] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1b3630]"
            >
              Next <ChevronRight className="size-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
