'use client'

import { useState } from 'react'
import { Sparkles, ExternalLink, KeyRound, Check, Eye, EyeOff, X, HelpCircle, CheckCircle2 } from 'lucide-react'
import { setStoredGeminiKey, setStoredCurrency } from '@/lib/gemini'
import { supabase } from '@/lib/supabase'

interface GeminiOnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  currentKey?: string
  currentCurrency?: string
  onSave: (key: string, currency: string, seedData?: boolean) => void
}

const currencies = [
  { symbol: '$', label: 'USD ($)', name: 'US Dollar' },
  { symbol: '€', label: 'EUR (€)', name: 'Euro' },
  { symbol: '£', label: 'GBP (£)', name: 'British Pound' },
  { symbol: '₹', label: 'INR (₹)', name: 'Indian Rupee' },
  { symbol: 'C$', label: 'CAD (C$)', name: 'Canadian Dollar' },
  { symbol: 'A$', label: 'AUD (A$)', name: 'Australian Dollar' },
  { symbol: '¥', label: 'JPY (¥)', name: 'Japanese Yen' },
]

export function GeminiOnboardingModal({
  isOpen,
  onClose,
  currentKey = '',
  currentCurrency = '$',
  onSave,
}: GeminiOnboardingModalProps) {
  const [apiKey, setApiKey] = useState(currentKey)
  const [currency, setCurrency] = useState(currentCurrency)
  const [showKey, setShowKey] = useState(false)
  const [seedData, setSeedData] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  if (!isOpen) return null

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedKey = apiKey.trim()
    if (!trimmedKey) {
      setErrorMessage('Please enter a valid Gemini API key.')
      setTestStatus('error')
      return
    }

    setTesting(true)
    setErrorMessage('')
    setTestStatus('idle')

    try {
      // Test key via /api/agent
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: 'Hello FinPilot! Please confirm with one sentence that the API key is working.',
          apiKey: trimmedKey,
          financialContext: 'Test connection verification.',
        }),
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to verify key with Google Gemini.')
      }

      setTestStatus('success')
      setStoredGeminiKey(trimmedKey)
      setStoredCurrency(currency)

      // Try updating user profile in Supabase if logged in
      const { data: userData } = await supabase.auth.getUser()
      if (userData?.user) {
        await supabase
          .from('profiles')
          .update({ gemini_api_key: trimmedKey, currency })
          .eq('id', userData.user.id)
      }

      setTimeout(() => {
        onSave(trimmedKey, currency, seedData)
        onClose()
      }, 750)
    } catch (err: any) {
      setTestStatus('error')
      setErrorMessage(err.message || 'Verification failed. Please check that your key is active in Google AI Studio.')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#16251f]/40 p-4 backdrop-blur-xs" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-2xl border border-[#dce4dd] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl bg-[#24463e] text-white">
              <Sparkles className="size-4" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#1d2d28]">Connect Google Gemini AI</h2>
              <p className="text-xs text-[#718078]">AI-powered financial decision support grounded in your actual data</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1 text-[#89948d] hover:bg-[#f1f4ef]">
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-5 rounded-xl border border-[#dce9df] bg-[#f2f8f4] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-[#24463e]">Step 1: Get your free Gemini API Key</p>
              <p className="mt-0.5 text-[11px] text-[#55695e]">
                Google AI Studio provides free Gemini 2.5 & 1.5 Flash API keys for personal and developer use.
              </p>
            </div>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#24463e] px-3 py-1.5 text-[11px] font-semibold text-white shadow-xs hover:bg-[#1b3630]"
            >
              Get Key on AI Studio <ExternalLink className="size-3" />
            </a>
          </div>
        </div>

        <form onSubmit={handleTestAndSave} className="mt-5 flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#31443b]">
              Step 2: Paste your Gemini API Key
            </label>
            <div className="flex items-center rounded-xl border border-[#d6dfd7] bg-[#fafbf9] px-3 py-2.5 focus-within:border-[#24463e] focus-within:bg-white">
              <KeyRound className="size-4 text-[#8a968e]" />
              <input
                type={showKey ? 'text' : 'password'}
                required
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={e => {
                  setApiKey(e.target.value)
                  setTestStatus('idle')
                  setErrorMessage('')
                }}
                className="mx-2 flex-1 bg-transparent text-xs text-[#1d2d28] outline-none placeholder:text-[#a0aaa2]"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="text-[#8a968e] hover:text-[#24463e]"
              >
                {showKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <p className="mt-1 text-[10px] text-[#8a968e]">
              Your key is saved securely in your browser and used exclusively for your FinPilot queries.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#31443b]">
              Step 3: Choose Primary Currency
            </label>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {currencies.map(c => (
                <button
                  type="button"
                  key={c.symbol}
                  onClick={() => setCurrency(c.symbol)}
                  className={`flex flex-col items-center justify-center rounded-xl border py-2 text-xs font-medium transition ${
                    currency === c.symbol
                      ? 'border-[#24463e] bg-[#e7efe9] font-bold text-[#24463e]'
                      : 'border-[#e0e5df] bg-[#fafbf9] text-[#617067] hover:bg-[#f0f4ed]'
                  }`}
                >
                  <span className="text-sm">{c.symbol}</span>
                  <span className="text-[10px] text-[#818f85]">{c.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#e4e8e0] bg-[#fafbf9] p-3">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={seedData}
                onChange={e => setSeedData(e.target.checked)}
                className="mt-0.5 size-4 rounded text-[#24463e] focus:ring-[#24463e]"
              />
              <div>
                <p className="text-xs font-semibold text-[#31443b]">Load starter sample transactions</p>
                <p className="text-[11px] text-[#718078]">
                  Includes sample groceries, utilities, income, and subscriptions so you can test features immediately.
                </p>
              </div>
            </label>
          </div>

          {testStatus === 'error' && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {errorMessage}
            </div>
          )}

          {testStatus === 'success' && (
            <div className="flex items-center gap-2 rounded-xl border border-[#cfe2d2] bg-[#f0f7f1] p-3 text-xs text-[#24463e]">
              <CheckCircle2 className="size-4 shrink-0 text-[#24463e]" />
              <span>Gemini connected successfully! Initializing FinPilot…</span>
            </div>
          )}

          <div className="mt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-xs font-semibold text-[#718078] hover:bg-[#f1f4ef]"
            >
              Skip for now
            </button>
            <button
              type="submit"
              disabled={testing || testStatus === 'success'}
              className="inline-flex items-center gap-2 rounded-xl bg-[#24463e] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1b3630] disabled:opacity-50"
            >
              {testing ? 'Verifying with Google Gemini…' : testStatus === 'success' ? 'Connected!' : 'Save & Connect'}
              {testStatus === 'success' && <Check className="size-3.5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
