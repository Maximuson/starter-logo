# Docker image for the Next.js app container.
#
# Compose builds this image for the `app` service.
# The dev server binds to 0.0.0.0 so port 3000 is reachable outside the container.

FROM node:24-bookworm-slim

WORKDIR /app

# Install dependencies first for better Docker layer caching.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
