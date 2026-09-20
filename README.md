# FinPilot – AI Personal Finance Decision Support

**FinPilot** is a modern personal finance and budget tracking application built with **Next.js 16 (App Router)**, **React 19**, **Supabase (PostgreSQL + Auth)**, and **Google Gemini AI**.

It replaces static prototypes and mock data with real financial intelligence: dynamic cash flow analysis, bank statement CSV importing, budget utilization tracking, recurring payment reminders, and an AI copilot grounded in your live financial numbers.

---

## Features

- **Supabase Integration**: Full authentication (Sign Up, Sign In, Sign Out) and PostgreSQL database secured with Row-Level Security (RLS).
- **Google Gemini Financial Copilot**: Conversational AI assistant powered by Gemini 2.5 Flash, providing grounded spending audits, budget advice, and on-demand monthly financial reports.
- **Key Onboarding Flow**: Direct link to [Google AI Studio](https://aistudio.google.com/app/apikey) with live API key verification and currency preference selection.
- **Transaction Ledger**: Complete CRUD ledger with text search, category filters, type toggling (expense vs. income), sorting, and CSV export.
- **Bank Statement CSV Importer**: Drag-and-drop CSV parser with automatic column detection (Date, Merchant, Amount, Category), preview, and batch insertion.
- **Dynamic Budgets**: Category budget limits compared in real time against actual spent transactions with color-coded warning thresholds.
- **Recurring Subscriptions & Bills**: Manage monthly commitments with billing day countdowns.
- **Savings Goals**: Track milestones (e.g. Emergency Fund, Travel) with interactive progress bars and quick fund deposits.

---

## Tech Stack

- **Framework**: Next.js 16.3.3 (App Router)
- **Language**: TypeScript 5.7
- **UI & Styling**: React 19, Tailwind CSS v4, Lucide React
- **Database & Auth**: Supabase (@supabase/supabase-js)
- **AI Engine**: Google Gemini AI (@google/genai)
- **CSV Parsing**: PapaParse

---

## Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/karthik-ak-Git/finpilot-budgettracker.git
cd finpilot-budgettracker
pnpm install
```

### 2. Environment Configuration

Copy the example environment file and fill in your Supabase credentials:

```bash
cp .env.local.example .env
```

Inside `.env`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Database Setup

1. Open your **Supabase Dashboard** > **SQL Editor**.
2. Run the SQL script found in `supabase/schema.sql`.
3. This creates the `profiles`, `transactions`, `budgets`, `recurring`, and `goals` tables with Row Level Security (RLS) enabled.

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to start using FinPilot.

---

## License

MIT License.
