FROM node:24-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends git sudo ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && echo "node ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/node \
    && chmod 0440 /etc/sudoers.d/node

USER node
