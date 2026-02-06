# CLAUDE.md

## Project Overview

Ethiopian Fantasy Premier League (FPL Ethiopia) — a mobile-first fantasy football web app for the Ethiopian market. Built with React + TypeScript + Vite, backed by Supabase (PostgreSQL) and Google Gemini AI.

## Tech Stack

- **Frontend:** React 19, TypeScript 5.8, Vite 6
- **Styling:** Tailwind CSS (loaded via CDN in `index.html`)
- **Icons:** Lucide React
- **Database:** Supabase (PostgreSQL with Row-Level Security)
- **AI:** Google Gemini (`@google/genai`)
- **Markdown:** react-markdown (for AI coach responses)

## Commands

```bash
npm run dev       # Start dev server on http://localhost:3000
npm run build     # Production build to dist/
npm run preview   # Preview production build
```

No test runner, linter, or formatter is currently configured.

## Project Structure

```
├── App.tsx              # Main app component (large — contains most page logic)
├── constants.ts         # Mock data, translations (English + Amharic), config
├── types.ts             # Core TypeScript interfaces
├── scoring.ts           # FPL scoring algorithms
├── index.tsx            # React entry point
├── components/          # 31 React components (modals, hubs, mini-games)
├── hooks/               # useFPLData — data fetching with mock fallback
├── services/            # API integrations (Supabase, Gemini, FPL API)
├── types/               # Additional type definitions (database.ts)
├── supabase/            # Database migrations
├── specs/               # Product specification documents
├── db_schema.sql        # Full PostgreSQL schema with RLS policies
└── scripts/             # Utility scripts
```

## Key Architecture Notes

- `App.tsx` is very large (~78KB) and contains most page/view logic
- `constants.ts` (~107KB) holds mock data, translations, and game constants
- The app uses a custom hook (`useFPLData`) that fetches from the real FPL API with automatic fallback to mock data
- Dual-language support: English and Amharic (translations in `constants.ts`)
- The app intentionally avoids gambling terminology — it's positioned as a "game of skill"
- Coins are a non-monetary in-app currency; real prizes are sponsor-guaranteed

## Environment Variables

Required in `.env.local` (see `.env.example`):

```
VITE_SUPABASE_URL=<supabase-project-url>
VITE_SUPABASE_ANON_KEY=<supabase-anon-key>
VITE_GEMINI_API_KEY=<gemini-api-key>
```

## Database

- Supabase PostgreSQL with RLS policies
- Key tables: `profiles`, `gameweeks`, `players`, `user_teams`, `leagues`, `league_members`
- Auto-creates user profile on auth signup via database trigger
- Migrations in `supabase/migrations/`

## Important Conventions

- Path alias: `@/*` maps to project root (configured in `vite.config.ts` and `tsconfig.json`)
- No tests, ESLint, or Prettier configured — be careful with changes
- Tailwind is loaded via CDN, not as a PostCSS plugin
