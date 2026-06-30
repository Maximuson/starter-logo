# starter-logo

A Next.js (React) app with **Docker Compose**, **PostgreSQL**, and **Prisma**. Clicking the "New App" heading adds animated comet dots. The home page also loads **users from the database** as a backend example.

For full documentation (concepts, Prisma workflow, troubleshooting), see [README.md](README.md).

## Cursor Cloud specific instructions

### Boot behavior (automatic)

On a new Cloud Agent session, Cursor runs `.cursor/environment.json`:

1. **`install`** — `bash .cursor/install.sh` (creates `.env`, installs Docker once, cached in snapshot)
2. **`start`** — `sudo service docker start && sudo docker compose up -d --build`
3. **Port 3000** is forwarded to you

You usually **do not** need to ask the agent to run `npm run up` — it should already be running. If containers are down, run:

```bash
npm run up
```

### Stack

- **Next.js 16** (Turbopack) + **React 19**, styled with **Tailwind CSS 4**
- **Node 24** inside the app Docker image (`Dockerfile`)
- **PostgreSQL 16** + **Prisma 6** for the database example
- Dependencies install inside the **app container** during `docker compose build` — no host `npm ci` required

### Key commands

| Command | Purpose |
|---------|---------|
| `npm run up` | Start app + Postgres (`docker compose up -d`) |
| `npm run down` | Stop all containers |
| `npm run logs` | Follow container logs |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:seed` | Insert demo users (Alice, Bob, Carol) |
| `npm run db:setup` | Migrate + seed |

On container start, `docker-entrypoint.sh` automatically runs **migrate + seed + next dev**.

### Environment variables

- Defaults live in **`.env.example`** (committed)
- Runtime file **`.env`** is gitignored and auto-created from `.env.example` on first boot
- Inside Docker, `DATABASE_URL` must use host **`db`** (the Compose service name), not `localhost`
- Override secrets (e.g. remote `DATABASE_URL`) via [Cursor Secrets](https://cursor.com/dashboard/cloud-agents)

### Verifying the app

1. Open **http://localhost:3000**
2. Comet animation should work on "New App" click
3. Below the logo, **"Users from database"** should list Alice, Bob, Carol

If users are missing:

```bash
npm run db:setup
# or restart containers
npm run down && npm run up
```

### Lint and tests

- `npm run lint` is broken: the script runs `next lint`, which was removed in Next.js 16, so it errors with `Invalid project directory provided, no such directory: /workspace/lint`. Lint is not wired up; invoke ESLint directly if needed.
- No automated tests exist in this repo.

### Docker notes for Cloud Agents

- The VM uses **Ubuntu**; Docker is installed by `.cursor/install.sh` (`docker.io` + `docker-compose-v2`).
- Use **`sudo docker compose`** if permission errors occur on the Docker socket.
- If `docker compose build` fails with overlay filesystem errors, configure the daemon storage driver:

```bash
echo '{"storage-driver": "vfs"}' | sudo tee /etc/docker/daemon.json
sudo systemctl restart docker || sudo dockerd &
```

- If the app container cannot reach `db:5432`, check `sudo docker compose ps` and `npm run logs`. Restart with `npm run up`.

### What to change where

| Task | Where |
|------|-------|
| Add/edit database models | `prisma/schema.prisma` + new migration |
| Demo/seed data | `prisma/seed.js` |
| DB access in pages | `lib/prisma.js`, `getServerSideProps` in `pages/` |
| Compose services / ports | `docker-compose.yml`, `.env.example` |
| Cloud boot config | `.cursor/environment.json`, `.cursor/install.sh` |

### Do not

- Rely on host `node_modules` for the running app — the app runs in Docker
- Put real secrets in committed `.env` files — use Cursor Secrets for cloud overrides
- Expect Postgres data to persist across unrelated Cloud Agent sessions — use a remote DB for durable data
