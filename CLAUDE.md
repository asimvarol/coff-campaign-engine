# CLAUDE.md — Development Rules & Architecture

**Project**: Coff Campaign Engine
**Method**: RALPH (Read, Assess, Layout, Plan, Harvest)
**Last Updated**: 2026-02-27

---

## 🎯 Project Purpose

AI-powered campaign management platform that:
1. Extracts brand identity from websites (Brand DNA)
2. Generates multi-platform campaign creatives
3. Publishes to social platforms with scheduling
4. Tracks performance and auto-optimizes failing campaigns (Autopilot)

**Killer feature**: Autopilot — automatically pauses underperforming ads and generates better replacements.

---

## 🏗 Architecture

### Monorepo Structure (Turborepo)

```
coff-campaign-engine/
├── apps/
│   ├── web/              # Next.js 15 (App Router, port 3001)
│   └── api/              # Hono API server (port 3002)
├── packages/
│   ├── ui/               # shadcn/ui components
│   ├── db/               # Prisma schema & client
│   ├── types/            # Shared TypeScript types
│   └── config/           # Shared tsconfig, eslint, etc.
└── docker-compose.yml    # PostgreSQL + Redis
```

### Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind v4, shadcn/ui
- **Backend**: Hono (API), Prisma (ORM), PostgreSQL, Redis (queue/cache)
- **AI**: fal.ai (image gen), OpenAI (text/concepts)
- **Queue**: BullMQ (background jobs)
- **i18n**: next-intl (EN, TR)
- **Fonts**: Geist Sans, Geist Mono
- **Colors**: OKLCH palette, dark theme default

---

## 📋 Development Rules

### 1. Code Style

- **TypeScript strict mode** — no `any`, always type everything
- **Functional components** — use hooks, no class components
- **Server Components by default** — only add `"use client"` when needed
- **Modular file structure** — keep files small, single responsibility
- **Named exports** — prefer `export function` over `export default`

### 2. File Naming

- Components: `PascalCase.tsx` (e.g., `BrandDNACard.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- API routes: `route.ts` (Next.js convention)
- Types: `types.ts` or `[name].types.ts`

### 3. Import Order

```typescript
// 1. External packages
import { useState } from 'react'
import { Hono } from 'hono'

// 2. Internal packages (@repo/*)
import { Button } from '@repo/ui/button'
import { prisma } from '@repo/db'

// 3. Relative imports
import { formatDate } from '@/lib/utils'
import type { BrandDNA } from '@/types'
```

### 4. Database (Prisma)

- **Always generate after schema changes**: `bun run db:generate`
- **Use transactions** for multi-model operations
- **Indexes** on foreign keys and frequently queried fields
- **Soft deletes** where appropriate (add `deletedAt: DateTime?`)

### 5. Error Handling

```typescript
// API routes — return proper status codes
app.get('/api/brands/:id', async (c) => {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id: c.req.param('id') }
    })
    if (!brand) return c.json({ error: 'Brand not found' }, 404)
    return c.json(brand)
  } catch (error) {
    console.error('Error fetching brand:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})
```

### 6. Environment Variables

- **Never commit `.env`** — always use `.env.example`
- **Validate on startup** — use `zod` to validate env vars
- **Type-safe access** — create `env.ts` helper

```typescript
// lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string(),
  FAL_AI_KEY: z.string(),
  // ...
})

