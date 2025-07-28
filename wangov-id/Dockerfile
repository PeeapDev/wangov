# Memory-optimized Dockerfile for Railway deployment
FROM node:18-alpine

WORKDIR /app

# Set NODE_OPTIONS to limit memory usage
ENV NODE_OPTIONS="--max-old-space-size=512"

# Install dependencies with memory optimizations
COPY package*.json ./
RUN npm install --no-optional --production --no-audit --no-fund

# Copy source code
COPY . .

# Build the application with reduced memory usage
ENV GENERATE_SOURCEMAP=false
RUN npm run build

EXPOSE 3000

# Start with reduced memory footprint
CMD ["node", "dist/server.js"]
