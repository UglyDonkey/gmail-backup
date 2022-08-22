FROM node:18-alpine as builder

WORKDIR /gmail-backup

COPY package.json ./
COPY yarn.lock ./
RUN yarn install --immutable --immutable-cache

COPY . .
RUN yarn run build

FROM node:18-alpine

WORKDIR /gmail-backup

COPY package.json ./
COPY yarn.lock ./
RUN yarn install --immutable --immutable-cache --prod

COPY --from=builder /gmail-backup/dist ./dist
COPY --from=builder /gmail-backup/bin/run ./bin/

RUN npm link

ENV SECRETS_PATH=/data/secrets
ENV SNAPSHOTS_PATH=/data/snapshots

CMD [ "gmail-backup", "snapshot", "create" ]
