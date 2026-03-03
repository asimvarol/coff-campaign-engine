# Multi-stage build for Render.com
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy everything first (simpler for monorepo)
COPY . .

# Install dependencies
RUN bun install

# Build the web app (skip turbo, build directly)
WORKDIR /app/apps/web
RUN bun run build

# Production stage
FROM oven/bun:1-slim

WORKDIR /app

# Copy built artifacts and dependencies
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/package.json ./package.json

WORKDIR /app/apps/web

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["bun", "run", "start"]
