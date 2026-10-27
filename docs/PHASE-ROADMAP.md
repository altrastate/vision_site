# VISION phase roadmap

## Phase 1 — Foundation (complete in repository)

Repository, Next.js architecture, design system, Supabase clients, initial schema, RLS, profile provisioning, landing page, CI, documentation.

## Phase 2 — Authentication, profiles, public discovery (implemented in repository)

Registration, verification callback, recovery, seeker profiles, public job and company directories with search, filters, sorting, and pagination. See `docs/PHASE-2-IMPLEMENTATION.md`. Hosted migration apply, Auth email, and Vercel deploy still require operator setup.

## Phase 3 — Recruitment workflows

Employer vacancy management, seeker skills and CV management, applications with duplicate prevention, applicant management, status history, saved jobs.

## Phase 4 — Administration and communication

Notifications, transactional email, interview scheduling, company team management, employer verification operations, job reporting, admin console, audit logs, basic analytics.

## Phase 5 — Production hardening and launch

Security testing, performance and accessibility, end-to-end regression, backup verification, monitoring, incident response, production launch.

Phase One must not implement Phases Two through Five beyond reserved routes and schema that later phases depend on.
