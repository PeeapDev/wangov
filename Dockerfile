# Multi-stage build for WanGov-ID application
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY wangov-id/package*.json ./backend/
COPY wangov-id/frontend/package*.json ./frontend/

# Install dependencies with memory optimizations
ENV NODE_OPTIONS="--max-old-space-size=512"
ENV GENERATE_SOURCEMAP=false
RUN cd backend && npm install --no-optional --production --no-audit --no-fund
RUN cd frontend && npm install --no-optional --production --no-audit --no-fund

# Build frontend with memory optimizations
FROM base AS frontend-builder
WORKDIR /app
ENV NODE_OPTIONS="--max-old-space-size=512"
ENV GENERATE_SOURCEMAP=false
COPY wangov-id/frontend/package*.json ./
RUN npm install --no-optional --production --no-audit --no-fund
COPY wangov-id/frontend/ ./
RUN npm run build

# Build backend with memory optimizations
FROM base AS backend-builder
WORKDIR /app
ENV NODE_OPTIONS="--max-old-space-size=512"
COPY wangov-id/package*.json ./
RUN npm install --no-optional --production --no-audit --no-fund
COPY wangov-id/ ./
RUN npm run build

# Production image
FROM node:18-alpine AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 wangov
RUN adduser --system --uid 1001 wangov

# Copy built application
COPY --from=backend-builder --chown=wangov:wangov /app/dist ./dist
COPY --from=backend-builder --chown=wangov:wangov /app/node_modules ./node_modules
COPY --from=backend-builder --chown=wangov:wangov /app/package.json ./package.json
COPY --from=backend-builder --chown=wangov:wangov /app/prisma ./prisma

# Copy frontend build
COPY --from=frontend-builder --chown=wangov:wangov /app/dist ./public

USER wangov

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]
