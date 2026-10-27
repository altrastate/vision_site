# VISION architecture

VISION is a modular Next.js App Router application with Supabase PostgreSQL and Supabase Auth. Phase One establishes the foundation. It does not implement the full recruitment product.

## System shape

- **Application:** Next.js 16 (App Router) + TypeScript strict mode + Tailwind CSS.
- **Backend:** Supabase PostgreSQL, Auth, and Storage. No separate API microservice.
- **Authorization:** PostgreSQL RLS is the enforcement layer. TypeScript helpers in `src/lib/permissions` and `src/lib/auth` describe the same rules for the UI and server.
- **Clients:** Browser client (`src/lib/supabase/client.ts`), cookie-aware server client (`src/lib/supabase/server.ts`), cookie-free public server client (`src/lib/supabase/public.ts`) for anonymous discovery, privileged admin client (`src/lib/supabase/admin.ts`, `server-only`).

## Module boundaries

| Area | Location | Responsibility |
| --- | --- | --- |
| Routes | `src/app/(public)`, `(auth)`, `(seeker)`, `(employer)`, `admin` | Presentation and routing |
| UI | `src/components/ui`, `layout`, `shared` | Reusable, accessible interface |
| Features | `src/features/*` | Feature-specific UI that is not generic |
| Auth | `src/lib/auth` | Verified identity via `getClaims()` |
| Permissions | `src/lib/permissions` | Role and membership helpers |
| Validation | `src/lib/validation` | Zod schemas used on the server path |
| Supabase | `src/lib/supabase` | Client factories only |
| Types | `src/types/database.ts` | Schema types matching the migration |

Privileged modules import `server-only`. Browser bundles must not import `src/lib/env/server.ts` or `src/lib/supabase/admin.ts`.

## Session handling

`src/proxy.ts` refreshes the Auth token with `supabase.auth.getClaims()` on each matched request. Public pages are not redirected to sign-in. Identity for protected data must be re-checked on the server; cookie presence is not authorization.

## Decisions

1. Independent Git repository in this folder. The parent user home directory is a different Git repo and must not receive VISION commits.
2. Current Supabase key names: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `SUPABASE_SECRET_KEY`.
3. Next.js 16 `proxy.ts` rather than deprecated `middleware.ts`.
4. Public directory data is exposed through restricted views, not full table grants to `anon`.
5. Profile provisioning is a `SECURITY DEFINER` trigger on `auth.users`. It never assigns `admin` or `moderator` from user metadata.
