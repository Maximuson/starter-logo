# Docker image for the Next.js app container.
#
# This is NOT the Cursor Cloud Agent VM image.
# Compose builds this image for the `app` service.
#
# Build flow:
# 1. Install npm dependencies
# 2. Copy project files
# 3. Generate Prisma client from prisma/schema.prisma
# 4. Run docker-entrypoint.sh (migrate, seed, next dev)

FROM node:24-bookworm-slim

WORKDIR /app

# Install dependencies first for better Docker layer caching.
COPY package.json package-lock.json ./
# Skip postinstall here because prisma/schema.prisma is copied in the next step.
RUN npm ci --ignore-scripts

COPY . .
# Create the typed Prisma client used by lib/prisma.js
RUN npx prisma generate

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
