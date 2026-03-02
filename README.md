# 🚀 Coff Campaign Engine

AI-powered marketing campaign management platform built with Next.js 15, Hono, and Prisma.

[![CI](https://github.com/your-org/coff-campaign-engine/workflows/CI/badge.svg)](https://github.com/your-org/coff-campaign-engine/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🎨 **Brand DNA Extraction** - AI-powered brand analysis
- 📊 **Campaign Management** - Create, track, and optimize campaigns
- 📸 **Photoshoot Studio** - AI-generated product photography
- 📅 **Publishing Calendar** - Multi-platform scheduling
- 📈 **Analytics Dashboard** - Real-time performance tracking
- ⚡ **Autopilot Mode** - AI-driven campaign automation
- 🏢 **Agency Module** - Multi-brand management

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router + Turbopack)
- **Backend**: Hono API
- **Database**: PostgreSQL + Prisma
- **Auth**: NextAuth.js v4
- **Styling**: Tailwind CSS v4
- **Icons**: HugeIcons
- **Monorepo**: Turborepo + Bun

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) >= 1.0
- Node.js >= 18
- PostgreSQL >= 14 (optional for development)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/coff-campaign-engine.git
cd coff-campaign-engine

# Install dependencies
bun install

# Copy environment variables
cp .env.example .env.local

# Run development servers
bun run dev
```

Visit [http://localhost:3001](http://localhost:3001)

### With Docker

```bash
# Start all services (PostgreSQL + Redis + Web)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📁 Project Structure

```
coff-campaign-engine/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Hono backend
├── packages/
│   ├── db/           # Prisma schema & client
│   ├── types/        # Shared TypeScript types
│   └── ui/           # Shared UI components
├── .github/          # GitHub Actions & templates
└── docs/             # Documentation
```

## 🧪 Development

```bash
# Run development servers
bun run dev

# Build for production
bun run build

# Type checking
bun run type-check

# Linting
bun run lint

# Database migrations
cd packages/db
npx prisma migrate dev
```

## 📝 Documentation

- [Contributing Guide](./CONTRIBUTING.md)
- [Roadmap](./ROADMAP.md)
- [Performance Metrics](./PERFORMANCE.md)
- [Architecture](./CLAUDE.md)

## 🔐 Environment Variables

See [.env.example](./.env.example) for required environment variables.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - NextAuth secret key
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret

## 🚢 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/coff-campaign-engine)

### Docker

```bash
docker build -t coff-campaign-engine .
docker run -p 3000:3000 coff-campaign-engine
```

### Manual

```bash
bun run build
bun start
```

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📊 Status

- **Build**: ✅ Passing
- **TypeScript**: ✅ 0 errors
- **Pages**: 30 working
- **Coverage**: TBD

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Icons by [HugeIcons](https://hugeicons.com)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com)

---

**Status**: Production Ready ✅  
**Version**: 1.0.0  
**Last Updated**: 2026-03-02
