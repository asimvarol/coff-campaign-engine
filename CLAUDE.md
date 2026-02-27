# CLAUDE.md — Development Rules & Architecture

**Project**: Coff Campaign Engine
**Method**: RALPH (Research, Architecture, Layout, Production, Health Check)
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
│   ├── ui/               # shadcn/ui components (Mira style)
│   ├── db/               # Prisma schema & client
│   ├── types/            # Shared TypeScript types
│   └── config/           # Shared tsconfig, eslint, etc.
└── docker-compose.yml    # PostgreSQL + Redis
```

### Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind v4, shadcn/ui (Mira preset)
- **Backend**: Hono (API), Prisma (ORM), PostgreSQL, Redis (queue/cache)
- **AI**: fal.ai Nano Banana 2 (image gen), OpenAI (text/concepts)
- **Queue**: BullMQ (background jobs)
- **i18n**: next-intl (EN, TR)
- **Package Manager**: Bun

---

## 🎨 Design System — NON-NEGOTIABLE

### Preset: Mira (Radix)
- **Style**: `radix-mira`
- **Base color**: Stone
- **Theme**: Pink
- **Icons**: HugeIcons (`@hugeicons/react` + `@hugeicons/core-free-icons`)
- **Font**: Google Sans Flex (400, 500, 600, 700)
- **Radius**: `0.625rem`
- **RTL**: false
- **Menu accent**: subtle
- **Color format**: OKLCH

### Color Palette (OKLCH)

**Light Mode:**
```css
--background: oklch(1 0 0)                    /* Pure white */
--foreground: oklch(0.147 0.004 49.25)        /* Near black, warm */
--primary: oklch(0.59 0.22 1)                 /* Pink/rose */
--primary-foreground: oklch(0.97 0.01 343)    /* Light pink */
--secondary: oklch(0.967 0.001 286.375)       /* Cool gray */
--muted: oklch(0.97 0.001 106.424)            /* Warm gray */
--accent: oklch(0.97 0.001 106.424)           /* Warm gray */
--destructive: oklch(0.577 0.245 27.325)      /* Red-orange */
--border: oklch(0.923 0.003 48.717)           /* Soft stone */
```

**Dark Mode (DEFAULT):**
```css
--background: oklch(0.147 0.004 49.25)        /* Deep warm black */
--foreground: oklch(0.985 0.001 106.423)      /* Off-white */
--primary: oklch(0.66 0.21 354)               /* Brighter pink */
--card: oklch(0.216 0.006 56.043)             /* Dark card */
--border: oklch(1 0 0 / 10%)                  /* White 10% */
--input: oklch(1 0 0 / 15%)                   /* White 15% */
```

**Chart Colors (Pink gradient):**
```css
--chart-1: oklch(0.82 0.11 346)   /* Light pink */
--chart-2: oklch(0.73 0.18 350)   /* Medium pink */
--chart-3: oklch(0.66 0.21 354)   /* Pink */
--chart-4: oklch(0.59 0.22 1)     /* Deep pink */
--chart-5: oklch(0.52 0.20 4)     /* Dark pink */
```

### Typography

- **Font family**: `"Google Sans Flex", ui-sans-serif, system-ui, sans-serif`
- **Heading weights**: 600, 700
- **Body weight**: 400, 500
- **Numbers**: `tabular-nums` for data tables
- **NO Geist** — Google Sans Flex only

### Icons

- **Primary**: HugeIcons (`@hugeicons/react`)
- **Import**: `import { IconName } from '@hugeicons/react'`
- **Size**: Default 20px, sidebar 18px, hero 24px
- **NO Lucide** — HugeIcons only (unless specific icon missing)

### Component Rules

- **Dark theme first** — design for dark, light is secondary
- **Cards**: `bg-card` with `border` (oklch 10% white in dark)
- **Buttons**: Primary uses pink, secondary uses muted
- **Inputs**: `bg-input` (15% white in dark), focus ring pink
- **Badges**: Use `default`, `secondary`, `destructive`, `outline` only
- **Animations**: `tw-animate-css` for transitions
- **Spacing**: `p-4` for cards, `p-6` for page sections, `gap-4` for grids

### CSS Architecture (Tailwind v4)

```css
/* globals.css structure — DO NOT change order */
@import "tw-animate-css";
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

