# starter-logo

A minimal single-page Next.js (React) front-end app. Clicking the "New App" heading adds animated "comet" dots. There is no backend, database, or test suite.

## Cursor Cloud specific instructions

- Stack: Next.js 16 (Turbopack) + React 19, styled with Sass/Bootstrap. The VM's Node 22 works out of the box — no `NODE_OPTIONS=--openssl-legacy-provider` is needed (that was only required by the old Next.js 11 setup).
- Dev server: `npm run dev` serves on http://localhost:3000 (binds 0.0.0.0). `npm run build` then `npm start` use the same command set.
- `npm run lint` is broken: the script runs `next lint`, which was removed in Next.js 16, so it errors with `Invalid project directory provided, no such directory: /workspace/lint`. Lint is not wired up; to lint you'd need to invoke ESLint directly. This does not affect running or building the app.
- No automated tests exist in this repo.
- No lockfile is committed (`package-lock.json` is gitignored), so `npm install` resolves fresh transitive versions each time.
