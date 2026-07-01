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

### Lint, tests, and builds

- `npm run lint` is broken: the script runs `next lint`, which was removed in Next.js 16, so it errors with `Invalid project directory provided, no such directory: /workspace/lint`. Lint is not wired up; invoke ESLint directly if needed.
- No automated tests exist in this repo.
- **`npm run build`** — SSR production build (`getServerSideProps`, live DB). Strips `// GithubOnly` blocks before build and restores after.
- **`npm run build:github-pages`** — static export for GitHub Pages (`getStaticProps`, no DB). Used by CI on push to `main`.
- **Vercel production** — `.github/workflows/vercel.yml` on push to `main`. SSR build with `getServerSideProps` + remote `DATABASE_URL`. Docker Compose is **not** used on Vercel. See [README — Vercel production deployment](README.md#vercel-production-deployment).

### GitHub Pages data loading (`// GithubOnly`)

Next.js allows **one data export per page**: `getServerSideProps` **or** `getStaticProps`, not both.

This repo uses **Pattern A** in `pages/index.js`:

```js
// GithubOnly
async function getGithubStaticPageProps() { ... }  // helper, not exported

export async function getServerSideProps() { ... } // only active export in dev
```

| Command | Active export | `getGithubStaticPageProps` |
|---------|---------------|----------------------------|
| `next dev` / Docker | `getServerSideProps` | Present but unused |
| `npm run build` | `getServerSideProps` | Stripped by `scripts/strip-github-only.js` |
| `npm run build:github-pages` | `getStaticProps` (auto-added) | Used by `getStaticProps` |

Scripts:

- `scripts/strip-github-only.js` + `scripts/restore-github-only.js` — normal build
- `scripts/github-pages/prepare-build.js` — removes `getServerSideProps`, adds `getStaticProps` from the `// GithubOnly` helper

Do **not** export `getStaticProps` in page files for daily dev. Full explanation: [README.md — GitHub Pages vs server-side rendering](README.md#github-pages-vs-server-side-rendering).

**First-time deploy:** enable Pages in repo **Settings → Pages → Source: GitHub Actions** before deploy will work. See [README troubleshooting](README.md#github-pages-deploy-fails-with-404--ensure-github-pages-has-been-enabled).

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
| GitHub Pages static export | `// GithubOnly` helper + `scripts/github-pages/prepare-build.js` |
| Vercel production deploy | `vercel.json`, `package.json` (`engines`, `build:vercel`), `.github/workflows/vercel.yml`, `DATABASE_URL` in Vercel |
| Compose services / ports | `docker-compose.yml`, `.env.example` |
| Cloud boot config | `.cursor/environment.json`, `.cursor/install.sh` |

### Do not

- Rely on host `node_modules` for the running app — the app runs in Docker
- Put real secrets in committed `.env` files — use Cursor Secrets for cloud overrides
- Expect Postgres data to persist across unrelated Cloud Agent sessions — use a remote DB for durable data
