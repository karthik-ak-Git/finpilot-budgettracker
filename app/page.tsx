'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import {
  LayoutDashboard,
  Receipt,
  Repeat2,
  BarChart3,
  Target,
  FileText,
  Sparkles,
  KeyRound,
  LogOut,
  LogIn,
  User as UserIcon,
  Search,
  Bot,
  CircleHelp,
  Home,
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'

import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Transaction, Budget, RecurringItem, Goal } from '@/lib/types'
import {
  getStoredGeminiKey,
  setStoredGeminiKey,
  getStoredCurrency,
  setStoredCurrency,
  buildFinancialContext,
} from '@/lib/gemini'
import {
  sampleTransactions,
  sampleBudgets,
  sampleRecurring,
  sampleGoals,
} from '@/lib/sampleData'

// Modular Components
import { OverviewTab } from '@/components/dashboard/OverviewTab'
import { TransactionsTab } from '@/components/transactions/TransactionsTab'
import { BudgetsTab } from '@/components/budgets/BudgetsTab'
import { RecurringTab } from '@/components/recurring/RecurringTab'
import { GoalsTab } from '@/components/goals/GoalsTab'
import { ReportsTab } from '@/components/reports/ReportsTab'

import { AuthModal } from '@/components/auth/AuthModal'
import { GeminiOnboardingModal } from '@/components/onboarding/GeminiOnboardingModal'
import { TransactionModal } from '@/components/transactions/TransactionModal'
import { CsvImportModal } from '@/components/import/CsvImportModal'
import { ProfileModal } from '@/components/profile/ProfileModal'
import { AppExplorerModal } from '@/components/explorer/AppExplorerModal'


