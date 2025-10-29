FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./

RUN npm ci

# ---- builder ----
FROM node:20-alpine AS builder
WORKDIR /app

# Copy node_modules with dev deps available for the build
COPY --from=deps /app/node_modules ./node_modules
# Copy source
COPY . .

# Copy .env from root
COPY .env .env

# Build (lint/type checks should be ignored in next.config.*)
RUN npm run build

# ---- runner (prod) ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install ONLY prod deps for a slim runtime
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force

# Bring in build artifacts and .env
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env .env

EXPOSE 3000
CMD ["npx", "next", "start", "-p", "3000"]
