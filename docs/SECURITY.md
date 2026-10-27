# VISION security

## Role model

Application roles (`user_roles.role`): `seeker`, `employer`, `moderator`, `admin`.  
`admin` and `moderator` are privileged. Clients have no INSERT/UPDATE/DELETE policy on `user_roles`.

Company membership roles: `owner`, `recruiter`, `hiring_manager`, `viewer`.  
Owners manage membership. Owners, recruiters, and hiring managers manage jobs. Viewers are read-only members. Ordinary users cannot grant themselves `owner`.

## RLS summary

| Object | anon | authenticated |
| --- | --- | --- |
| `profiles` | no table access | own row (and staff) |
| `public_profiles` | public columns of active profiles | same |
| `user_roles` | none | own roles (and staff) |
| `companies` | no table access | active members and staff |
| `company_directory` | listing projection | same |
| `company_members` | none | fellow members, self, staff |
| `jobs` | no table access | company members and staff |
| `published_jobs` | published vacancies | same |
| `job_listings` | public discovery join | same |
| `company_listings` | public company cards | same |
| `locations`, `industries` | read | read; staff write |

Helper functions live in the unexposed `private` schema, use `SECURITY DEFINER`, and set a fixed empty `search_path` to avoid recursive RLS.

## Auth rules

- Verify identity with `getClaims()`, not `getSession()`.
- Do not trust `user_metadata` / `raw_user_meta_data` for authorization. Registration may send `intended_purpose`; the trigger accepts only `seeker` or `employer`.
- Protected routes are gated in `src/proxy.ts` and re-checked with `requirePageUser()` on the server. Client navigation is not the security boundary.
- Return URLs (`next`) must be internal paths; `safeInternalPath()` rejects protocol-relative and external destinations.
- Secret keys (`SUPABASE_SECRET_KEY`) bypass RLS. They are imported only in `src/lib/env/server.ts` and `src/lib/supabase/admin.ts`.
- Storage: `avatars` and `company-logos` are public-read; `cvs` is private and path-scoped to the owner folder.

## Tests

- Unit: `tests/unit/*` (environment errors, role helpers, secret isolation, Zod).
- Database: `supabase/tests/rls_foundation.test.sql` via `pnpm test:db` when local Supabase is running.
- Integration: `tests/integration/rls.test.ts` runs only when live credentials are present.

## Outstanding decisions

- Production JWT expiry and session revocation on user disable.
- Legal privacy policy text before launch.
- Dedicated production vs development Supabase projects (required; not created by this repository).
