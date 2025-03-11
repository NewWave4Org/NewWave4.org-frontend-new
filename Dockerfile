# Stage 1: Build the Next.js static export
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

ENV NODE_ENV=production
ENV NEXT_PUBLIC_BASE_PATH=""

RUN npm run build

# Stage 2: Serve the exported files with Nginx
FROM nginx:alpine

COPY --from=builder /app/out /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