@theme inline {
  /* All CSS variables here */
}

.dark {
  /* Dark mode overrides */
}

@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground; }
}
```

### Layout Patterns

- **Sidebar**: Fixed left, collapsible, `bg-sidebar` with subtle accent
- **Content area**: `max-w-7xl mx-auto` for main content
- **Cards**: Rounded `rounded-[var(--radius)]`, border, shadow-sm in light
- **Empty states**: Centered, dashed border, icon + title + CTA
- **Loading**: Skeleton components matching layout shape

---

## 📋 Development Rules

### 1. Code Style

- **TypeScript strict mode** — no `any`, always type everything
- **Functional components** — use hooks, no class components
- **Server Components by default** — only add `"use client"` when needed
- **Modular file structure** — keep files small, single responsibility
- **Named exports** — prefer `export function` over `export default`

### 2. File Naming

- Components: `kebab-case.tsx` (e.g., `brand-dna-card.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- API routes: `kebab-case.ts` (e.g., `brands.ts`)
- Types: defined in `packages/types/src/index.ts`

### 3. Import Order

```typescript
// 1. External packages
import { useState } from 'react'
import { Hono } from 'hono'

// 2. Internal packages (@repo/*)
import { Button } from '@repo/ui/button'
import { prisma } from '@repo/db'

// 3. HugeIcons
import { Globe02Icon, Palette01Icon } from '@hugeicons/react'

// 4. Relative imports
import { formatDate } from '@/lib/utils'
import type { BrandDNA } from '@repo/types'
```

### 4. SelectItem Values

- **NEVER** use empty string `""` as SelectItem value (crashes Radix)
- Use `"__all__"` or `"__none__"` sentinels

### 5. Database (Prisma)

- **Always generate after schema changes**: `bun run db:generate`
- **Use transactions** for multi-model operations
- **Indexes** on foreign keys and frequently queried fields
- **Soft deletes** where appropriate (add `deletedAt: DateTime?`)

### 6. Error Handling

```typescript
// API routes — return proper status codes + consistent format
app.get('/api/brands/:id', async (c) => {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id: c.req.param('id') }
    })
    if (!brand) return c.json({ error: 'Brand not found' }, 404)
    return c.json({ data: brand })
  } catch (error) {
    console.error('Error fetching brand:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})
```

### 7. Environment Variables

- **Never commit `.env`** — always use `.env.example`
- **Validate on startup** with Zod
- **Prefix**: `NEXT_PUBLIC_` for client-side only

---

## 🔀 Git Workflow — MANDATORY

### Branch Protection
- **`main` branch is PROTECTED** — never push directly to main
- For every feature/fix, create a feature branch:
  ```bash
  git checkout -b feat/short-description
  ```

### Branch Naming
```
feat/brand-dna-editor        # New feature
fix/autopilot-rule-eval      # Bug fix
refactor/campaign-api        # Code refactoring
chore/update-deps            # Maintenance
docs/api-documentation       # Documentation
style/dark-theme-polish      # Styling only
```

### Commit Style
```
feat: add Brand DNA extraction pipeline
fix: autopilot rule evaluation logic
chore: update dependencies
docs: add API documentation
style: apply Mira theme to sidebar
refactor: extract campaign generation into service
```

### PR Workflow
```bash
# 1. Create feature branch
git checkout -b feat/brand-dna-editor

# 2. Make changes, commit regularly
git add -A
git commit -m "feat: add brand DNA color palette editor"

# 3. Push and create PR
git push -u origin feat/brand-dna-editor
gh pr create --title "feat: Brand DNA editor" --body "## Summary
- Added color palette editor with OKLCH picker
- Added font selector with Google Fonts preview
- Added tag input for brand values

## Screenshots
[attach screenshots]

## Checklist
- [ ] Types updated
- [ ] API endpoints working
- [ ] UI responsive (mobile + desktop)
- [ ] Dark theme verified
- [ ] No TypeScript errors"
```

