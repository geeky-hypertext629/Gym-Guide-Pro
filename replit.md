# GymGuide

A comprehensive gym companion web app for beginners through advanced lifters. Features an exercise library, structured workout plans, a session logger, progress charts, nutrition guides, and a TDEE calculator.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, served at `/api`)
- `pnpm --filter @workspace/gym-planner run dev` — run the frontend (port 23346, served at `/`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19, Vite, Tailwind, Shadcn/UI, Framer Motion, Recharts, Wouter, TanStack Query
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/gym-planner/src/` — React frontend
  - `pages/` — all page components (dashboard, exercises, plans, log, progress, nutrition, calculator)
  - `components/layout.tsx` — sidebar nav layout
  - `index.css` — global theme (green primary `142 71% 45%`)
- `artifacts/api-server/src/routes/` — all Express route handlers
- `lib/api-spec/openapi.yaml` — source-of-truth API contract
- `lib/api-client-react/src/generated/api.ts` — generated React Query hooks (do not edit)
- `lib/db/src/schema/index.ts` — Drizzle ORM schema (all tables)

## Architecture decisions

- Contract-first: OpenAPI spec → Orval codegen → typed React Query hooks used on frontend
- All DB queries use Drizzle ORM; no raw SQL in route handlers
- Shared proxy routes `/api` to API server and `/` to frontend; services never call each other's ports directly
- Mifflin-St Jeor formula for TDEE; activity multipliers and macro splits computed server-side
- Nutrition guide `sampleMeals` and `tips` stored as JSONB columns

## Product

- **Exercise Library** — 28 exercises filterable by muscle, equipment, difficulty; detail page with sets/reps/rest and muscle breakdown
- **Workout Plans** — 3 structured plans (Beginner Full Body, Push-Pull-Legs, Advanced Strength) with day-by-day exercise lists
- **Workout Logger** — create sessions, log sets with weight/reps per exercise, mark complete
- **Progress Tracker** — Recharts line chart of best weight over time per exercise; completed session history
- **Nutrition Guides** — 4 goal-based plans (muscle gain, fat loss, maintenance, endurance) with macro targets and sample meal plans
- **TDEE Calculator** — inputs weight, height, age, sex, activity level, goal; returns BMR, TDEE, target calories, and macros

## Gotchas

- Generated hooks use `queryKey` as a required field in conditional query options: `{ query: { enabled: !!id, queryKey: getFooQueryKey(id) } }`
- Mutation shapes from codegen: `mutate({ id, data })` not `mutate({ params: { id }, data })`
- Always run `pnpm --filter @workspace/api-spec run codegen` after changing `openapi.yaml`
- Do NOT run `pnpm run dev` at workspace root — use individual artifact workflows

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
