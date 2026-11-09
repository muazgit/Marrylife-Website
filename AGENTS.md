# Developer & Agent Guidelines

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS v4, Radix UI primitives, Lucide React
- **Language**: TypeScript

## Guidelines

- Follow Next.js App Router conventions in `src/app/`.
- Use React Server Components (RSC) by default. Add `"use client"` directive when client hooks or browser events are needed.
- Keep Bengali typography and RTL/LTR compatibility in mind.
- Ensure `npm run build`, `npm run lint`, and `npm test` pass cleanly.
