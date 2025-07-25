#!/bin/bash

# WanGov-ID Docker Registry Deployment Script
# This script builds and pushes images to Docker registry

set -e

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

# Configuration
REGISTRY=${DOCKER_REGISTRY:-"ghcr.io/peeapdev"}
VERSION=${VERSION:-"latest"}
PROJECT_NAME="wangov"

echo "🐳 Starting WanGov-ID Docker Registry Deployment..."
echo "Registry: $REGISTRY"
echo "Version: $VERSION"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Login to registry (if needed)
if [[ $REGISTRY == ghcr.io* ]]; then
    print_status "Logging into GitHub Container Registry..."
    echo $GITHUB_TOKEN | docker login ghcr.io -u $GITHUB_USERNAME --password-stdin
elif [[ $REGISTRY == *docker.io* ]] || [[ $REGISTRY == docker.io* ]]; then
    print_status "Logging into Docker Hub..."
    echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
else
    print_warning "Unknown registry type. Make sure you're logged in manually."
fi

# Build and tag images
print_status "Building backend API image..."
docker build -t $REGISTRY/$PROJECT_NAME-api:$VERSION .

print_status "Building frontend images for each role..."

# SuperAdmin frontend
docker build -f Dockerfile.frontend --build-arg ROLE=superadmin \
    -t $REGISTRY/$PROJECT_NAME-superadmin:$VERSION .

# Admin frontend
docker build -f Dockerfile.frontend --build-arg ROLE=admin \
    -t $REGISTRY/$PROJECT_NAME-admin:$VERSION .

# Organization frontend
docker build -f Dockerfile.frontend --build-arg ROLE=organization \
    -t $REGISTRY/$PROJECT_NAME-organization:$VERSION .

# Citizen frontend
docker build -f Dockerfile.frontend --build-arg ROLE=citizen \
    -t $REGISTRY/$PROJECT_NAME-citizen:$VERSION .

print_success "All images built successfully!"

# Push images to registry
print_status "Pushing images to registry..."

docker push $REGISTRY/$PROJECT_NAME-api:$VERSION
docker push $REGISTRY/$PROJECT_NAME-superadmin:$VERSION
docker push $REGISTRY/$PROJECT_NAME-admin:$VERSION
docker push $REGISTRY/$PROJECT_NAME-organization:$VERSION
docker push $REGISTRY/$PROJECT_NAME-citizen:$VERSION

print_success "🎉 All images pushed successfully!"

echo ""
echo "Images available at:"
echo "  📦 API:          $REGISTRY/$PROJECT_NAME-api:$VERSION"
echo "  👑 SuperAdmin:   $REGISTRY/$PROJECT_NAME-superadmin:$VERSION"
echo "  🛡️  Admin:        $REGISTRY/$PROJECT_NAME-admin:$VERSION"
echo "  🏢 Organization: $REGISTRY/$PROJECT_NAME-organization:$VERSION"
echo "  👤 Citizen:      $REGISTRY/$PROJECT_NAME-citizen:$VERSION"
echo ""

# Create production docker-compose file
print_status "Creating production docker-compose file..."

cat > docker-compose.prod.yml << EOF
version: '3.8'

services:
  # WanGov-ID: Core Backend API Service
  wangov-api:
    image: $REGISTRY/$PROJECT_NAME-api:$VERSION
    container_name: wangov-api
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=\${DATABASE_URL}
      - JWT_SECRET=\${JWT_SECRET}
      - ADMIN_JWT_SECRET=\${ADMIN_JWT_SECRET}
      - SESSION_SECRET=\${SESSION_SECRET}
    depends_on:
      - wangov-db
      - wangov-redis
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # SuperAdmin Dashboard Service
  wangov-superadmin:
    image: $REGISTRY/$PROJECT_NAME-superadmin:$VERSION
    container_name: wangov-superadmin
    restart: unless-stopped
    ports:
      - "3001:80"
    environment:
      - REACT_APP_API_URL=http://wangov-api:3000/api
      - REACT_APP_ROLE=superadmin
    depends_on:
      - wangov-api

  # Admin Dashboard Service
  wangov-admin:
    image: $REGISTRY/$PROJECT_NAME-admin:$VERSION
    container_name: wangov-admin
    restart: unless-stopped
    ports:
      - "3002:80"
    environment:
      - REACT_APP_API_URL=http://wangov-api:3000/api
      - REACT_APP_ROLE=admin
    depends_on:
      - wangov-api

  # Organization Dashboard Service
  wangov-organization:
    image: $REGISTRY/$PROJECT_NAME-organization:$VERSION
    container_name: wangov-organization
    restart: unless-stopped
    ports:
      - "3003:80"
    environment:
      - REACT_APP_API_URL=http://wangov-api:3000/api
      - REACT_APP_ROLE=organization
    depends_on:
      - wangov-api

  # Citizen Dashboard Service
  wangov-citizen:
    image: $REGISTRY/$PROJECT_NAME-citizen:$VERSION
    container_name: wangov-citizen
    restart: unless-stopped
    ports:
      - "3004:80"
    environment:
      - REACT_APP_API_URL=http://wangov-api:3000/api
      - REACT_APP_ROLE=citizen
    depends_on:
      - wangov-api

  # WanGov-DB: Database Service
  wangov-db:
    image: postgres:14-alpine
    container_name: wangov-db
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=\${POSTGRES_USER:-postgres}
      - POSTGRES_PASSWORD=\${POSTGRES_PASSWORD:-postgres}
      - POSTGRES_DB=\${POSTGRES_DB:-wangovid}
    volumes:
      - wangov_db_data:/var/lib/postgresql/data
      - ./wangov-id/scripts/init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${POSTGRES_USER:-postgres}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # WanGov-Redis: Cache Service
  wangov-redis:
    image: redis:7-alpine
    container_name: wangov-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - wangov_redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  wangov_db_data:
  wangov_redis_data:

networks:
  default:
    name: wangov-network
EOF

print_success "Production docker-compose.prod.yml created!"

echo ""
echo "To deploy in production:"
echo "1. Copy docker-compose.prod.yml to your production server"
echo "2. Set environment variables in .env file"
echo "3. Run: docker-compose -f docker-compose.prod.yml up -d"
echo ""
echo "Environment variables needed:"
echo "  DATABASE_URL=postgresql://user:pass@wangov-db:5432/wangovid"
echo "  JWT_SECRET=your-super-secret-jwt-key"
echo "  ADMIN_JWT_SECRET=your-super-secret-admin-jwt-key"
echo "  SESSION_SECRET=your-super-secret-session-key"
