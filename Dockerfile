# ---- Dependencies stage ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ---- Builder stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Copy node_modules from deps
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build-time environment variables for Next.js
ARG NEXT_PUBLIC_PAYPAL_CLIENT_ID
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS
ARG NEXT_PUBLIC_NEWWAVE_API_URL

# Expose them to Next.js build
ENV NEXT_PUBLIC_PAYPAL_CLIENT_ID=$NEXT_PUBLIC_PAYPAL_CLIENT_ID
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS
ENV NEXT_PUBLIC_NEWWAVE_API_URL=$NEXT_PUBLIC_NEWWAVE_API_URL
ENV NEXT_PUBLIC_BASE_PATH=""

# Debug build-time envs (optional)
RUN echo "DEBUG: PayPal=$NEXT_PUBLIC_PAYPAL_CLIENT_ID" && \
    echo "DEBUG: Stripe=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS" && \
    echo "DEBUG: API=$NEXT_PUBLIC_NEWWAVE_API_URL"

# Build Next.js app
RUN npm run build

# ---- Runner stage (production) ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install only production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy build artifacts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npx", "next", "start", "-p", "3000"]
