'use client'

import { useState, useEffect } from 'react'
import {
  X,
  User,
  Mail,
  Key,
  DollarSign,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
  EyeOff,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import {
  setStoredGeminiKey,
  setStoredCurrency,
  getStoredUseEnvKey,
  setStoredUseEnvKey,
  getAiRequestCount,
  AI_REQUEST_LIMIT,
} from '@/lib/gemini'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: any
  currentKey: string
  currentCurrency: string
  onSave: (key: string, currency: string) => void
}

const CURRENCY_OPTIONS = [
  { symbol: '$', label: 'USD – US Dollar' },
  { symbol: '€', label: 'EUR – Euro' },
  { symbol: '£', label: 'GBP – British Pound' },
  { symbol: '₹', label: 'INR – Indian Rupee' },
  { symbol: '¥', label: 'JPY – Japanese Yen' },
  { symbol: 'A$', label: 'AUD – Australian Dollar' },
  { symbol: 'C$', label: 'CAD – Canadian Dollar' },
  { symbol: 'Fr', label: 'CHF – Swiss Franc' },
  { symbol: 'R$', label: 'BRL – Brazilian Real' },
  { symbol: '₩', label: 'KRW – South Korean Won' },
]

export function ProfileModal({
  isOpen,
  onClose,
  user,
  currentKey,
  currentCurrency,
  onSave,
}: ProfileModalProps) {
  const [displayName, setDisplayName] = useState('')
  const [geminiKey, setGeminiKey] = useState('')
  const [currency, setCurrency] = useState('$')
  const [showKey, setShowKey] = useState(false)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [useEnvKey, setUseEnvKey] = useState(false)
  const [requestCount, setRequestCount] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setDisplayName(user?.user_metadata?.full_name || user?.email?.split('@')[0] || '')
      setGeminiKey(currentKey)
      setCurrency(currentCurrency)
      setStatus(null)
      setUseEnvKey(getStoredUseEnvKey())
      setRequestCount(getAiRequestCount())
    }
  }, [isOpen, user, currentKey, currentCurrency])

  if (!isOpen) return null

  const handleSave = async () => {
    setSaving(true)
    setStatus(null)
    try {
      // Persist to localStorage — respects .env toggle (reuses existing connection when checked)
      if (useEnvKey) setStoredUseEnvKey(true)
      else setStoredUseEnvKey(false)
      if (!useEnvKey) setStoredGeminiKey(geminiKey)
      else {
        // when using env, keep personal key stored but mark preference
        if (geminiKey.trim()) setStoredGeminiKey(geminiKey.trim())
      }
      setStoredCurrency(currency)

      if (user) {
        // Update Supabase auth display name
        if (displayName !== (user?.user_metadata?.full_name || '')) {
          await supabase.auth.updateUser({ data: { full_name: displayName } })
        }

        // Update profiles table
        await supabase
          .from('profiles')
          .upsert(
            {
              id: user.id,
              full_name: displayName,
              currency,
              gemini_api_key: useEnvKey ? null : geminiKey || null,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' }
          )
      }

      onSave(useEnvKey ? '' : geminiKey, currency)
      setStatus({ type: 'success', msg: useEnvKey ? 'Profile saved — using app default .env key (15 req/day).' : 'Profile saved successfully!' })
      setTimeout(onClose, 1200)
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message || 'Failed to save profile.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[#e5e8e0] bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#edf0eb] px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-[#1d2d28]">Profile & Settings</h2>
            <p className="mt-0.5 text-xs text-[#89948d]">
              Manage your account and FinPilot preferences
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#89948d] hover:bg-[#f2f4ef] hover:text-[#1d2d28]"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5">
          {/* Avatar + Account Info */}
          <div className="flex items-center gap-4 rounded-xl bg-[#f5f7f2] p-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-full bg-[#d4e1d4] text-lg font-bold text-[#315646]">
              {(displayName || user?.email || 'G')[0].toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#1d2d28]">
                {displayName || 'Guest'}
              </p>
              <p className="truncate text-xs text-[#89948d]">
                {user?.email || 'Local Demo Mode — sign in to sync'}
              </p>
              {user && (
                <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-semibold text-[#468367]">
                  <CheckCircle2 className="size-3" /> Supabase Synced
                </span>
              )}
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#536159]">
              <User className="size-3.5" /> Display Name
            </label>
            <input
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border border-[#dce5dc] bg-[#fafcfa] px-3 py-2.5 text-sm text-[#1d2d28] placeholder:text-[#a8b5a4] focus:border-[#24463e] focus:outline-none"
            />
          </div>

          {/* Email – read only */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#536159]">
              <Mail className="size-3.5" /> Email
            </label>
            <input
              value={user?.email || 'Not signed in'}
              readOnly
              className="w-full cursor-not-allowed rounded-xl border border-[#dce5dc] bg-[#f2f4ef] px-3 py-2.5 text-sm text-[#89948d]"
            />
          </div>

          {/* Currency */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#536159]">
              <DollarSign className="size-3.5" /> Currency
            </label>
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="w-full rounded-xl border border-[#dce5dc] bg-[#fafcfa] px-3 py-2.5 text-sm text-[#1d2d28] focus:border-[#24463e] focus:outline-none"
            >
              {CURRENCY_OPTIONS.map(c => (
                <option key={c.symbol} value={c.symbol}>
                  {c.symbol} — {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* API Configuration — .env toggle + tracking */}
          <div className="rounded-xl border border-[#dbe6dc] bg-[#eef4ee] p-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#24463e]">API Configuration</p>
              <span className="rounded-full bg-white border border-[#dbe6dc] px-2 py-0.5 text-[10px] font-semibold text-[#24463e]">{requestCount}/{AI_REQUEST_LIMIT} used · {Math.max(0, AI_REQUEST_LIMIT - requestCount)} left</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white border border-[#dbe6dc]">
              <div className="h-full bg-[#24463e] transition-all" style={{ width: `${Math.min(100, (requestCount / AI_REQUEST_LIMIT) * 100)}%` }} />
            </div>
            <label className="mt-2 flex items-start gap-2.5 cursor-pointer rounded-lg bg-white border border-[#dbe6dc] p-2">
              <input type="checkbox" checked={useEnvKey} onChange={e => setUseEnvKey(e.target.checked)} className="mt-0.5 size-4 rounded text-[#24463e]" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-[#24463e]">Use app default key (.env) — 15 req/day</p>
                <p className="text-[11px] text-[#6e7d74]">Reuses existing AI connection via <code className="font-mono bg-[#f6f7f2] px-1 rounded">GEMINI_API_KEY</code> from .env / Vercel env.</p>
              </div>
            </label>
            <button type="button" onClick={() => setUseEnvKey(true)} className="mt-2 w-full rounded-xl border border-[#24463e] bg-white px-3 py-2 text-xs font-semibold text-[#24463e] hover:bg-[#f2f8f4]">Use App Default Key (.env) — reuses existing connection</button>
          </div>

          {/* Gemini API Key */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#536159]">
              <Key className="size-3.5" /> Gemini API Key {useEnvKey && <span className="font-normal text-[#8aa094]">(using .env — input disabled)</span>}
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={geminiKey}
                disabled={useEnvKey}
                onChange={e => setGeminiKey(e.target.value)}
                placeholder="AIza…"
                className="w-full rounded-xl border border-[#dce5dc] bg-[#fafcfa] px-3 py-2.5 pr-10 text-sm text-[#1d2d28] placeholder:text-[#a8b5a4] focus:border-[#24463e] focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                disabled={useEnvKey}
                onClick={() => setShowKey(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#89948d] hover:text-[#1d2d28] disabled:opacity-40"
              >
                {showKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-[#24463e] hover:underline"
            >
              <ExternalLink className="size-3" /> Get your free Gemini API key →
            </a>
          </div>

          {/* Status Message */}
          {status && (
            <div
              className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium ${
                status.type === 'success'
                  ? 'border-[#c6dfc8] bg-[#edf5ee] text-[#2d5c42]'
                  : 'border-[#f0cfc5] bg-[#fff5f2] text-[#9b3a2a]'
              }`}
            >
              {status.type === 'success' ? (
                <CheckCircle2 className="size-3.5 shrink-0" />
              ) : (
                <AlertCircle className="size-3.5 shrink-0" />
              )}
              {status.msg}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2.5 border-t border-[#edf0eb] px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-[#dce5dc] px-4 py-2 text-xs font-semibold text-[#536159] hover:bg-[#f2f4ef]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#24463e] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1b3630] disabled:opacity-60"
          >
            <Save className="size-3.5" />
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
