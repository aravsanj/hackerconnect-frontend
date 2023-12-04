FROM node:18-alpine AS base

FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

FROM base AS builder

WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

ARG BASE_URL=http://192.168.49.2:31516
ARG ZEGO_APP_ID=1189011683
ARG ZEGO_SERVER_SECRET=6a6cf9108d93dc8b1bba6354585b3459

ENV NEXT_PUBLIC_BASE_URL=$BASE_URL
ENV NEXT_PUBLIC_ZEGO_APP_ID=$ZEGO_APP_ID
ENV NEXT_PUBLIC_ZEGO_SERVER_SECRET=$ZEGO_SERVER_SECRET

RUN npm run build

FROM base AS runner

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/.next/standalone ./
COPY --from=builder /usr/src/app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]