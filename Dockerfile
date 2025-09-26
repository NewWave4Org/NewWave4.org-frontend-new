# Stage 1: Build the Next.js static export
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

ARG NEXT_PUBLIC_PAYPAL_CLIENT_ID
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS
ARG NEXT_PUBLIC_NEWWAVE_API_URL

ENV NODE_ENV=production
ENV NEXT_PUBLIC_BASE_PATH=""
ENV NEXT_PUBLIC_PAYPAL_CLIENT_ID=$NEXT_PUBLIC_PAYPAL_CLIENT_ID
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEYS
ENV NEXT_PUBLIC_NEWWAVE_API_URL=$NEXT_PUBLIC_NEWWAVE_API_URL

RUN npm run build

# Stage 2: Serve the exported files with Nginx
FROM nginx:alpine

COPY --from=builder /app/out /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]