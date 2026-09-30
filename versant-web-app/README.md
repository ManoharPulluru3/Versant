# Versant web app (admin portal + current UI demo)

English assessment **admin portal** and combined UI demo — Vite + React + Tailwind + React Router.

- **Admin:** `/admin/dashboard` and related routes (`src/admin/`).
- **Student mobile demo:** still in this package (`src/screens/`) until moved to `../versant-mobile-app`.
- **Screen list:** `../docs/SCREEN_INVENTORY.md`.

## Run locally

```bash
npm install
npm run dev
```

Open the app, then use the top-right **App | Workflow** toggle for the customer journey map. From Workflow you can export the current view (PNG) or full journey (PDF).

## Scripts

- `npm run dev` — local development server
- `npm run build` — production build
- `npm run preview` — preview production build
