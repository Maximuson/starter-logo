FROM node:24-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        git sudo ca-certificates curl \
        docker.io docker-compose-plugin \
        fuse-overlayfs iptables \
    && rm -rf /var/lib/apt/lists/* \
    && echo "node ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/node \
    && chmod 0440 /etc/sudoers.d/node \
    && mkdir -p /etc/docker \
    && printf '%s\n' '{"storage-driver": "fuse-overlayfs"}' > /etc/docker/daemon.json \
    && update-alternatives --set iptables /usr/sbin/iptables-legacy 2>/dev/null || true

USER node
