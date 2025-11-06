FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy TypeScript config
COPY tsconfig.json ./

# Copy source
COPY src ./src

# Install dev dependencies for build
RUN npm install -D typescript

# Build TypeScript
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# Expose port
EXPOSE 4000

# Start server
CMD ["node", "dist/index.js"]
