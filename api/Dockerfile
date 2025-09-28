# Use Node.js 20 LTS as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the TypeScript application
RUN pnpm run build

# Expose the port the app runs on
EXPOSE 3000

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeapp -u 1001

# Change ownership of the app directory
RUN chown -R nodeapp:nodejs /app
USER nodeapp

# Start the application
CMD ["pnpm", "start"]