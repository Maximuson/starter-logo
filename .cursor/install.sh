#!/usr/bin/env bash
# Cursor Cloud Agent install script.
#
# Runs once when the cloud environment boots (then cached in a snapshot).
# It should be idempotent: safe to run multiple times.
set -euo pipefail

# Docker Compose expects a `.env` file. Create it from defaults if missing.
if [ ! -f .env ] && [ -f .env.example ]; then
  cp .env.example .env
fi

# Docker is only installed on first boot.
if command -v docker >/dev/null 2>&1; then
  exit 0
fi

sudo apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
  docker.io docker-compose-v2
