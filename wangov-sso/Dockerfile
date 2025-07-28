# Memory-optimized Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Set NODE_OPTIONS to limit memory usage
ENV NODE_OPTIONS="--max-old-space-size=512"
ENV NODE_ENV=production

# Install system dependencies - keep minimal
RUN apk add --no-cache \
    curl \
    postgresql-client

# Copy package files
COPY package*.json ./

# Install dependencies with memory optimizations
# Replacing npm ci with npm install to use less memory
RUN npm install --no-optional --production --no-audit --no-fund

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S wangov && \
    adduser -S wangov -u 1001 -G wangov

# Change ownership of app directory
RUN chown -R wangov:wangov /app

# Switch to non-root user
USER wangov

# Expose port
EXPOSE 3004

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3004/health || exit 1

# Start the application
CMD ["node", "server.js"]
