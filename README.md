This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Build Status

[![CI Build](https://github.com/NewWave4Org/NewWave4.org-frontend-new/actions/workflows/development_deploy.yml/badge.svg)](https://github.com/NewWave4Org/NewWave4.org-frontend-new/actions/workflows/development_deploy.yml)

[![CI Build](https://github.com/NewWave4Org/NewWave4.org-frontend-new/actions/workflows/docker_build.yml/badge.svg)](https://github.com/NewWave4Org/NewWave4.org-frontend-new/actions/workflows/docker_build.yml)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

# Running with Docker

## Build the Docker Image

Run the following command from the project root:

```bash
docker build -t newwave4-app .
```

## Run the Docker Container

Start the container by mapping port 80 on the host to port 80 in the container:

```bash
docker run -d -p 80:80 --name newwave4-app newwave4-app
```

## Verify the Application

Open your browser and navigate to:

```text
http://localhost
```





## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
