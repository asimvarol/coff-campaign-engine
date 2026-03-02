# Contributing to Coff Campaign Engine

## Development Setup

```bash
# Clone the repo
git clone <repo-url>
cd coff-campaign-engine

# Install dependencies
bun install

# Copy env template
cp .env.example .env.local

# Run dev servers
bun run dev
```

## Tech Stack

- **Frontend**: Next.js 15 (Turbopack)
- **Backend**: Hono API
- **Database**: PostgreSQL + Prisma
- **Styling**: Tailwind CSS v4
- **Icons**: HugeIcons (strict policy)
- **Auth**: NextAuth v4
- **Monorepo**: Turborepo + Bun

## Code Standards

### TypeScript
- Strict mode enforced
- No `any` types
- Explicit return types for functions
- Use type inference where clear

### Components
- Prefer function components
- Use React hooks (no class components)
- Extract reusable logic to custom hooks
- Keep components under 300 LOC

### Icons
- **ONLY HugeIcons** - no exceptions
- Import from `@/lib/icons`
- Never import from `lucide-react`

### Styling
- Tailwind utility classes only
- No inline styles
- Use `cn()` for conditional classes
- Dark-first design system

### Naming
- Files: kebab-case (`user-profile.tsx`)
- Components: PascalCase (`UserProfile`)
- Functions: camelCase (`getUserData`)
- Constants: SCREAMING_SNAKE_CASE (`API_URL`)

## Git Workflow

```bash
# Create feature branch
git checkout -b feat/feature-name

# Make changes
git add .
git commit -m "feat: Add feature description"

# Push and PR
git push origin feat/feature-name
```

### Commit Convention
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `chore:` Maintenance
- `refactor:` Code restructuring
- `test:` Tests
- `perf:` Performance

## Testing

```bash
# Type check
bun run type-check

# Lint
bun run lint

# Build
bun run build
```

## Pull Request

1. Keep PRs focused (one feature/fix)
2. Write descriptive titles
3. Include screenshots for UI changes
4. Ensure CI passes
5. Request review

## Questions?

Open an issue or ask in Discord.
