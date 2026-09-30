# Versant API

Node.js API for the listening module: student sign-in, practice, tests, scores, and the admin portal.

## Setup

```bash
cd versant-api
npm install
cp .env.example .env
npm run seed
npm run dev
```

Default base URL: `http://localhost:4000`

Data is stored in MongoDB. Set `MONGODB_URI` and `MONGODB_DB` in `.env` (the database name defaults to `versant`). `npm run seed` replaces that database with the sample college.

## Sample accounts

| Role | Sign in | Password |
|------|---------|----------|
| Admin | `admin@elytedu.com` | `Admin@123` |
| Student | `EW20260421` or `emma.wilson@college.edu` | `Student@123` |
| Student | `AR20260488` | `Student@123` |

## Main routes

- `POST /api/v1/auth/login` — student ID or email, plus password
- `POST /api/v1/auth/admin/login` — admin email and password
- `GET /api/v1/home`, `/tests`, `/progress`, `/notifications`, `/practice/listening`
- `POST /api/v1/practice/listening/:id/attempts`
- `POST /api/v1/tests/:id/attempts`
- `PATCH /api/v1/me` and `POST /api/v1/me/password`
- `GET|POST|PUT|DELETE /api/v1/admin/...` — students, activities, tests, results, settings

Correct answers are stored on the server. The student app receives them only after an attempt is submitted.
