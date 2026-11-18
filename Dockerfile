
# Etapa 1: Instalar dependencias
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

# Etapa 2: Imagen de ejecucion
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules

COPY --chown=node:node package.json app.js server.js ./

USER node

EXPOSE 3000

CMD ["node", "server.js"]
