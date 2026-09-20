import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'FinPilot – AI Personal Finance Decision Support',
    template: '%s | FinPilot',
  },
  description: 'Understand your money with AI-powered insights. Upload bank statements, track spending, manage budgets and goals, and ask FinPilot (Gemini 2.5 Flash) grounded questions about your real finances.',
  generator: 'FinPilot',
  keywords: ['FinPilot', 'budget tracker', 'personal finance', 'Gemini AI', 'expense tracker', 'Supabase', 'Next.js'],
  authors: [{ name: 'FinPilot' }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'FinPilot – AI Personal Finance Decision Support',
    description: 'Live financial intelligence — CSV import, budgets, recurring bills, goals and a Gemini 2.5 Flash copilot grounded in your real numbers.',
    siteName: 'FinPilot',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinPilot – AI Personal Finance Decision Support',
    description: 'Track, understand and optimize your money with AI grounded in your real transactions.',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
