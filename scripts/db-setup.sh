#!/bin/bash

# Database setup script
# Creates initial migration and generates Prisma client

set -e

echo "🗄️  Database Setup"
echo ""

cd packages/db

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 &> /dev/null; then
    echo "⚠️  PostgreSQL not running"
    echo ""
    echo "Start with Docker:"
    echo "  docker-compose up -d postgres"
    echo ""
    echo "Or local PostgreSQL:"
    echo "  brew services start postgresql@16"
    exit 1
fi

echo "✅ PostgreSQL is running"
echo ""

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Create initial migration
echo "🔄 Creating initial migration..."
npx prisma migrate dev --name init

# Seed database (if seed script exists)
if [ -f "prisma/seed.ts" ]; then
    echo "🌱 Seeding database..."
    npx prisma db seed
fi

echo ""
echo "✅ Database setup complete!"
echo ""
echo "Next steps:"
echo "  - Open Prisma Studio: bun run db:studio"
echo "  - View schema: packages/db/prisma/schema.prisma"
echo ""
