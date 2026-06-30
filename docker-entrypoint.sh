#!/bin/sh
# Container startup script for the app service.
#
# Runs every time the app container starts:
# 1. Apply committed SQL migrations to the database
# 2. Insert sample users (idempotent seed)
# 3. Start the Next.js dev server
set -e

# Create/update tables from prisma/migrations/*
npx prisma migrate deploy

# Insert demo data from prisma/seed.js
npx prisma db seed

# Replace this shell process with Next.js dev server
exec npm run dev
