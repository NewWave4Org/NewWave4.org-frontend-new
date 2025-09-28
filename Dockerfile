# Stage 1 — build the app (prod deps only so lint/typecheck are skipped)
FROM node:20-alpine AS builder
WORKDIR /app

# Copy only the files needed to install deps first (better layer caching)
COPY package.json package-lock.json* ./
# Install prod deps only → eslint/typescript won’t run during build
RUN npm ci --omit=dev

# Now copy the rest and build
COPY . .

ARG NEXT_PUBLIC_PAYPAL_CLIENT_ID
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS
ARG NEXT_PUBLIC_NEWWAVE_API_URL

ENV NODE_ENV=production \
    NEXT_PUBLIC_BASE_PATH="" \
    NEXT_PUBLIC_PAYPAL_CLIENT_ID=${NEXT_PUBLIC_PAYPAL_CLIENT_ID} \
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS=${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS} \
    NEXT_PUBLIC_NEWWAVE_API_URL=${NEXT_PUBLIC_NEWWAVE_API_URL}

RUN npm run build

# Stage 2 — run with Node (Next.js production server)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy the minimal runtime artifacts
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
# If you have next.config.*, keep it (not strictly required for runtime)
# COPY --from=builder /app/next.config.* ./

EXPOSE 3000
CMD ["npx", "next", "start", "-p", "3000"]
