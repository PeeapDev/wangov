#!/bin/bash
# Fix Local Development Script

echo "🔧 Fixing WanGov Local Development..."

# Start PostgreSQL with Docker
echo "🐳 Starting PostgreSQL with Docker..."
docker compose -f docker-compose.dev.yml up -d
echo "✅ PostgreSQL started on port 5433"

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Navigate to backend directory
cd wangov-id

# Copy local environment file
cp .env.local .env
echo "✅ Updated environment to use PostgreSQL"

# Install dependencies if needed
npm install

# Generate Prisma client
npx prisma generate
echo "✅ Generated Prisma client"

# Run database migrations
npx prisma db push
echo "✅ Created PostgreSQL database"

# Seed the database
npm run seed 2>/dev/null || echo "⚠️ Seeding skipped (optional)"

echo ""
echo "🎉 Local development fixed!"
echo ""
echo "Now you can run:"
echo "  npm run dev"
echo ""
echo "Services will be available at:"
echo "  Frontend: http://localhost:3003"
echo "  Backend:  http://localhost:3004"
