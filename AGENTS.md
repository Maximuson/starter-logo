# starter-logo

A minimal single-page Next.js (React) front-end app. Clicking the "New App" heading adds animated "comet" dots. There is no backend, database, or test suite.

## Cursor Cloud specific instructions

- Stack: Next.js 16 (Turbopack) + React 19, styled with Sass/Bootstrap. Verified on Node 24 (`nvm install 24 && nvm alias default 24`). No `NODE_OPTIONS=--openssl-legacy-provider` is needed.
- Node selection caveat: the VM ships a default `node` at `/exec-daemon/node` that takes PATH priority and may be an older v22 binary. To actually run on Node 24, load nvm and prepend its bin, e.g. `export PATH="$HOME/.nvm/versions/node/v24.18.0/bin:$PATH"`. The app also builds/runs fine on v22, so this only matters if you specifically need v24.
- Dev server: `npm run dev` serves on http://localhost:3000 (binds 0.0.0.0). `npm run build` then `npm start` use the same command set.
- `npm run lint` is broken: the script runs `next lint`, which was removed in Next.js 16, so it errors with `Invalid project directory provided, no such directory: /workspace/lint`. Lint is not wired up; to lint you'd need to invoke ESLint directly. This does not affect running or building the app.
- No automated tests exist in this repo.
- `package-lock.json` is committed, so prefer `npm ci` for reproducible installs (CI uses `npm ci` with `actions/setup-node` npm caching).
