# Versant mobile app (student)

Dedicated home for the **student** English assessment experience (practice, tests, live tasks, results).

## Current status

UI is implemented today inside **`../versant-web-app`** as a phone-framed Vite demo:

- Routes: see `../docs/SCREEN_INVENTORY.md` (Student mobile app).
- Components: `versant-web-app/src/screens/`, `MobileShell`, `BottomNav`.
- Prototypes: `versant-web-app/html-files/` (non-`admin*` files).

Next step: scaffold a real mobile client here (e.g. React Native + Expo) and point it at a shared API once `versant-web-app` (or a new `versant-api`) backend exists.

## Run the demo (until migration)

```bash
cd ../versant-web-app
npm run dev
```

Open `/login` or `/home` — not `/admin/*`.