const navItems = [
  { id: 'Overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'Transactions', label: 'Transactions', icon: Receipt },
  { id: 'Budgets', label: 'Budgets', icon: BarChart3 },
  { id: 'Recurring', label: 'Recurring', icon: Repeat2 },
  { id: 'Goals', label: 'Goals', icon: Target },
  { id: 'Reports', label: 'Reports', icon: FileText },
]

export default function FinPilotApp() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [user, setUser] = useState<any>(null)
  const [geminiKey, setGeminiKey] = useState('')
  const [currency, setCurrency] = useState('$')

  // Financial Data State
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [recurring, setRecurring] = useState<RecurringItem[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [loadingData, setLoadingData] = useState(true)

  // Modals State
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showGeminiModal, setShowGeminiModal] = useState(false)
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [showCsvModal, setShowCsvModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showExplorerModal, setShowExplorerModal] = useState(false)


  // Floating AI Chat State
  const [aiQuestion, setAiQuestion] = useState('')
  const [aiAnswer, setAiAnswer] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  // Initialize Auth & Storage
  useEffect(() => {
    const key = getStoredGeminiKey()
    const curr = getStoredCurrency()
    if (key) setGeminiKey(key)
    if (curr) setCurrency(curr)

    // Check Supabase Auth
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // Auto-prompt onboarding if no Gemini key found
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!getStoredGeminiKey()) {
        setShowGeminiModal(true)
      }
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  // Fetch live data from Supabase (or fallback to local sample data)
  const fetchData = useCallback(async () => {
    setLoadingData(true)
    try {
      if (user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('currency, gemini_api_key')
          .eq('id', user.id)
          .single()

        if (profile?.currency) {
          setCurrency(profile.currency)
          setStoredCurrency(profile.currency)
        }
        if (profile?.gemini_api_key && !geminiKey) {
          setGeminiKey(profile.gemini_api_key)
          setStoredGeminiKey(profile.gemini_api_key)
        }

        // Fetch user's transactions
        const { data: txData } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })

        // Fetch user's budgets
        const { data: bData } = await supabase
          .from('budgets')
          .select('*')
          .eq('user_id', user.id)

        // Fetch user's recurring
        const { data: rData } = await supabase
          .from('recurring')
          .select('*')
          .eq('user_id', user.id)

        // Fetch user's goals
        const { data: gData } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id)

        setTransactions(txData || [])
        setBudgets(bData || [])
        setRecurring(rData || [])
        setGoals(gData || [])
      } else {
        // Local state initialization for non-logged-in demo mode
        const localTx = localStorage.getItem('finpilot_local_transactions')
        if (localTx) {
          try {
            setTransactions(JSON.parse(localTx))
            setBudgets(JSON.parse(localStorage.getItem('finpilot_local_budgets') || '[]'))
            setRecurring(JSON.parse(localStorage.getItem('finpilot_local_recurring') || '[]'))
            setGoals(JSON.parse(localStorage.getItem('finpilot_local_goals') || '[]'))
          } catch {
            seedSampleDataLocally()
          }
        } else {
          seedSampleDataLocally()
        }
      }
    } catch (err) {
      console.error('Error fetching FinPilot data:', err)
    } finally {
      setLoadingData(false)
    }
  }, [user, geminiKey])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Helper to seed sample data locally or in Supabase
  const seedSampleDataLocally = () => {
    const formattedTx: Transaction[] = sampleTransactions.map((t, idx) => ({
      ...t,
      id: `local-tx-${idx}`,
    }))
    const formattedB: Budget[] = sampleBudgets.map((b, idx) => ({
      ...b,
      id: `local-b-${idx}`,
    }))
    const formattedR: RecurringItem[] = sampleRecurring.map((r, idx) => ({
      ...r,
      id: `local-r-${idx}`,
    }))
    const formattedG: Goal[] = sampleGoals.map((g, idx) => ({
      ...g,
      id: `local-g-${idx}`,
    }))

    setTransactions(formattedTx)
    setBudgets(formattedB)
    setRecurring(formattedR)
    setGoals(formattedG)

    localStorage.setItem('finpilot_local_transactions', JSON.stringify(formattedTx))
    localStorage.setItem('finpilot_local_budgets', JSON.stringify(formattedB))
    localStorage.setItem('finpilot_local_recurring', JSON.stringify(formattedR))
    localStorage.setItem('finpilot_local_goals', JSON.stringify(formattedG))
  }

  // Handle Seeding to Supabase
  const seedDataToSupabase = async () => {
    if (!user) {
      seedSampleDataLocally()
      return
    }
    try {
      const txToInsert = sampleTransactions.map(t => ({ ...t, user_id: user.id }))
      const bToInsert = sampleBudgets.map(b => ({ ...b, user_id: user.id }))
      const rToInsert = sampleRecurring.map(r => ({ ...r, user_id: user.id }))
      const gToInsert = sampleGoals.map(g => ({ ...g, user_id: user.id }))

      await supabase.from('transactions').insert(txToInsert)
      await supabase.from('budgets').insert(bToInsert)
      await supabase.from('recurring').insert(rToInsert)
      await supabase.from('goals').insert(gToInsert)
      fetchData()
    } catch (err) {
      console.error('Error seeding data to Supabase:', err)
    }
  }

  // --- Transaction Handlers ---
  const handleSaveTransaction = async (data: Omit<Transaction, 'id'>, id?: string) => {
    if (user) {
      if (id) {
        const { error } = await supabase.from('transactions').update(data).eq('id', id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('transactions').insert([{ ...data, user_id: user.id }])
        if (error) throw error
      }
      fetchData()
    } else {
      if (id) {
        const updated = transactions.map(t => (t.id === id ? { ...data, id } : t))
        setTransactions(updated)
        localStorage.setItem('finpilot_local_transactions', JSON.stringify(updated))
      } else {
        const newTx: Transaction = { ...data, id: `local-tx-${Date.now()}` }
        const updated = [newTx, ...transactions]
        setTransactions(updated)
        localStorage.setItem('finpilot_local_transactions', JSON.stringify(updated))
      }
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    if (user) {
      const { error } = await supabase.from('transactions').delete().eq('id', id)
      if (error) throw error
      setTransactions(prev => prev.filter(t => t.id !== id))
    } else {
      const updated = transactions.filter(t => t.id !== id)
      setTransactions(updated)
      localStorage.setItem('finpilot_local_transactions', JSON.stringify(updated))
    }
  }

  const handleBatchImportCsv = async (newTx: Omit<Transaction, 'id'>[]) => {
    if (user) {
      const records = newTx.map(t => ({ ...t, user_id: user.id }))
      const { error } = await supabase.from('transactions').insert(records)
      if (error) throw error
      fetchData()
    } else {
      const formatted: Transaction[] = newTx.map((t, idx) => ({
        ...t,
        id: `local-import-${Date.now()}-${idx}`,
      }))
      const updated = [...formatted, ...transactions]
      setTransactions(updated)
      localStorage.setItem('finpilot_local_transactions', JSON.stringify(updated))
    }
  }

  // --- Budget Handlers ---
  const handleSaveBudget = async (data: Omit<Budget, 'id'>, id?: string) => {
    if (user) {
      if (id) {
        const { error } = await supabase.from('budgets').update(data).eq('id', id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('budgets')
          .upsert([{ ...data, user_id: user.id }], { onConflict: 'user_id, category' })
        if (error) throw error
      }
      fetchData()
    } else {
      if (id) {
        const updated = budgets.map(b => (b.id === id ? { ...data, id } : b))
        setBudgets(updated)
        localStorage.setItem('finpilot_local_budgets', JSON.stringify(updated))
      } else {
        const newBudget: Budget = { ...data, id: `local-b-${Date.now()}` }
        const updated = [...budgets.filter(b => b.category !== data.category), newBudget]
        setBudgets(updated)
        localStorage.setItem('finpilot_local_budgets', JSON.stringify(updated))
      }
    }
  }

  const handleDeleteBudget = async (id: string) => {
    if (user) {
      const { error } = await supabase.from('budgets').delete().eq('id', id)
      if (error) throw error
      setBudgets(prev => prev.filter(b => b.id !== id))
    } else {
      const updated = budgets.filter(b => b.id !== id)
      setBudgets(updated)
      localStorage.setItem('finpilot_local_budgets', JSON.stringify(updated))
    }
  }

  // --- Recurring Handlers ---
  const handleSaveRecurring = async (data: Omit<RecurringItem, 'id'>, id?: string) => {
    if (user) {
      if (id) {
        const { error } = await supabase.from('recurring').update(data).eq('id', id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('recurring').insert([{ ...data, user_id: user.id }])
        if (error) throw error
      }
      fetchData()
    } else {
      if (id) {
        const updated = recurring.map(r => (r.id === id ? { ...data, id } : r))
        setRecurring(updated)
        localStorage.setItem('finpilot_local_recurring', JSON.stringify(updated))
      } else {
        const newItem: RecurringItem = { ...data, id: `local-r-${Date.now()}` }
        const updated = [...recurring, newItem]
        setRecurring(updated)
        localStorage.setItem('finpilot_local_recurring', JSON.stringify(updated))
      }
    }
  }

  const handleDeleteRecurring = async (id: string) => {
    if (user) {
      const { error } = await supabase.from('recurring').delete().eq('id', id)
      if (error) throw error
      setRecurring(prev => prev.filter(r => r.id !== id))
    } else {
      const updated = recurring.filter(r => r.id !== id)
      setRecurring(updated)
      localStorage.setItem('finpilot_local_recurring', JSON.stringify(updated))
    }
  }

  // --- Goal Handlers ---
  const handleSaveGoal = async (data: Omit<Goal, 'id'>, id?: string) => {
    if (user) {
      if (id) {
        const { error } = await supabase.from('goals').update(data).eq('id', id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('goals').insert([{ ...data, user_id: user.id }])
        if (error) throw error
      }
      fetchData()
    } else {
      if (id) {
        const updated = goals.map(g => (g.id === id ? { ...data, id } : g))
        setGoals(updated)
        localStorage.setItem('finpilot_local_goals', JSON.stringify(updated))
      } else {
        const newGoal: Goal = { ...data, id: `local-g-${Date.now()}` }
        const updated = [...goals, newGoal]
        setGoals(updated)
        localStorage.setItem('finpilot_local_goals', JSON.stringify(updated))
      }
    }
  }

  const handleDeleteGoal = async (id: string) => {
    if (user) {
      const { error } = await supabase.from('goals').delete().eq('id', id)
      if (error) throw error
      setGoals(prev => prev.filter(g => g.id !== id))
    } else {
      const updated = goals.filter(g => g.id !== id)
      setGoals(updated)
      localStorage.setItem('finpilot_local_goals', JSON.stringify(updated))
    }
  }

  const handleAddGoalFunds = async (goalId: string, currentAmount: number, additional: number) => {
    const newTotal = currentAmount + additional
    if (user) {
      const { error } = await supabase.from('goals').update({ current_amount: newTotal }).eq('id', goalId)
      if (error) throw error
      fetchData()
    } else {
      const updated = goals.map(g => (g.id === goalId ? { ...g, current_amount: newTotal } : g))
      setGoals(updated)
      localStorage.setItem('finpilot_local_goals', JSON.stringify(updated))
    }
  }

  // --- Ask Gemini Agent ---
  const handleAskAgent = async (promptQuestion = aiQuestion) => {
    if (!promptQuestion.trim()) return
    if (!geminiKey) {
      setShowGeminiModal(true)
      return
    }

    setAiLoading(true)
    setAiAnswer('')

    try {
      const context = buildFinancialContext(currency, transactions, budgets, recurring, goals)
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': geminiKey,
        },
        body: JSON.stringify({
          question: promptQuestion,
          mode: 'qa',
          apiKey: geminiKey,
          financialContext: context,
        }),
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        if (data.requiresKey) {
          setShowGeminiModal(true)
        }
        throw new Error(data.error || 'Failed to communicate with FinPilot Gemini agent.')
      }

      setAiAnswer(data.answer)
    } catch (err: any) {
      setAiAnswer(err.message || 'The Gemini agent is temporarily unavailable. Check your API key.')
    } finally {
      setAiLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    seedSampleDataLocally()
  }

  return (
    <div className="min-h-screen bg-[#f6f7f2] text-[#1d2d28]">
      {/* Sidebar Navigation */}
      <aside className="fixed inset-y-0 left-0 hidden w-[232px] border-r border-[#e4e8df] bg-[#fbfcf8] px-4 py-6 lg:flex lg:flex-col">
        <div className="flex items-center gap-2 px-3">
          <div className="grid size-8 place-items-center rounded-xl bg-[#24463e] text-white">
            <Sparkles className="size-4" />
          </div>
          <span className="text-[17px] font-semibold tracking-[-0.03em] text-[#1d2d28]">FinPilot</span>
        </div>

        <p className="mb-2 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#a0aaa2]">
          Workspace
        </p>

        <nav className="flex flex-col gap-1">
          {navItems.map(item => {
            const Icon = item.icon
            const isCurrent = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition ${
                  isCurrent
                    ? 'bg-[#e7efe9] font-semibold text-[#24463e]'
                    : 'text-[#718078] hover:bg-[#f0f4ed] hover:text-[#1d2d28]'
                }`}
              >
                <Icon className="size-[17px]" strokeWidth={1.8} />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Gemini AI Status Card */}
        <div className="mt-auto rounded-2xl border border-[#dbe6dc] bg-[#eef4ee] p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex size-7 items-center justify-center rounded-lg bg-white text-[#24463e] shadow-2xs">
              <Bot className="size-4" />
            </div>
            {geminiKey ? (
              <span className="flex items-center gap-1 rounded-full bg-[#e0eee2] px-2 py-0.5 text-[10px] font-semibold text-[#24463e]">
                <CheckCircle2 className="size-3 text-[#24463e]" /> Gemini 2.5
              </span>
            ) : (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                Setup Key
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-[#24463e]">Gemini Financial Copilot</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-[#59695f]">
            Grounded in your real transactions and budgets.
          </p>
          <button
            onClick={() => setShowGeminiModal(true)}
            className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#24463e] hover:underline"
          >
            {geminiKey ? 'Manage Gemini Key →' : 'Connect Gemini API Key →'}
          </button>
        </div>

        {/* User Account / Session Profile */}
        <div className="mt-4 border-t border-[#e4e8df] pt-4">
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-[#f0f4ed] transition"
            title="Open Profile & Settings"
          >
            <div className="grid size-8 shrink-0 place-items-center rounded-full bg-[#d4e1d4] text-xs font-bold text-[#315646]">
              {user?.email ? user.email[0].toUpperCase() : 'G'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-[#1d2d28]">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest Session'}
              </p>
              <p className="truncate text-[10px] text-[#89948d]">
                {user ? 'Supabase Synchronized' : 'Local Demo Mode'}
              </p>
            </div>
            {user ? (
              <button
                onClick={e => { e.stopPropagation(); handleSignOut() }}
                title="Sign Out"
                className="rounded-lg p-1.5 text-[#89948d] hover:bg-[#edf2ea] hover:text-red-600"
              >
                <LogOut className="size-4" />
              </button>
            ) : (
              <button
                onClick={e => { e.stopPropagation(); setShowAuthModal(true) }}
                title="Sign In / Register"
                className="rounded-lg p-1.5 text-[#24463e] hover:bg-[#edf2ea]"
              >
                <LogIn className="size-4" />
              </button>
            )}
          </button>
          {/* Tour the app */}
          <button
            onClick={() => setShowExplorerModal(true)}
            className="mt-1 flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-[11px] font-medium text-[#748078] hover:bg-[#f0f4ed] hover:text-[#1d2d28] transition"
          >
            <CircleHelp className="size-3.5" />
            Tour the app
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="lg:pl-[232px]">
        {/* Header Bar */}
        <header className="flex h-[72px] items-center justify-between border-b border-[#e5e8e0] bg-[#fbfcf8] px-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-[#77847d]">
              <Home className="size-3.5" /> /
              <span className="font-semibold text-[#31443b]">{activeTab}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Currency Selector */}
            <button
              onClick={() => setShowGeminiModal(true)}
              title="Change Currency & API Key"
              className="flex items-center gap-1.5 rounded-xl border border-[#dfe5de] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#3a4940] hover:bg-[#f6f9f5]"
            >
              <span>{currency}</span>
              <span className="text-[10px] text-[#849289]">Currency</span>
            </button>

            {/* Gemini Key Status */}
            <button
              onClick={() => setShowGeminiModal(true)}
              className={`hidden sm:inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                geminiKey
                  ? 'border-[#cfe0d2] bg-[#f2f8f4] text-[#24463e] hover:bg-[#e6f2e8]'
                  : 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <KeyRound className="size-3.5" />
              <span>{geminiKey ? 'Gemini AI Connected' : 'Connect Gemini Key'}</span>
            </button>

            {/* User Auth Button */}
            {user ? (
              <div className="flex items-center gap-2 rounded-xl border border-[#e1e6de] bg-white px-2.5 py-1.5 text-xs font-medium">
                <span className="grid size-6 place-items-center rounded-full bg-[#d4e1d4] text-[10px] font-bold text-[#315646]">
                  {user.email ? user.email[0].toUpperCase() : 'U'}
                </span>
                <span className="hidden sm:inline text-xs font-semibold text-[#1d2d28]">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#24463e] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1b3630]"
              >
                <LogIn className="size-3.5" /> Sign In
              </button>
            )}
          </div>
        </header>

        {/* Workspace Body */}
        <div className="mx-auto max-w-[1320px] px-5 py-7 sm:px-8 lg:px-10">
          {/* Page Title & Action Bar */}
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-1 text-xs font-medium text-[#89948d]">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <h1 className="text-[28px] font-semibold tracking-[-0.04em] text-[#1d2d28]">
                {activeTab === 'Overview'
                  ? `Welcome, ${user?.user_metadata?.full_name || 'Jordan'}`
                  : activeTab}
              </h1>
              <p className="mt-0.5 text-xs text-[#748078]">
                {activeTab === 'Overview'
                  ? 'Your live financial overview grounded in Supabase data.'
                  : `Review and manage your real ${activeTab.toLowerCase()} in one place.`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCsvModal(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#d9e1d8] bg-white px-3.5 py-2 text-xs font-semibold text-[#315646] shadow-xs hover:bg-[#f7faf6]"
              >
                <Upload className="size-3.5" /> Import Statement
              </button>
              <button
                onClick={() => {
                  setEditingTransaction(null)
                  setShowTransactionModal(true)
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#24463e] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1b3630]"
              >
                + Add Transaction
              </button>
            </div>
          </div>

          {/* Render Active Tab */}
          {activeTab === 'Overview' && (
            <OverviewTab
              transactions={transactions}
              budgets={budgets}
              recurring={recurring}
              goals={goals}
              currency={currency}
              onNavigate={setActiveTab}
              onAddTransaction={() => {
                setEditingTransaction(null)
                setShowTransactionModal(true)
              }}
              onImportCsv={() => setShowCsvModal(true)}
              onGenerateReport={() => setActiveTab('Reports')}
            />
          )}

          {activeTab === 'Transactions' && (
            <TransactionsTab
              transactions={transactions}
              currency={currency}
              onAdd={() => {
                setEditingTransaction(null)
                setShowTransactionModal(true)
              }}
              onImport={() => setShowCsvModal(true)}
              onEdit={tx => {
                setEditingTransaction(tx)
                setShowTransactionModal(true)
              }}
              onDelete={handleDeleteTransaction}
            />
          )}

          {activeTab === 'Budgets' && (
            <BudgetsTab
              budgets={budgets}
              transactions={transactions}
              currency={currency}
              onSaveBudget={handleSaveBudget}
              onDeleteBudget={handleDeleteBudget}
            />
          )}

          {activeTab === 'Recurring' && (
            <RecurringTab
              recurring={recurring}
              currency={currency}
              onSaveRecurring={handleSaveRecurring}
              onDeleteRecurring={handleDeleteRecurring}
            />
          )}

          {activeTab === 'Goals' && (
            <GoalsTab
              goals={goals}
              currency={currency}
              onSaveGoal={handleSaveGoal}
              onDeleteGoal={handleDeleteGoal}
              onAddFunds={handleAddGoalFunds}
            />
          )}

          {activeTab === 'Reports' && (
            <ReportsTab
              transactions={transactions}
              budgets={budgets}
              recurring={recurring}
              goals={goals}
              currency={currency}
              geminiKey={geminiKey}
              onOpenGeminiModal={() => setShowGeminiModal(true)}
            />
          )}

          {/* Docked AI Copilot Assistant Widget */}
          <section className="mt-8 rounded-2xl border border-[#dce8df] bg-[#eaf3ed] p-5 sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#d6e7da] text-[#24463e]">
                <Bot className="size-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#1d2d28]">Ask FinPilot anything about your money</p>
                <p className="mt-0.5 text-xs text-[#6e7d74]">
                  Powered by Google Gemini 2.5 Flash · grounded in your live transactions, budgets, and goals.
                </p>
              </div>

              <form
                onSubmit={e => {
                  e.preventDefault()
                  handleAskAgent()
                }}
                className="flex w-full gap-2 md:max-w-[480px]"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-[#d3e1d5] bg-white px-3 focus-within:border-[#24463e]">
                  <Search className="size-4 shrink-0 text-[#9aa79e]" />
                  <input
                    value={aiQuestion}
                    onChange={e => setAiQuestion(e.target.value)}
                    placeholder="Where did I spend the most this month?"
                    className="min-w-0 flex-1 bg-transparent py-2.5 text-xs outline-none placeholder:text-[#a1aaa4]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={aiLoading}
                  className="rounded-xl bg-[#24463e] px-4 text-xs font-semibold text-white shadow-xs transition hover:bg-[#1b3630] disabled:opacity-60"
                >
                  {aiLoading ? 'Thinking…' : 'Ask'}
                </button>
              </form>
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-[#5c6e63]">Try:</span>
              {[
                'Where did I spend the most?',
                'Am I over budget in any category?',
                'What are my total recurring subscriptions?',
                'How can I save $200 more this month?',
              ].map(prompt => (
                <button
                  key={prompt}
                  onClick={() => {
                    setAiQuestion(prompt)
                    handleAskAgent(prompt)
                  }}
                  className="rounded-lg border border-[#cbe0d0] bg-white/70 px-2 py-1 text-[11px] font-medium text-[#315646] hover:bg-white"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* AI Answer Bubble */}
            {aiAnswer && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#d5e4d7] bg-white p-4 text-xs leading-relaxed text-[#31443b] shadow-2xs">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-[#d09235]" />
                <div className="flex-1">
                  <p className="mb-1 font-semibold text-[#24463e]">FinPilot Copilot</p>
                  <div className="whitespace-pre-wrap">{aiAnswer}</div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          supabase.auth.getUser().then(({ data }) => setUser(data.user))
          fetchData()
        }}
      />

      <GeminiOnboardingModal
        isOpen={showGeminiModal}
        onClose={() => setShowGeminiModal(false)}
        currentKey={geminiKey}
        currentCurrency={currency}
        onSave={(key, curr, seed) => {
          setGeminiKey(key)
          setCurrency(curr)
          if (seed) {
            seedDataToSupabase()
          }
        }}
      />

      <TransactionModal
        isOpen={showTransactionModal}
        onClose={() => {
          setShowTransactionModal(false)
          setEditingTransaction(null)
        }}
        currency={currency}
        transactionToEdit={editingTransaction}
        onSave={handleSaveTransaction}
      />

      <CsvImportModal
        isOpen={showCsvModal}
        onClose={() => setShowCsvModal(false)}
        currency={currency}
        onImport={handleBatchImportCsv}
      />

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        currentKey={geminiKey}
        currentCurrency={currency}
        onSave={(key, curr) => {
          setGeminiKey(key)
          setCurrency(curr)
        }}
      />

      <AppExplorerModal
        isOpen={showExplorerModal}
        onClose={() => setShowExplorerModal(false)}
      />
    </div>
  )
}
