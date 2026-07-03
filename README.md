# Battleship Fullstack

This repository contains a fullstack Battleship game built with a React frontend and a NestJS backend.

The project currently includes production-style authentication, persistent user profiles, board presets, and AI gameplay. Realtime multiplayer support is implemented in the codebase and is under active hardening.

## Project Structure

```text
fullstack/
├── backend/   # NestJS API, Prisma, PostgreSQL
└── front/     # React + Vite client app
```

## Tech Stack

### Backend
- `NestJS` `11.x` — modular API architecture (controllers, services, modules)
- `Prisma` `7.x` + `PostgreSQL` — typed data access, migrations, and relational persistence
- `JWT` (`@nestjs/jwt`) — access and refresh token authentication
- `cookie-parser` — httpOnly refresh-token cookie handling
- `class-validator` + `class-transformer` — DTO validation and request payload safety
- `Socket.IO` (`@nestjs/websockets`, `socket.io`) — realtime multiplayer transport
- `Swagger` (`@nestjs/swagger`) — interactive API documentation at `/docs`
- `Joi` (`@nestjs/config`) — environment configuration validation at startup

### Frontend
- `React` `19.x` + `TypeScript` `6.x` — strongly typed component architecture
- `Vite` `8.x` — fast local dev server and production build pipeline
- `TanStack Router` `1.x` — type-safe route tree and nested app layouts
- `TanStack Query` `5.x` — server-state synchronization and request lifecycle management
- `Zustand` `5.x` — lightweight client-state store for game and session state
- `MUI` `9.x` + `Emotion` — UI primitives and consistent design system
- `Axios` `1.x` — HTTP client with centralized interceptors/auth handling
- `Socket.IO Client` `4.x` — realtime events for matchmaking and multiplayer gameplay

## Architecture

### Frontend Architecture (FSD)
The frontend follows a Feature-Sliced Design style with clear responsibility boundaries:
- `app` — application bootstrap, providers, routing entry points
- `pages` — route-level page composition
- `widgets` — larger UI blocks assembled from features/entities
- `features` — user scenarios and business actions (auth, matchmaking, game flows)
- `entities` — domain entities and reusable domain UI components
- `shared` — cross-cutting utilities, UI kit, API config, constants, base hooks

This structure keeps business logic close to use-cases and reduces coupling between UI layers.

### Backend Architecture (NestJS Canonical Style)
The backend uses NestJS module-oriented architecture:
- `module` level boundaries for each domain (`auth`, `users`, `ai-game`, `multiplayer`, `token`, `session`)
- `controllers` for transport-level concerns (HTTP/WebSocket handlers)
- `services` for business logic orchestration
- `dto` + validation pipeline for input contracts
- `prisma` as the persistence layer with migrations and typed data access

This approach keeps transport, business logic, and data access separated and predictable.

## Implemented Features

- User registration and login
- Access/refresh token authentication flow
- Persistent user board preset
- AI game session lifecycle
  - start session
  - apply user turn
  - trigger AI turns
  - delete session
- Multiplayer module in progress
  - matchmaking queue
  - realtime move synchronization
  - reconnect/resume flow
  - resign flow

## API Overview

Base URL (local): `http://localhost:3000`

### Main REST endpoints
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`
- `GET /users/board-preset`
- `POST /users/board-preset`
- `POST /ai-game/start`
- `POST /ai-game/turn/:sessionId`
- `POST /ai-game/apply-turn/:sessionId`
- `DELETE /ai-game/session/:sessionId`

Swagger docs: `http://localhost:3000/docs`

### Realtime namespace
- Namespace: `/multiplayer`
- Current events include queue, move, resume, and resign flows.

## Environment Variables

Create `backend/.env` (or `.env.local`) with at least:

```env
PORT=3000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
FRONTEND_URL=http://localhost:5173
```

Create `front/.env`:

```env
VITE_API_URL=http://localhost:3000
```

## Local Development

### 1) Install dependencies

```bash
cd backend && npm install
cd ../front && npm install
```

### 2) Generate Prisma client and run migrations

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

### 3) Start backend

```bash
cd backend
npm run start:dev
```

### 4) Start frontend

```bash
cd front
npm run dev
```

Frontend will be available at `http://localhost:5173`.

## Useful Scripts

### Backend
- `npm run start:dev` — run API in watch mode
- `npm run build` — build backend
- `npm run prisma:generate` — generate Prisma client
- `npm run prisma:migrate` — create/apply migrations in dev
- `npm run lint` — run ESLint
- `npm run test` — run tests

### Frontend
- `npm run dev` — run frontend dev server
- `npm run build` — typecheck + production build
- `npm run preview` — preview production build
- `npm run lint` — run ESLint

