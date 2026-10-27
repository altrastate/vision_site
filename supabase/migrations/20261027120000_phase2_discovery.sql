-- Phase 2: ordinary role provisioning, public job/company listing views, search index.

create type public.intended_purpose as enum ('seeker', 'employer');

alter table public.profiles
  add column if not exists intended_purpose public.intended_purpose not null default 'seeker';

comment on column public.profiles.intended_purpose is
  'Onboarding preference only. Never used to grant admin, moderator, or verification.';

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  purpose_text text;
  purpose public.intended_purpose;
  ordinary_role public.app_role;
begin
  purpose_text := lower(btrim(coalesce(new.raw_user_meta_data ->> 'intended_purpose', 'seeker')));
  if purpose_text not in ('seeker', 'employer') then
    purpose_text := 'seeker';
  end if;
  purpose := purpose_text::public.intended_purpose;
  ordinary_role := purpose_text::public.app_role;

  insert into public.profiles (id, full_name, intended_purpose, account_status)
  values (
    new.id,
    nullif(btrim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), ''),
    purpose,
    'active'
  )
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role, assigned_by)
  values (new.id, ordinary_role, null)
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

create or replace function private.protect_profile_immutable_columns()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.id is distinct from old.id then
    raise exception 'profile identity cannot be changed';
  end if;
  if new.created_at is distinct from old.created_at then
    raise exception 'profile created_at cannot be changed';
  end if;
  if new.account_status is distinct from old.account_status
     and not private.is_staff() then
    raise exception 'account status cannot be changed by the profile owner';
  end if;
  if new.intended_purpose is distinct from old.intended_purpose
     and new.intended_purpose not in ('seeker', 'employer') then
    raise exception 'invalid intended purpose';
  end if;
  return new;
end;
$$;

alter table public.jobs
  add column if not exists search_vector tsvector
  generated always as (
    setweight(to_tsvector('simple', coalesce(title, '')), 'A')
    || setweight(to_tsvector('simple', coalesce(description, '')), 'B')
  ) stored;

create index if not exists jobs_search_vector_idx on public.jobs using gin (search_vector);
create index if not exists jobs_job_type_idx on public.jobs (job_type);
create index if not exists jobs_work_arrangement_idx on public.jobs (work_arrangement);
create index if not exists jobs_experience_level_idx on public.jobs (experience_level);

create or replace view public.job_listings
with (security_barrier = true) as
select
  j.id,
  j.company_id,
  j.title,
  j.slug as job_slug,
  c.slug as company_slug,
  c.name as company_name,
  c.logo_path as company_logo_path,
  c.verification_status,
  c.industry_id,
  i.name as industry_name,
  i.slug as industry_slug,
  j.description,
  j.responsibilities,
  j.qualifications,
  j.job_type,
  j.work_arrangement,
  j.experience_level,
  j.location_id,
  l.name as location_name,
  l.region as location_region,
  l.country_code as location_country,
  j.is_remote,
  j.salary_min,
  j.salary_max,
  j.salary_currency,
  j.salary_period,
  j.salary_is_disclosed,
  j.published_at,
  j.application_deadline,
  j.created_at,
  j.updated_at
from public.published_jobs j
join public.company_directory c on c.id = j.company_id
left join public.locations l on l.id = j.location_id
left join public.industries i on i.id = c.industry_id;

create or replace view public.company_listings
with (security_barrier = true) as
select
  c.id,
  c.name,
  c.slug,
  c.description,
  c.industry_id,
  i.name as industry_name,
  c.website_url,
  c.logo_path,
  c.country_code,
  c.location_id,
  loc.name as location_name,
  loc.region as location_region,
  c.verification_status,
  c.created_at,
  (
    select count(*)::integer
    from public.published_jobs j
    where j.company_id = c.id
  ) as active_job_count
from public.company_directory c
left join public.industries i on i.id = c.industry_id
left join public.locations loc on loc.id = c.location_id;

grant select on table public.job_listings to anon, authenticated;
grant select on table public.company_listings to anon, authenticated;
