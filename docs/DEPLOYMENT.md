# VISION deployment

## Local development

1. Copy `.env.example` to `.env.local`.
2. Start Docker Desktop.
3. Run `supabase start` and copy the printed project URL, publishable key, and secret key into `.env.local`.
4. Run `pnpm install` then `pnpm dev`.
5. Open `http://localhost:3000`.

`supabase start` applies versioned migrations. `supabase db reset` reapplies migrations and `supabase/seed.sql`. Do not run reset against a hosted production project.

## Environment variables

| Name | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | public | Canonical app URL |
| `NEXT_PUBLIC_SUPABASE_URL` | public | Supabase API URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | public | Low-privilege key |
| `SUPABASE_SECRET_KEY` | server | Bypasses RLS; Vercel secret |

Never commit `.env.local`. GitHub Actions uses placeholder public values only so `next build` can compile.

## GitHub

Quality workflow: `.github/workflows/ci.yml` (lint, typecheck, unit tests, production build, Chromium Playwright).

Apply both foundation and Phase 2 migrations before pointing the app at a hosted project. Then set Auth Site URL and redirect allow-list entries documented in `docs/PHASE-2-IMPLEMENTATION.md`. Email templates and SMTP/Supabase email must be configured before confirmation or recovery mail can be considered working.

Suggested branch flow: `main` is protected; work on feature branches; open pull requests; require CI before merge.

This repository is local until a dedicated GitHub remote is added. `gh` was not available in the Phase One environment, so no GitHub repository was created automatically.

## Vercel

The app is a standard Next.js project and is Vercel-compatible. Deployment was **not** performed in Phase One because Vercel credentials for a VISION project were not available.

When deploying:

1. Create a dedicated VISION Vercel project (not reused from another product).
2. Set the environment variables above for Production and Preview.
3. Connect the GitHub repository.
4. Deploy from `main`.
5. Confirm `https://<host>/api/health` returns `{ "ok": true }`.

Rollback: revert the Git commit on `main` and redeploy. Database rollback is a forward migration, not `reset`, on hosted projects.

## Supabase projects

Use separate development and production Supabase projects. Apply the same migration files to each. Do not point this application at an unrelated existing project.
