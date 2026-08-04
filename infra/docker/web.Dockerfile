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
# Stage 2 - Production
# ----------------------------
FROM node:24-alpine AS production

WORKDIR /app

# Copy built frontend
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

# Expose HTTP port
EXPOSE 3000

# Default command
CMD ["node", "./apps/web/server.js"]