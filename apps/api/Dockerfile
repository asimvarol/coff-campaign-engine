FROM oven/bun:1 AS builder

WORKDIR /app

COPY . .

RUN bun install --frozen-lockfile || bun install

# Generate Prisma client
RUN cd packages/db && bunx prisma generate

# Build API
RUN cd apps/api && bun run build

# Production stage
FROM oven/bun:1-slim

WORKDIR /app

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/db/prisma ./prisma

EXPOSE 3002

ENV NODE_ENV=production
ENV API_PORT=3002

CMD ["bun", "run", "dist/index.js"]
