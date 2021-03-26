FROM node:14-slim as pre-build
COPY package*.json ./
RUN npm version 0.0.1

FROM node:14-slim

WORKDIR /app/

COPY --from=pre-build package*.json ./

RUN npm install --production

COPY dist ./

CMD ["node", "app.js"]
