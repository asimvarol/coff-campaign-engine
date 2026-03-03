# Multi-stage build for Render.com
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy everything first (simpler for monorepo)
COPY . .

# Install ALL dependencies from root (includes workspaces)
RUN bun install --frozen-lockfile || bun install

# Build the web app from root (so workspace deps are available)
RUN cd apps/web && bun run build

# Production stage
FROM node:20-slim

WORKDIR /app

# Copy standalone output (includes all needed node_modules)
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "apps/web/server.js"]
