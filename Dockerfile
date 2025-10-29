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

# Public runtime envs for your app code
ARG NEXT_PUBLIC_PAYPAL_CLIENT_ID
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS
ARG NEXT_PUBLIC_NEWWAVE_API_URL
ENV NEXT_PUBLIC_BASE_PATH=""
# ENV NEXT_PUBLIC_PAYPAL_CLIENT_ID=${NEXT_PUBLIC_PAYPAL_CLIENT_ID}
# ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS=${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS}
# ENV NEXT_PUBLIC_NEWWAVE_API_URL=${NEXT_PUBLIC_NEWWAVE_API_URL}
ENV NEXT_PUBLIC_PAYPAL_CLIENT_ID='AcYMVKpTFomZEjyd0_gSRoGC6zvAfx3oY6edYgxb4cX39I4CGUeEQhBelMyqkNUstm87W4uIQxheNtad'
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS='pk_test_51RaG5lBHy8UoqeVFEuWPYeskQWj0ST4plObwRJnZjeYytQFn04A8ioKqkzdFhXtya5mLi60NA3rfoScEE3p8Yrpw00YtQuj53w'
ENV NEXT_PUBLIC_NEWWAVE_API_URL='https://api.stage.newwave4.org'


# To debug 
RUN echo "DEBUG: PayPal=$NEXT_PUBLIC_PAYPAL_CLIENT_ID" && \
    echo "DEBUG: Stripe=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS" && \
    echo "DEBUG: API=$NEXT_PUBLIC_NEWWAVE_API_URL"

# Build (lint/type checks should be ignored in next.config.*)
RUN npm run build

# ---- runner (prod) ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install ONLY prod deps for a slim runtime
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force

# Bring in build artifacts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npx", "next", "start", "-p", "3000"]
