# ----------------------------
# Stage 1 - Builder
# ----------------------------
FROM node:24-alpine AS builder
WORKDIR /app

# Enable Corepack and activate pnpm v11
RUN corepack enable
RUN corepack prepare pnpm@11.1.2 --activate

# Copy workspace manifest files first to maximize Docker layer cache usage
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy only the API package manifest first
# This improves dependency install cache reuse when source files change
COPY apps/api ./apps/api

# Install dependencies using the lockfile for reproducible builds
RUN pnpm install --frozen-lockfile

# Build the API and generate production assets
RUN pnpm --filter api build
RUN pnpm --filter api exec prisma generate
RUN pnpm --filter api deploy --prod /app/out

# ----------------------------
# Stage 2 - Production
# ----------------------------
FROM node:24-alpine AS production
WORKDIR /app

# Enable Corepack and activate pnpm v11
RUN corepack enable && corepack prepare pnpm@11.1.2 --activate

ENV NODE_ENV=production

# Copy only the built application output
COPY --from=builder /app/out .

# Start the application
CMD ["node", "dist/main.js"]
