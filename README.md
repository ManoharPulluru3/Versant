# Versant / ElytEdu — Monorepo

| Folder | Purpose |
|--------|---------|
| [`versant-web-app/`](versant-web-app/) | Admin portal + Vite student UI demo |
| [`versant-mobile-app/`](versant-mobile-app/) | **React Native CLI** student app |
| [`versant-api/`](versant-api/) | **Node.js (Express)** API |

Screen map: [`docs/SCREEN_INVENTORY.md`](docs/SCREEN_INVENTORY.md)

## Quick start

### Web demo (admin + phone-framed student UI)

```bash
cd versant-web-app
npm install
npm run dev
```

- Admin: `/admin/dashboard`
- Student demo: `/login`, `/home`

### API

```bash
cd versant-api
npm install
cp .env.example .env
npm run dev
```

→ [http://localhost:4000/health](http://localhost:4000/health)

The API is the listening module: student login, practice, tests, scores, and admin editing. Sample sign-in is in [`versant-api/README.md`](versant-api/README.md).

- Admin site: `http://localhost:5173/admin/login` — `admin@elytedu.com` / `Admin@123`
- Student app: `EW20260421` / `Student@123`

### React Native app (ElytEdu-style workflow)

Full guide: **[`versant-mobile-app/README.md`](versant-mobile-app/README.md)**

```bash
cd "/home/manohar/Documents/My Projects/Versant App"
bash scripts/setup-android-tools.sh    # once: link .tools from ElytEdu platform repo
source scripts/android-dev-env.sh      # every terminal

cd versant-mobile-app
npm install
npm run start:reset                    # terminal 1
npm run android                        # terminal 2
```
