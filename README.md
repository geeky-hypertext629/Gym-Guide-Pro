# Gym Guide Pro

A full-stack fitness tracking web application for logging workouts, following structured plans, monitoring progress, and planning nutrition.

---

## Features

- **Dashboard** — weekly stats, current streak, total volume, and recent activity at a glance
- **Exercise Library** — 28+ exercises with muscle-map visuals and animated GIFs
- **Workout Plans** — beginner-to-advanced structured programs with day-by-day breakdowns
- **Workout Log** — log sessions, track sets/reps/weight, and mark workouts complete
- **Progress Charts** — visualise strength gains over time with interactive charts
- **Muscle Map** — interactive body diagram linking muscles to their exercises
- **Nutrition Guides** — goal-based macro and meal guidance
- **TDEE Calculator** — personalised daily calorie and macro targets
- **Personalised Plan** — questionnaire-driven workout program recommendation
- **Auth** — JWT-based register/login with protected routes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Routing | Wouter |
| State / Data fetching | TanStack React Query |
| UI components | Radix UI + shadcn/ui, Tailwind CSS v4 |
| Animations | Framer Motion |
| Charts | Recharts |
| Backend | Node.js, Express 5, TypeScript |
| Database | MongoDB (Mongoose) |
| Auth | JWT + bcryptjs |
| Logging | Pino |
| Package manager | pnpm (workspace monorepo) |

---

## Project Structure

```
.
├── artifacts/
│   ├── gym-planner/          # React frontend (Vite)
│   │   └── src/
│   │       ├── components/   # Layout, UI primitives, ProtectedRoute
│   │       ├── context/      # AuthContext (JWT state)
│   │       ├── pages/        # One file per route
│   │       └── lib/          # Utilities, exercise GIF map
│   └── api-server/           # Express REST API
│       └── src/
│           ├── routes/       # Auth, exercises, plans, logs, nutrition, stats, calculator
│           ├── models/       # Mongoose schemas
│           ├── middleware/   # JWT auth middleware
│           └── seed.ts       # Database seed script
└── lib/                      # Shared packages (api-client-react)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+
- A MongoDB instance (local or Atlas)

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure the API server

```bash
cp artifacts/api-server/.env.example artifacts/api-server/.env
```

Edit `.env` and fill in your values:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/gymguide
JWT_SECRET=your-long-random-secret
PORT=3000
NODE_ENV=development
```

### 3. Seed the database (optional)

```bash
cd artifacts/api-server
npx tsx src/seed.ts
```

### 4. Start development servers

From the repo root, run both servers concurrently:

```bash
# Terminal 1 — API server (http://localhost:3000)
cd artifacts/api-server
pnpm dev

# Terminal 2 — Frontend (http://localhost:5200)
cd artifacts/gym-planner
pnpm dev
```

---

## API Endpoints

All routes are prefixed with `/api`.

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Create account |
| POST | `/auth/login` | — | Sign in, receive JWT |
| GET | `/auth/me` | ✓ | Current user profile |
| GET | `/muscles` | — | List muscle groups |
| GET | `/exercises` | — | List all exercises |
| GET | `/exercises/:id` | — | Exercise detail |
| GET | `/workout-plans` | — | List workout plans |
| GET | `/workout-plans/:id` | — | Plan detail |
| GET | `/workout-logs` | ✓ | User's workout logs |
| POST | `/workout-logs` | ✓ | Create workout log |
| PUT | `/workout-logs/:id` | ✓ | Update workout log |
| DELETE | `/workout-logs/:id` | ✓ | Delete workout log |
| GET | `/nutrition-guides` | — | List nutrition guides |
| GET | `/nutrition-guides/:id` | — | Guide detail |
| GET | `/stats/summary` | ✓ | Dashboard stats |
| POST | `/calculator/tdee` | — | Calculate TDEE & macros |

---

## Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `PORT` | API server port (default: `3000`) |
| `NODE_ENV` | `development` or `production` |
