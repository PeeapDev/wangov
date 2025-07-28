# Memory-optimized Dockerfile for Railway deployment
FROM node:18-alpine

WORKDIR /app

# Set NODE_OPTIONS to limit memory usage
ENV NODE_OPTIONS="--max-old-space-size=512"
ENV NODE_ENV=production

# Install dependencies with memory optimizations
COPY package*.json ./
RUN npm install --no-optional --production --no-audit --no-fund

# Copy source code
COPY . .

EXPOSE 3000

# Start with minimal memory footprint
CMD ["node", "server.js"]
