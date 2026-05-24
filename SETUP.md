# How to Run Gym-Guide-Pro

## Prerequisites
- Node.js 18+ and pnpm (`npm install -g pnpm`)  
- MongoDB running locally (`mongod`) or a MongoDB Atlas URI

## Setup

### 1. Install dependencies (once)
```bash
pnpm install --ignore-scripts
```

### 2. Configure environment
```bash
cp artifacts/api-server/.env.example artifacts/api-server/.env
# Edit .env and set:
#   MONGODB_URI=mongodb://localhost:27017/gymguide
#   JWT_SECRET=your-secret-key-here
#   PORT=3000
```

### 3. Start the backend
```bash
cd artifacts/api-server
npx tsx src/index.ts
```
The server connects to MongoDB, seeds data on first run, then listens on `http://localhost:3000`.

### 4. Start the frontend (separate terminal)
```bash
cd artifacts/gym-planner
npx vite --config vite.config.ts
```
Frontend available at `http://localhost:5173`.

## Architecture

- **Frontend**: React + Vite + Wouter at `artifacts/gym-planner/`
- **Backend**: Express + Mongoose at `artifacts/api-server/`
- **Database**: MongoDB (replaces original PostgreSQL)

## Authentication

- Register at `/register`, login at `/login`
- JWT token stored in `localStorage`, sent as `Authorization: Bearer <token>`
- `/api/workout-logs` and `/api/stats` require authentication
- All other routes are public (exercises, plans, nutrition, calculator)

## API Endpoints

| Route | Auth | Description |
|-------|------|-------------|
| POST /api/auth/register | — | Create account |
| POST /api/auth/login | — | Get JWT token |
| POST /api/auth/logout | — | Client-side logout |
| GET /api/auth/me | ✅ | Get current user |
| GET /api/exercises | — | List exercises |
| GET /api/muscles | — | List muscle groups |
| GET /api/workout-plans | — | List workout plans |
| GET /api/nutrition-guides | — | List nutrition guides |
| POST /api/calculator/tdee | — | Calculate TDEE |
| GET /api/workout-logs | ✅ | Your workout logs |
| POST /api/workout-logs | ✅ | Create session |
| GET /api/stats/summary | ✅ | Dashboard stats |
