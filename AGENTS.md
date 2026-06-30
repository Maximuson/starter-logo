# starter-logo

A minimal single-page Next.js 11 (React 17) front-end app. Clicking the "New App" heading adds animated "comet" dots. There is no backend, database, or test suite.

## Cursor Cloud specific instructions

- Runtime caveat: this repo uses Next.js 11 with webpack 5, which is incompatible with the OpenSSL 3 default in modern Node (the VM has Node 22). All `next` commands must run with `NODE_OPTIONS=--openssl-legacy-provider`, e.g. `NODE_OPTIONS=--openssl-legacy-provider npm run dev`. Without it you get `ERR_OSSL_EVP_UNSUPPORTED`.
- Dev server: `NODE_OPTIONS=--openssl-legacy-provider npm run dev` serves on http://localhost:3000 (binds 0.0.0.0). `npm run build` / `npm start` need the same env var.
- `npm run lint` (`next lint`) is unconfigured here; the first run launches an interactive ESLint setup prompt and will hang in a non-interactive shell. Lint is optional dev tooling and is not required to run the app.
- No automated tests exist in this repo.
- No lockfile is committed (`package-lock.json` is gitignored), so `npm install` resolves fresh transitive versions each time.
