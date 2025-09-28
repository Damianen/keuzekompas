# Multi-stage build for React app
# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Expose the port the app runs on
EXPOSE 3000

CMD ["pnpm", "run", "start"]