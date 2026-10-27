# VISION

**See opportunity. Find your future.**

Uganda-first employment platform from Altrastate Technologies Ltd. Next.js + Supabase modular monolith.

Phase 2 adds working authentication, seeker profiles, and public job/company discovery on the Phase 1 foundation. Employer recruitment workflows remain Phase 3.

## Stack

- Next.js App Router, TypeScript (strict), Tailwind CSS
- Supabase PostgreSQL, Auth, Storage
- Vitest, Playwright, ESLint, GitHub Actions

## Quick start

```bash
pnpm install
cp .env.example .env.local
supabase start
pnpm dev
```

Fill `.env.local` with the URL and keys printed by `supabase start`. Apply both migrations if you use a hosted project instead of local Supabase.

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
pnpm test:db   # requires local Supabase
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Database](docs/DATABASE.md)
- [Security](docs/SECURITY.md)
- [Phase 2 implementation](docs/PHASE-2-IMPLEMENTATION.md)
- [Phase roadmap](docs/PHASE-ROADMAP.md)
- [Deployment](docs/DEPLOYMENT.md)
