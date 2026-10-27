# Phase 2 implementation

Authentication, seeker profiles, and public job/company discovery on top of the Phase 1 foundation.

## What now works

- Registration, login, logout, email-confirmation callback, and password recovery screens.
- Server-side session checks for `/seeker`, `/employer`, and `/admin`.
- Persistent seeker profile view/edit, completeness scoring, and avatar upload into the existing `avatars` bucket.
- Public job search with filters, sort, pagination, and job detail by `(companySlug, jobSlug)`.
- Public company directory and company detail with that company's active public jobs.
- Homepage search and recent published jobs from the database (empty when none exist).

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Homepage with live recent jobs |
| `/jobs` | Search, filters, pagination |
| `/jobs/[companySlug]/[jobSlug]` | Public job detail |
| `/companies` | Public company directory |
| `/companies/[slug]` | Public company profile |
| `/how-it-works` | Honest product explanation |
| `/auth/register` | Registration |
| `/auth/login` | Sign in |
| `/auth/confirm` | Confirmation pending / resend |
| `/auth/forgot-password` | Request reset email |
| `/auth/reset-password` | Set a new password after a recovery session |
| `/auth/callback` | Auth code / OTP exchange |
| `/sign-in`, `/sign-up` | Redirects to the `/auth/*` routes |
| `/seeker/profile` | Own profile overview |
| `/seeker/profile/edit` | Edit permitted fields |
| `/seeker/settings` | Email, recovery, sign-out |
| `/seeker/dashboard` | Redirects to `/seeker/profile` |
| `/employer/dashboard` | Honest Phase 3 placeholder |

Job URLs use the Phase 1 unique key `(company_id, slug)`, exposed as `/jobs/{company.slug}/{job.slug}`.

## Database

Migration: `supabase/migrations/20261027120000_phase2_discovery.sql`

- `profiles.intended_purpose` (`seeker` \| `employer`) — onboarding preference only.
- `private.handle_new_user()` assigns only those ordinary roles from a whitelist. It never assigns `admin` or `moderator`.
- Generated `jobs.search_vector` with a GIN index, plus filter indexes.
- Views `job_listings` and `company_listings` (security barrier, granted to `anon` and `authenticated`).

`saved_jobs` was not in Phase 1 and is not invented here. Save-job persistence is Phase 3.

## Auth redirects

Configure these in the Supabase project (Authentication → URL configuration):

- Site URL: `NEXT_PUBLIC_APP_URL`
- Redirect allow list:
  - `{APP_URL}/auth/callback`
  - `{APP_URL}/auth/callback?next=/seeker/profile`
  - `{APP_URL}/auth/callback?next=/auth/reset-password`

Email confirmation and password recovery depend on that project's Auth email settings. This phase does **not** claim inbox delivery has been tested.

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

`pnpm test:db` still requires local Docker + `supabase start`.

## Known limitations

- Hosted migrations may not yet be applied to the `vision_site` Supabase project.
- Email confirmation and reset mail have not been end-to-end tested against a live inbox.
- No production Vercel deployment was performed in this phase.
- Employer job posting, applications, CVs, interviews, and saved jobs remain Phase 3.
- Salary sort only compares disclosed monthly UGX figures.

## Phase 3 can build on

- Auth sessions, profile rows, and ordinary seeker/employer roles.
- Public listing views and search indexes.
- Company membership and jobs tables already constrained in Phase 1.
