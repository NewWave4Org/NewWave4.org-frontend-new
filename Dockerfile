FROM node:26-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --verbose

# ---- builder ----
FROM node:26-alpine AS builder
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
FROM node:26-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# `output: 'standalone'` (next.config.ts) traces only the dependencies the
# server actually needs and copies them into .next/standalone, including a
# pruned node_modules — no separate `npm ci` required in this stage.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env .env

# Next's standalone file tracer doesn't bundle sharp@0.35.x's native libvips
# binary correctly (confirmed: present after a plain `npm ci` in the deps
# stage, missing from .next/standalone's copy) -- images.unoptimized: true
# means sharp is never actually invoked at runtime today, but overlaying the
# full @img packages here keeps the binary available if that ever changes.
COPY --from=builder /app/node_modules/@img ./node_modules/@img

EXPOSE 3000
CMD ["node", "server.js"]
