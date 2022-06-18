ARG NODE_IMAGE=node:16-alpine
ARG APP=api
FROM $NODE_IMAGE AS base
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY . .
RUN npm install -g pnpm @nestjs/cli
RUN pnpm install

FROM base AS build-api
RUN pnpm run build
COPY dist/apps/taro-api ./build_dist

FROM base AS build-admin
RUN pnpm run build:admin
COPY dist/apps/taro-admin ./build_dist

FROM build-${APP} as builder
RUN pnpm prune --prod


FROM $NODE_IMAGE AS production
WORKDIR /app
COPY --from=builder /app/build_dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node","dist/main"]