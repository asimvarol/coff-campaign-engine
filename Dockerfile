# Dockerfile for Railway deployment
FROM oven/bun:1 AS base

WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
COPY apps/web/package.json ./apps/web/
COPY packages/*/package.json ./packages/

RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Build
RUN bun run turbo run build --filter=@repo/web...

# Production stage
FROM oven/bun:1-slim

WORKDIR /app

# Copy built artifacts
COPY --from=base /app/apps/web/.next ./apps/web/.next
COPY --from=base /app/apps/web/public ./apps/web/public
COPY --from=base /app/apps/web/package.json ./apps/web/
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/packages ./packages

WORKDIR /app/apps/web

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["bun", "start"]
