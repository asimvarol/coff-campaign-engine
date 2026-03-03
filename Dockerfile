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
FROM oven/bun:1-slim

WORKDIR /app

# Copy built artifacts and dependencies
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/package.json ./package.json

# Symlink node_modules so next is resolvable from apps/web
RUN ln -s /app/node_modules /app/apps/web/node_modules

WORKDIR /app/apps/web

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["bun", "node_modules/next/dist/bin/next", "start", "--port", "3000"]
