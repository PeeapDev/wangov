#!/bin/bash

# WanGov-ID Deployment Script
# This script builds and deploys all services

set -e

echo "🚀 Starting WanGov-ID Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker > /dev/null 2>&1; then
    print_error "Docker is not installed. Please install Docker and try again."
    exit 1
fi

# Check for docker compose (v2) or docker-compose (v1)
if command -v docker > /dev/null 2>&1 && docker compose version > /dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
elif command -v docker-compose > /dev/null 2>&1; then
    DOCKER_COMPOSE="docker-compose"
else
    print_error "Docker Compose is not available. Please install Docker Compose and try again."
    exit 1
fi

print_status "Using Docker Compose command: $DOCKER_COMPOSE"

# Load environment variables
if [ -f .env.production ]; then
    print_status "Loading production environment variables..."
    export $(cat .env.production | grep -v '^#' | xargs)
else
    print_warning ".env.production not found. Using default values."
fi

# Build and start services
print_status "Building Docker images..."
$DOCKER_COMPOSE build --no-cache

print_status "Starting services..."
$DOCKER_COMPOSE up -d

# Wait for services to be healthy
print_status "Waiting for services to be ready..."
sleep 10

# Check service health
services=("wangov-api" "wangov-superadmin" "wangov-admin" "wangov-organization" "wangov-citizen" "wangov-db" "wangov-redis")

for service in "${services[@]}"; do
    if $DOCKER_COMPOSE ps | grep -q "$service.*running"; then
        print_success "$service is running"
    else
        print_error "$service failed to start"
        $DOCKER_COMPOSE logs "$service"
        exit 1
    fi
done

# Run database migrations
print_status "Running database migrations..."
$DOCKER_COMPOSE exec wangov-api npm run prisma:migrate:deploy

# Seed database with demo accounts
print_status "Seeding database with demo accounts..."
$DOCKER_COMPOSE exec wangov-api npm run seed

print_success "🎉 WanGov-ID deployment completed successfully!"
echo ""
echo "Services are now available at:"
echo "  🔧 API Server:          http://localhost:3000"
echo "  👑 SuperAdmin Portal:   http://localhost:3001"
echo "  🛡️  Admin Portal:        http://localhost:3002"
echo "  🏢 Organization Portal: http://localhost:3003"
echo "  👤 Citizen Portal:      http://localhost:3004"
echo ""
echo "Demo Accounts:"
echo "  SuperAdmin: superadmin@example.com / password123"
echo "  Admin:      admin@example.com / password123"
echo "  Organization: org@example.com / password123"
echo "  Citizen:    citizen@example.com / password123"
echo ""
echo "To stop all services: $DOCKER_COMPOSE down"
echo "To view logs: $DOCKER_COMPOSE logs -f [service-name]"
