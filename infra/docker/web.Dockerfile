# ----------------------------
# Stage 1 - Builder
# ----------------------------
FROM node:24-alpine AS builder

# Set working directory
WORKDIR /app

# Enable Corepack and activate pnpm v11
RUN corepack enable
RUN corepack prepare pnpm@11.1.2 --activate

# Avoid interactive prompts
ENV CI=true

# Copy dependency files first (Docker cache optimization)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy full source code
COPY apps/web ./apps/web

# Build the application
RUN pnpm --filter web build

# ----------------------------
# Stage 2 - Nginx (production)
# ----------------------------
FROM nginx:alpine

# Remove default files (optional)
RUN rm -rf /usr/share/nginx/html/*

# Copy built frontend
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Copy custom nginx configuration (SPA routing)
COPY infra/nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Default command
CMD ["nginx", "-g", "daemon off;"]