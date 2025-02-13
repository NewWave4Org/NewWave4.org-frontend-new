FROM node:20-alpine AS base

LABEL authors="volodymyrrozdolsky"

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM nginx:1.27-alpine AS production

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=base /usr/src/app/out ./

EXPOSE 80


CMD ["nginx", "-g", "daemon off;"]
