#!/usr/bin/env bash
set -euo pipefail

if [ ! -f .env ] && [ -f .env.example ]; then
  cp .env.example .env
fi

if command -v docker >/dev/null 2>&1; then
  exit 0
fi

sudo apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
  docker.io docker-compose-plugin
