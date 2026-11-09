# MarryLife (দ্বীনদার জীবনসঙ্গী খোঁজার বিশ্বস্ত প্ল্যাটফর্ম)

MarryLife is a modern Islamic matrimony platform built with **Next.js (App Router)**, **React 19**, **Tailwind CSS**, and **TypeScript**.

## Features

- **Islamic Matrimony Matching**: Search and create biodatas with custom filters (location, marital status, profession, education).
- **Fast and Modern**: Built with Next.js App Router and Turbopack for optimal speed and SEO.
- **Accessible UI**: Styled with Tailwind CSS, Radix UI primitives, Lucide icons, and Kalpurush Bengali typography.
- **Mobile Responsive**: Fully responsive layout optimized for all device sizes.

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

1. Clone repository:

   ```bash
   git clone https://github.com/muazgit/Marrylife-Website.git
   cd Marrylife-Website
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev`: Starts the Next.js development server with Turbopack.
- `npm run build`: Creates an optimized production build.
- `npm run start`: Runs the production server.
- `npm run lint`: Checks for linting errors with ESLint.
- `npm run format`: Formats code with Prettier.
- `npm test`: Runs Vitest test suite.

## Project Structure

```
├── public/                 # Static public assets
├── src/
│   ├── app/                # Next.js App Router (pages and layouts)
│   │   ├── layout.tsx      # Root layout & global metadata
│   │   └── page.tsx        # Homepage landing page
│   ├── assets/             # Images and local fonts (Kalpurush)
│   ├── components/         # Reusable UI components & primitives
│   │   └── ui/             # Radix UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── test/               # Vitest test setup and test specs
│   └── styles.css          # Global Tailwind styles and design tokens
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project manifest & dependencies
```
