FROM node:16-alpine3.15 AS BUILD_IMAGE

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN npm i -g pnpm

COPY . .

# install dependencies
RUN pnpm install

# build application
RUN pnpm run build

# remove development dependencies
RUN pnpm prune --production

FROM node:16-alpine3.15

WORKDIR /usr/src/app

# copy from build image
COPY --from=BUILD_IMAGE /usr/src/app/dist ./dist
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules
RUN  mkdir -p storage

CMD ["node", "dist/main"]