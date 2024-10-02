FROM node:21 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:21

WORKDIR /app

COPY --from=builder /app .
COPY --from=builder /app/.env .

EXPOSE 3000

CMD ["npm", "start"]
