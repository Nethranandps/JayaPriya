# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Deployment (Render + GitHub Actions + UptimeRobot)

The site is a static Vite build hosted on Render. Deploys are gated by CI.

**Flow on every push to `main`:**

1. GitHub Actions (`.github/workflows/ci.yml`) runs `npm ci`, `npm run lint`, `npm run build`.
2. If that passes, it calls the Render deploy hook, waits for Render to report the deploy live, then checks `/healthz`.
3. Pull requests only run the lint and build job. Render also builds a preview for each PR.

**One-time setup on Render:**

1. Render dashboard → New → Blueprint → pick this repo. Render reads `render.yaml` and creates the static site.
2. Open the service → Settings → Deploy Hook → copy the URL.
3. Copy the Service ID from the URL bar (`srv-...`) and create an API key under Account Settings → API Keys.

**One-time setup on GitHub** (repo → Settings → Secrets and variables → Actions):

| Kind | Name | Value |
|---|---|---|
| Secret | `RENDER_DEPLOY_HOOK_URL` | the deploy hook URL |
| Secret | `RENDER_API_KEY` | Render API key (optional, enables deploy status polling) |
| Secret | `RENDER_SERVICE_ID` | `srv-...` (optional, pairs with the API key) |
| Variable | `SITE_URL` | `https://<your-site>.onrender.com` (no trailing slash) |

**Health check:** `GET /healthz` returns `{"status":"ok","service":"personal-portfolio"}` with `Cache-Control: no-store`. It is served from `public/health.json` through a rewrite in `render.yaml`.

**UptimeRobot:** New Monitor → type *HTTP(s) – Keyword* → URL `https://<your-site>.onrender.com/healthz` → keyword `"ok"` → alert when keyword *not* found → interval 5 minutes.
