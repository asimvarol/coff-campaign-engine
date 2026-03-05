# Multi-stage build
FROM oven/bun:1.1.42 AS builder

WORKDIR /app

COPY . .

RUN bun install --frozen-lockfile

RUN cd apps/web && bun run build

# Production stage
FROM node:20-slim

RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Add non-root user
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

USER nextjs

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s CMD curl -f http://localhost:3000/api/ping || exit 1

CMD ["node", "apps/web/server.js"]
