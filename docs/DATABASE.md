# VISION database

Migrations:

1. `supabase/migrations/20261027100000_initial_foundation.sql`
2. `supabase/migrations/20261027120000_phase2_discovery.sql`

Seed: `supabase/seed.sql` (reference taxonomy only). Do not reset hosted databases.

## Phase One tables

- `locations` — country-aware place taxonomy (`country_code`, `name`, `region`, `parent_id`).
- `industries` — hiring sectors (`name`, `slug`).
- `profiles` — 1:1 with `auth.users`. No passwords or emails stored here.
- `user_roles` — composite primary key `(user_id, role)`. Privileged assignment is not available to ordinary clients.
- `companies` — employer organisations. `verification_status` is independent of the right to publish jobs.
- `company_members` — membership with `owner`, `recruiter`, `hiring_manager`, `viewer`.
- `jobs` — foundation vacancy table, including draft and published states.

## Future tables (not created in Phase One)

Applications, application status history, saved jobs, CVs metadata beyond Storage paths, interviews, notifications, reports, moderation cases, audit logs, and analytics rollups. Those belong to Phases Three and Four.

## Integrity

Timestamps are `timestamptz` written in UTC. UUIDs are primary keys. Foreign keys use `ON DELETE CASCADE` only where the child has no independent history (memberships, jobs of a deleted company). Audit-sensitive references such as `verified_by` and `created_by` use `ON DELETE SET NULL`.

Salary, slug, remote/work-arrangement, and published-at consistency are enforced with table checks.

## Provisioning

`private.handle_new_user()` inserts a `profiles` row when an Auth user is created. It copies `full_name` from user metadata if present and, from Phase 2, a whitelisted `intended_purpose` of `seeker` or `employer`. That value is stored on the profile and used only to assign the matching ordinary role. It never assigns `admin` or `moderator`. The function uses `SET search_path = ''`.

## Views

- `public_profiles` — active profiles, public columns only.
- `company_directory` — company listing fields; excludes `verified_by` and `created_by`.
- `published_jobs` — published, non-expired vacancies; hides undisclosed salary amounts and `created_by`.
- `job_listings` — Phase 2 discovery join of published jobs, company directory, locations, and industries.
- `company_listings` — Phase 2 public company cards, including a count of active published jobs.

`jobs.search_vector` is a generated `tsvector` with a GIN index. Listing search currently uses parameterized `ilike` against the public view so user input never becomes raw SQL.

Regenerate TypeScript types after applying migrations:

```bash
supabase gen types typescript --local > src/types/database.ts
```