export const env = envSchema.parse(process.env)
```

### 7. UI Components (shadcn/ui)

- **Install via CLI**: `bunx shadcn@latest add button`
- **Customize in packages/ui** — maintain consistency
- **Dark theme first** — design for dark, adapt to light
- **Accessible** — use proper ARIA labels, keyboard navigation

### 8. API Design

- **RESTful conventions** — GET, POST, PUT, DELETE
- **Consistent response format**:
  ```json
  {
    "data": {...},
    "error": null
  }
  ```
- **Use HTTP status codes** properly
- **Pagination** for list endpoints
- **Rate limiting** on public endpoints

---

## 🧠 Key Concepts

### Brand DNA

- **Purpose**: Extract brand identity from website
- **Pipeline**: Scrape → Extract colors/fonts → AI analysis → Store
- **Cost**: 20 credits
- **Models**: `Brand`

### Campaign

- **Purpose**: Generate multi-platform ad campaigns
- **Flow**: Brief → AI concepts → Creative generation → Review → Publish
- **Cost**: 5 credits (concepts) + 3 credits per creative
- **Models**: `Campaign`, `Creative`, `CreativePerformance`

### Autopilot (🚀 Killer Feature)

- **Purpose**: Auto-pause failing ads, auto-generate replacements
- **Trigger**: Performance metrics below threshold (e.g., CTR < 1%)
- **Actions**: Pause, Replace, Notify, Boost
- **Models**: `AutopilotRule`, `AutopilotLog`

---

## 🔄 Development Workflow

### Starting New Feature

1. **Read master plan** (`COFF-CAMPAIGN-ENGINE.md`)
2. **Update database schema** if needed (`packages/db/prisma/schema.prisma`)
3. **Generate Prisma client** (`bun run db:generate`)
4. **Create types** (`packages/types/`)
5. **Build API endpoints** (`apps/api/`)
6. **Build UI components** (`apps/web/`)
7. **Test manually** (no automated tests yet, but write tests in future)
8. **Commit with descriptive message**

### Git Commit Style

```
feat: add Brand DNA extraction pipeline
fix: autopilot rule evaluation logic
chore: update dependencies
docs: add API documentation
```

### Before Pushing

- [ ] `bun run lint` — no errors
- [ ] `bun run type-check` — no errors
- [ ] `bun run build` — builds successfully
- [ ] Manual testing of changed features
- [ ] Environment variables documented in `.env.example`

---

## 📦 Package-Specific Rules

### `apps/web` (Next.js)

- **Port**: 3001
- **Use App Router** — `app/` directory
- **Server Components** by default
- **Client Components** only when needed (interactivity, hooks, browser APIs)
- **Route groups** for layout variations: `(auth)`, `(dashboard)`, etc.
- **Metadata** on every page

### `apps/api` (Hono)

- **Port**: 3002
- **CORS** enabled for `localhost:3001`
- **Auth middleware** on protected routes
- **Rate limiting** on expensive operations
- **Queue jobs** for long-running tasks (fal.ai generation, scraping)

### `packages/db` (Prisma)

- **Single source of truth** for data models
- **Migrations** for schema changes
- **Seed script** for dev data
- **Indexes** on foreign keys

### `packages/ui` (shadcn/ui)

- **Shared components** only
- **Storybook** (future) for documentation
- **Tailwind classes** — no CSS modules
- **Variants** using `cva` (class-variance-authority)

### `packages/types`

- **Shared types** between web and API
- **No runtime code** — types only
- **Export everything** explicitly

---

## 🚨 Common Pitfalls

1. **Using `any` type** → Always define proper types
2. **Client Component when Server Component would work** → Default to Server
3. **Not handling API errors** → Always try/catch
4. **Hardcoding URLs** → Use env vars
5. **Forgetting to regenerate Prisma** → Run `db:generate` after schema changes
6. **Not using transactions** → Multi-model operations should be atomic
7. **Missing indexes** → Queries on foreign keys need indexes

---

## 🎨 Design System

### Colors (OKLCH)

```css
/* packages/ui/styles/globals.css */
:root {
  --background: oklch(0.13 0.02 264); /* Dark gray-blue */
  --foreground: oklch(0.98 0 0);     /* Near white */
  --primary: oklch(0.7 0.2 264);     /* Brand blue */
  --accent: oklch(0.8 0.15 120);     /* Success green */
  --destructive: oklch(0.6 0.2 20);  /* Error red */
  /* ... */
}
```

### Typography

- **Heading**: Geist Sans (700)
- **Body**: Geist Sans (400)
- **Mono**: Geist Mono (400)

### Spacing

- Use Tailwind spacing scale: `p-4`, `m-2`, `gap-6`, etc.
- Consistent padding: `p-4` for cards, `p-6` for sections

---

## 🔮 Future Improvements

- [ ] Automated testing (Vitest + React Testing Library)
- [ ] Storybook for UI components
- [ ] OpenAPI docs for API
- [ ] Sentry error tracking
- [ ] E2E tests (Playwright)
- [ ] Performance monitoring
- [ ] Feature flags system

---

## 📚 Resources

- [Master Plan](./COFF-CAMPAIGN-ENGINE.md)
- [Turborepo Docs](https://turbo.build/repo/docs)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Hono Docs](https://hono.dev)

---

**Remember**: This is a production-grade platform. Write code you'd be proud to show in a code review. Quality > speed.
