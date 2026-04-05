# ----------------------------
# Stage 1 - Builder
# ----------------------------
FROM node:24-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

ENV CI=true

# Copy only dependency files first (better caching)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/

# Install dependencies
RUN pnpm install

# Copy source AFTER install (cache optimization)
COPY . .

# Build API
RUN pnpm --filter api build

# Generate Prisma client
# RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN pnpm --filter api exec prisma generate

# ----------------------------
# Stage 2 - Production
# ----------------------------
FROM node:24-alpine AS production

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

ENV NODE_ENV=production

# Copy dependency files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/

# Install ONLY production deps for API
RUN pnpm install --filter api --prod --frozen-lockfile

# Copy built app + prisma + generated client
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/node_modules ./node_modules

WORKDIR /app/apps/api

EXPOSE 4000

CMD ["node", "dist/main.js"]