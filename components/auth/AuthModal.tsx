'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Sparkles, X, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)
    setLoading(true)

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName || email.split('@')[0] },
          },
        })
        if (signUpError) throw signUpError

        if (data.session) {
          onSuccess()
          onClose()
        } else {
          setSuccessMsg('Account created! Please check your email inbox to confirm your address, or sign in.')
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
        onSuccess()
        onClose()
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#16251f]/40 p-4 backdrop-blur-xs" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-2xl border border-[#dce4dd] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="grid size-8 place-items-center rounded-xl bg-[#24463e] text-white">
              <Sparkles className="size-4" />
            </div>
            <h2 className="text-lg font-semibold text-[#1d2d28]">
              {isSignUp ? 'Create your FinPilot account' : 'Welcome back to FinPilot'}
            </h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1 text-[#89948d] hover:bg-[#f1f4ef]">
            <X className="size-4" />
          </button>
        </div>

        <p className="mt-1 text-xs text-[#718078]">
          {isSignUp
            ? 'Start tracking real spending, budgets, and savings goals securely with Supabase.'
            : 'Sign in to access your personal finance dashboard.'}
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#cfe2d2] bg-[#f0f7f1] p-3 text-xs text-[#24463e]">
            <CheckCircle2 className="size-4 shrink-0 text-[#24463e]" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3.5">
          {isSignUp && (
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-[#48564e]">Full Name</label>
              <div className="flex items-center gap-2 rounded-xl border border-[#d6dfd7] bg-[#fafbf9] px-3 py-2.5 focus-within:border-[#24463e] focus-within:bg-white">
                <User className="size-4 text-[#8a968e]" />
                <input
                  type="text"
                  placeholder="Jordan Davis"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-transparent text-xs text-[#1d2d28] outline-none placeholder:text-[#a0aaa2]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-[11px] font-semibold text-[#48564e]">Email Address</label>
            <div className="flex items-center gap-2 rounded-xl border border-[#d6dfd7] bg-[#fafbf9] px-3 py-2.5 focus-within:border-[#24463e] focus-within:bg-white">
              <Mail className="size-4 text-[#8a968e]" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-transparent text-xs text-[#1d2d28] outline-none placeholder:text-[#a0aaa2]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold text-[#48564e]">Password</label>
            <div className="flex items-center gap-2 rounded-xl border border-[#d6dfd7] bg-[#fafbf9] px-3 py-2.5 focus-within:border-[#24463e] focus-within:bg-white">
              <Lock className="size-4 text-[#8a968e]" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-transparent text-xs text-[#1d2d28] outline-none placeholder:text-[#a0aaa2]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#24463e] py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1b3630] disabled:opacity-50"
          >
            {loading ? 'Please wait…' : isSignUp ? 'Sign Up' : 'Sign In'}
            <ArrowRight className="size-3.5" />
          </button>
        </form>

        <div className="mt-5 border-t border-[#edf0eb] pt-4 text-center">
          <p className="text-xs text-[#718078]">
            {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError(null)
                setSuccessMsg(null)
              }}
              className="font-semibold text-[#24463e] underline hover:text-[#1b3630]"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
