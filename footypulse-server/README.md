# ⚽ FootyPulse Server

PERN Stack API for the FootyPulse football platform. Built with **PostgreSQL (Neon)**, **Express**, **React** (client), and **Node.js**.

---

## 🚀 Quick Start

### Step 1: Setup Neon Database
1. Go to [https://console.neon.tech](https://console.neon.tech) and create a free account
2. Create a new project called `footypulse`
3. Copy the **connection string** from Dashboard → Connection Details
   - It looks like: `postgresql://user:pass@ep-xxxx.us-east-2.aws.neon.tech/footypulse?sslmode=require`

### Step 2: Configure Environment
```bash
cp .env.example .env
# Edit .env and paste your Neon connection string as DATABASE_URL
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Create Database Tables
```bash
npm run db:schema    # Creates all 18 tables
npm run db:indexes   # Adds performance indexes
npm run db:seed      # Inserts sample data
```

### Step 5: Start the Server
```bash
npm run dev          # Development (with auto-restart)
npm start            # Production
```

### Step 6: Test
```
GET http://localhost:5000/api/health
GET http://localhost:5000/api/v1/countries
```

---

## 📁 Architecture & File Connections

```
REQUEST FLOW:
─────────────────────────────────────────────────────────────────
Client Request
    ↓
server.js          → Entry point, starts Express
    ↓
src/app.js         → Middleware chain (helmet → cors → json → logger → rateLimiter)
    ↓
src/routes/index.js → Route aggregator, dispatches to resource routes
    ↓
src/routes/teamsRoutes.js → Applies auth + validation middleware
    ↓
src/controllers/teamsController.js → Business logic, calls model
    ↓
src/models/teamModel.js → SQL queries via db.query()
    ↓
src/config/db.js → Neon PostgreSQL pool
    ↓
Response (JSON)
─────────────────────────────────────────────────────────────────
```

### How Files Connect to Each Other:

| File | Imports From | Exports To |
|------|-------------|------------|
| `server.js` | `app.js`, `config/env.js`, `config/db.js` | — (entry point) |
| `src/app.js` | all middleware, `routes/index.js` | `server.js` |
| `routes/index.js` | all `*Routes.js` files | `app.js` |
| `routes/teamsRoutes.js` | `controllers/teamsController`, `middleware/auth`, `validators/teamValidator`, `middleware/validate` | `routes/index.js` |
| `controllers/teamsController.js` | `models/teamModel`, `utils/asyncHandler`, `utils/ApiError`, `utils/pagination` | `routes/teamsRoutes.js` |
| `models/teamModel.js` | `config/db.js` | `controllers/teamsController.js` |
| `config/db.js` | `config/env.js` | all model files |
| `middleware/auth.js` | `config/env.js`, `utils/ApiError` | all route files |
| `middleware/errorHandler.js` | `config/env.js` | `app.js` |

---

## 📡 API Endpoints

Base URL: `http://localhost:5000/api/v1`

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Create account |
| POST | `/auth/login` | No | Get JWT token |
| GET | `/auth/me` | Yes | Current user |

### Countries
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/countries` | No | List all |
| GET | `/countries/:id` | No | Get by ID |
| GET | `/countries/code/:code` | No | Get by code (ENG) |
| POST | `/countries` | Yes | Create |
| PUT | `/countries/:id` | Yes | Update |
| DELETE | `/countries/:id` | Yes | Delete |

### Teams
| Method | Endpoint | Auth | Filters |
|--------|----------|------|---------|
| GET | `/teams` | No | `?country_id=1&team_type=club&page=1&limit=20` |
| GET | `/teams/:id` | No | — |
| GET | `/teams/:id/squad` | No | Current squad |
| POST | `/teams` | Yes | — |
| PUT | `/teams/:id` | Yes | — |
| DELETE | `/teams/:id` | Yes | — |

### Matches
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/matches` | No | `?season_id=1&team_id=2&status=finished&date_from=2025-01-01` |
| GET | `/matches/live` | No | Live matches |
| GET | `/matches/date/2025-01-15` | No | By date |
| GET | `/matches/h2h/:team1/:team2` | No | Head to head |
| GET | `/matches/:id` | No | Full match detail |
| POST | `/matches` | Yes | Create |
| PUT | `/matches/:id` | Yes | Update |

### Standings
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/standings/season/:seasonId` | No |
| GET | `/standings/season/:seasonId?group=A` | No |
| POST | `/standings/bulk` | Yes |

### Search
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/search?q=messi&type=all` | Global search |
| GET | `/search?q=madrid&type=teams` | Teams only |

*Similar CRUD endpoints exist for: stadiums, competitions, seasons, persons, contracts, match-players, match-events, transfers, achievements, articles, comments, polls, poll-votes*

---

## 🔑 Authentication

```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test1234","name":"Test User"}'

# Login (returns JWT token)
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test1234"}'

# Use token for protected routes
curl http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
