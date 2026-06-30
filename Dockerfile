FROM node:24-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npx prisma generate

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
