FROM node:18-alpine as builder

WORKDIR /gmail-backup

COPY package.json ./
COPY yarn.lock ./
RUN yarn install --immutable --immutable-cache

COPY . .
RUN yarn run build

FROM node:18-alpine

RUN mkdir -p -m a=rw /data/secrets /data/snapshots
ENV SECRETS_PATH=/data/secrets
ENV SNAPSHOTS_PATH=/data/snapshots

RUN mkdir -m a=rw /oclif_cache
ENV CACHE_DIR=/oclif_cache

WORKDIR /gmail-backup

COPY package.json ./
COPY yarn.lock ./
RUN yarn install --immutable --immutable-cache --prod

COPY --from=builder /gmail-backup/dist ./dist
COPY --from=builder /gmail-backup/bin/run ./bin/

RUN npm link

CMD [ "gmail-backup", "snapshot", "create" ]
