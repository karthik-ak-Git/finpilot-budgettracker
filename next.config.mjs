import fs from 'node:fs'

// Ensure credentials from .env are used if .env.local has empty variable placeholders
if (fs.existsSync('.env')) {
  try {
    const envFile = fs.readFileSync('.env', 'utf-8')
    for (const line of envFile.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const idx = trimmed.indexOf('=')
        if (idx !== -1) {
          const key = trimmed.slice(0, idx).trim()
          const val = trimmed.slice(idx + 1).trim()
          if (!process.env[key] && val) {
            process.env[key] = val
          }
        }
      }
    }
  } catch (err) {
    console.error('Error reading .env:', err)
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
