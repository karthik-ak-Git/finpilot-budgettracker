import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ylgkctistrzwvyxrivjd.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsZ2tjdGlzdHJ6d3Z5eHJpdmpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MTgxODMsImV4cCI6MjEwNTM5NDE4M30.q7OpiRJQsHpaitUI3hwUfBVCk21TNaJML3Y210AyW_w'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project'))
}
