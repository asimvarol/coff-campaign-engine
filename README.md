# Coff Campaign Engine

AI-powered campaign management and optimization platform.

## Features

- 🧬 **Brand DNA** — Automatic brand identity extraction from website
- 🎨 **Campaign Engine** — AI-generated multi-platform campaigns
- 📸 **Photoshoot Studio** — Product photography with AI backgrounds
- 📅 **Publish Hub** — Multi-platform scheduling and publishing
- 📊 **Analytics** — Real-time performance tracking
- 🤖 **Autopilot** — Automatic campaign optimization (killer feature!)
- 🏢 **Agency Mode** — Multi-brand management

## Stack

- **Monorepo**: Turborepo + Bun
- **Web**: Next.js 15 (App Router, Turbopack)
- **API**: Hono
- **Database**: PostgreSQL + Prisma
- **UI**: shadcn/ui + Tailwind v4
- **AI**: fal.ai (Nano Banana 2) + OpenAI
- **i18n**: next-intl (EN, TR)

## Getting Started

### Prerequisites

- Node.js 20+
- Bun 1.1.42+
- PostgreSQL 15+
- Redis 7+

### Installation

```bash
# Clone the repo
git clone https://github.com/asimvarol/coff-campaign-engine.git
cd coff-campaign-engine

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Start Docker services
docker-compose up -d

# Run database migrations
bun run db:migrate

# Start development servers
bun run dev
```

### Development

- **Web**: http://localhost:3001
- **API**: http://localhost:3002
- **Prisma Studio**: `bun run db:studio`

## Project Structure

```
coff-campaign-engine/
├── apps/
│   ├── web/          # Next.js 15 web app
│   └── api/          # Hono API server
├── packages/
│   ├── ui/           # shadcn/ui components
│   ├── db/           # Prisma schema & client
│   ├── types/        # Shared TypeScript types
│   └── config/       # Shared configs
└── docker-compose.yml
```

## Scripts

- `bun run dev` — Start all dev servers
- `bun run build` — Build all packages
- `bun run lint` — Lint all packages
- `bun run type-check` — Type check all packages
- `bun run test` — Run tests
- `bun run db:migrate` — Run Prisma migrations
- `bun run db:studio` — Open Prisma Studio

## Documentation

See [CLAUDE.md](./CLAUDE.md) for development guidelines and architecture details.

## License

MIT
