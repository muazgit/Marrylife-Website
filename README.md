# MarryLife (দ্বীনদার জীবনসঙ্গী খোঁজার বিশ্বস্ত প্ল্যাটফর্ম)

MarryLife is a Shariah-compliant Islamic matrimony platform built with **Next.js 16 (App Router + Turbopack)**, **React 19**, **Supabase (PostgreSQL + Row-Level Security)**, **Tailwind CSS v4**, and **TypeScript**.

## Key Features

- **Shariah-Compliant Privacy**: No public candidate photos (uses halal vector silhouettes) and guardian-first contact workflow.
- **Zero-Trust Database Security**: Strict Row-Level Security (RLS) and column-level privileges ensure `profiles`, `biodata_contacts`, and internal fields (`user_id`, `rejection_reason`) are never exposed publicly.
- **Faceted Search & Bengali Pagination**: Server-rendered `/biodatas` directory with filters for gender, marital status, and division, plus pure Bengali numerals (`১, ২, ৩...`).
- **Detailed Biodata View (`/biodata/[id]`)**: Complete structured profile view with address, education, family, deen practice, and partner expectations.
- **Authentic Bengali Typography**: Local `SolaimanLipi` (`woff2`) paired with `Inter Variable`.

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/muazgit/Marrylife-Website.git
cd Marrylife-Website
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase project credentials:

```bash
cp .env.example .env.local
```

### 3. Database Schema & RLS Migration

Apply the SQL migration in [`supabase/migrations/20261110000000_schema_and_rls_hardening.sql`](supabase/migrations/20261110000000_schema_and_rls_hardening.sql) via the Supabase SQL Editor or CLI.

### 4. Run Development Server

```bash
npm run dev
```

## Available Scripts

- `npm run dev` — Start local development server
- `npm run build` — Production build with Next.js 16 Turbopack
- `npm run lint` — Run ESLint + Prettier checks
- `npm run format` — Format all files with Prettier
- `npm test` — Run Vitest unit & integration test suite
