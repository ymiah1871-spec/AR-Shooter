# replit.md

## Overview

AR Hunt is an augmented reality shooter game built as a full-stack web application. Players use their device's camera to detect AR markers (Hiro markers) and shoot virtual monsters that appear in the real world. The app features a cyberpunk/neon-themed UI, a timed gameplay mode (60 seconds), and a persistent leaderboard where players can submit and view high scores.

The project uses A-Frame and AR.js for the AR experience, React for the UI layer, Express for the backend API, and PostgreSQL with Drizzle ORM for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (client/)
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router) with three main pages: Home (`/`), Game (`/game`), Leaderboard (`/leaderboard`)
- **Styling**: Tailwind CSS with a custom cyberpunk/neon theme using CSS variables, plus shadcn/ui component library (new-york style)
- **AR Technology**: A-Frame v1.5.0 and AR.js loaded via CDN script tags in `client/index.html`. The AR scene uses marker-based detection (Hiro marker preset) with `mono_and_matrix` detection mode
- **State Management**: TanStack React Query for server state (fetching/mutating scores)
- **Animations**: Framer Motion for page transitions and UI animations
- **Custom Components**: `CyberButton` and `CyberCard` are custom-styled components that match the cyberpunk theme with neon glow effects, corner accents, and scanline overlays
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend (server/)
- **Framework**: Express 5 on Node.js with TypeScript (executed via tsx)
- **API Pattern**: RESTful JSON API with routes defined in `shared/routes.ts` as a typed contract (method, path, input/output schemas using Zod). This shared route definition ensures type safety between client and server
- **Endpoints**:
  - `GET /api/scores` — returns all scores ordered by score descending
  - `POST /api/scores` — creates a new score entry (validated with Zod)
- **Auto-seeding**: The server seeds 3 default scores if the database is empty on startup
- **Dev mode**: Vite dev server runs as middleware (HMR via `/vite-hmr`)
- **Production**: Client is built to `dist/public`, server is bundled with esbuild to `dist/index.cjs`

### Shared Layer (shared/)
- **Schema** (`shared/schema.ts`): Drizzle ORM table definitions and Zod validation schemas generated via `drizzle-zod`
- **Routes** (`shared/routes.ts`): Typed API route definitions with Zod schemas for inputs and responses, shared between client and server

### Database
- **Database**: PostgreSQL via `DATABASE_URL` environment variable
- **ORM**: Drizzle ORM with `drizzle-kit` for schema management (`db:push` command)
- **Schema**: Single `scores` table with columns: `id` (serial PK), `username` (text), `score` (integer), `createdAt` (timestamp with default)
- **Storage Pattern**: `IStorage` interface in `server/storage.ts` with `DatabaseStorage` implementation — abstracts DB operations behind an interface

### Build System
- **Development**: `npm run dev` — runs tsx with Vite middleware for HMR
- **Production Build**: `npm run build` — Vite builds the client, esbuild bundles the server. Server dependencies on an allowlist are bundled to reduce cold start syscalls
- **Schema Push**: `npm run db:push` — pushes Drizzle schema to PostgreSQL

## External Dependencies

### Database
- **PostgreSQL**: Required. Connection via `DATABASE_URL` environment variable. Used with `pg` (node-postgres) driver and Drizzle ORM

### CDN Libraries (loaded in index.html)
- **A-Frame v1.5.0**: 3D/VR framework for rendering AR scenes (`https://aframe.io/releases/1.5.0/aframe.min.js`)
- **AR.js**: AR marker detection library for A-Frame (`https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js`)

### Key NPM Packages
- **Frontend**: React, Wouter, TanStack React Query, Framer Motion, shadcn/ui (Radix UI primitives), Tailwind CSS, Lucide icons
- **Backend**: Express 5, Drizzle ORM, drizzle-zod, connect-pg-simple, Zod
- **Fonts**: Oxanium and Rajdhani from Google Fonts (loaded in CSS)