### PR Requirements
- **Title**: Must follow commit convention (`feat:`, `fix:`, etc.)
- **Description**: Summary of changes + screenshots for UI changes
- **Checklist**: All items checked before merge
- **Review**: Code review required before merge
- **CI**: All checks must pass (lint, type-check, build)

### After PR Merge
```bash
git checkout main
git pull
git branch -d feat/branch-name  # Clean up local branch
```

---

## 📋 RALPH Method — Per Feature

### R — Research
- Problem definition, user persona, pain point
- Competitor analysis
- Which roles use this feature

### A — Architecture
- Types (`packages/types/src/index.ts`)
- Mock data structure
- Component tree
- API endpoint plan

### L — Layout
- Wireframe or ASCII layout
- Responsive breakpoints
- Badge colors, KPI definitions
- Empty state design

### P — Production
Implement in order:
1. Types → `packages/types/src/index.ts`
2. Mock data → `apps/web/src/lib/mock-data/`
3. API routes → `apps/api/src/routes/`
4. Sidebar nav → `apps/web/src/components/sidebar.tsx`
5. Components → `apps/web/src/components/{feature}/`
6. Page → `apps/web/src/app/(dashboard)/{feature}/`
7. Loading skeleton → `loading.tsx`

### H — Health Check
- [ ] `turbo build` passes
- [ ] Page renders 200 OK
- [ ] Stats display correct values
- [ ] Search + filter works
- [ ] Empty state visible
- [ ] Loading skeleton exists
- [ ] Sidebar active link correct
- [ ] Mobile responsive (320px+)
- [ ] Dark theme verified
- [ ] HugeIcons used (not Lucide)

---

## 🧠 Key Modules

### Brand DNA (Sprint 1)
- **Pipeline**: URL → Scrape → Extract colors/fonts → AI analysis → Store
- **Cost**: 20 credits
- **Models**: `Brand`

### Campaign Engine (Sprint 2)
- **Flow**: Brief → AI concepts → Creative generation → Review → Publish
- **Cost**: 5 credits (concepts) + 3 credits per creative
- **Models**: `Campaign`, `Creative`

### Autopilot ⚡ (Sprint 6 — Killer Feature)
- **Trigger**: Performance metrics below threshold
- **Actions**: Pause, Replace, Notify, Boost
- **Models**: `AutopilotRule`, `AutopilotLog`

---

## 🚨 Common Pitfalls

1. **Using Lucide icons** → Use HugeIcons only
2. **Using Geist font** → Use Google Sans Flex only
3. **HSL colors** → Use OKLCH only
4. **Using `any` type** → Always define proper types
5. **Client Component when Server would work** → Default to Server
6. **Empty string SelectItem value** → Use `"__all__"` sentinel
7. **Pushing to main directly** → Always create PR from feature branch
8. **Missing dark mode check** → Dark is default, always verify
9. **Not running db:generate** → After every schema change
10. **Forgetting responsive check** → Test 320px minimum

---

## 📚 Resources

- [Master Plan](./COFF-CAMPAIGN-ENGINE.md) — Full feature spec
- [Design Preset](https://ui.shadcn.com/init?base=radix&style=mira&baseColor=stone&theme=pink&iconLibrary=hugeicons&font=outfit&menuAccent=subtle&menuColor=default&radius=default&template=next&rtl=false)
- [HugeIcons](https://hugeicons.com) — Icon library
- [Google Sans Flex Font](https://fonts.google.com/specimen/Google Sans Flex)
- [shadcn/ui](https://ui.shadcn.com) — Component library
- [Hono](https://hono.dev) — API framework

---

**Remember**: Mira preset + HugeIcons + Google Sans Flex font + OKLCH colors + dark-first. No exceptions.
