# Memory-optimized Dockerfile for Railway deployment
FROM node:18-alpine AS builder

WORKDIR /app

# Copy only package files first for better caching
COPY package*.json ./

# Use npm install instead of npm ci (less memory intensive)
# Add --no-optional to reduce memory usage
RUN npm install --no-optional --no-audit --no-fund

# Copy source code
COPY . .

# Build the application with reduced memory usage
ENV NODE_OPTIONS="--max-old-space-size=512"
ENV GENERATE_SOURCEMAP=false

# Build the application
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx config if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
