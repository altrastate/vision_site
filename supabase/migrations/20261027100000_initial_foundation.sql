-- VISION Phase 1 foundation schema, provisioning, grants, and RLS.

create schema if not exists private;

revoke all on schema private from public;
grant usage on schema private to postgres, service_role;

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.account_status as enum ('pending', 'active', 'suspended');
create type public.app_role as enum ('seeker', 'employer', 'moderator', 'admin');
create type public.company_verification_status as enum (
  'unverified',
  'pending',
  'verified',
  'rejected'
);
create type public.company_membership_role as enum (
  'owner',
  'recruiter',
  'hiring_manager',
  'viewer'
);
create type public.company_membership_status as enum ('invited', 'active', 'suspended');
create type public.job_type as enum (
  'full_time',
  'part_time',
  'contract',
  'temporary',
  'internship'
);
create type public.work_arrangement as enum ('on_site', 'hybrid', 'remote');
create type public.experience_level as enum (
  'intern',
  'entry',
  'mid',
  'senior',
  'lead',
  'executive'
);
create type public.salary_period as enum ('hour', 'day', 'week', 'month', 'year');
create type public.job_status as enum (
  'draft',
  'published',
  'closed',
  'suspended',
  'archived'
);

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  country_code char(2) not null,
  name text not null,
  region text,
  parent_id uuid references public.locations (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  constraint locations_country_code_check check (country_code ~ '^[A-Z]{2}$'),
  constraint locations_name_length check (char_length(name) between 1 and 120),
  constraint locations_region_length check (region is null or char_length(region) between 1 and 120)
);

create unique index locations_unique_place_idx
  on public.locations (country_code, name, coalesce(region, ''));
create index locations_parent_id_idx on public.locations (parent_id);
create index locations_country_code_idx on public.locations (country_code);

create table public.industries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  created_at timestamptz not null default timezone('utc', now()),
  constraint industries_name_length check (char_length(name) between 1 and 80),
  constraint industries_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint industries_name_key unique (name),
  constraint industries_slug_key unique (slug)
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  headline text,
  bio text,
  avatar_path text,
  location_id uuid references public.locations (id) on delete set null,
  account_status public.account_status not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint profiles_full_name_length check (
    full_name is null or char_length(full_name) between 1 and 120
  ),
  constraint profiles_phone_length check (
    phone is null or char_length(phone) between 7 and 20
  ),
  constraint profiles_headline_length check (
    headline is null or char_length(headline) between 1 and 160
  ),
  constraint profiles_bio_length check (bio is null or char_length(bio) <= 5000)
);

create index profiles_location_id_idx on public.profiles (location_id);
create index profiles_account_status_idx on public.profiles (account_status);

create table public.user_roles (
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.app_role not null,
  assigned_by uuid references public.profiles (id) on delete set null,
  assigned_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, role)
);

create index user_roles_role_idx on public.user_roles (role);
create index user_roles_assigned_by_idx on public.user_roles (assigned_by);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  description text,
  industry_id uuid references public.industries (id) on delete set null,
  website_url text,
  logo_path text,
  country_code char(2) not null default 'UG',
  location_id uuid references public.locations (id) on delete set null,
  verification_status public.company_verification_status not null default 'unverified',
  verified_at timestamptz,
  verified_by uuid references public.profiles (id) on delete set null,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint companies_name_length check (char_length(name) between 2 and 160),
  constraint companies_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint companies_slug_key unique (slug),
  constraint companies_country_code_check check (country_code ~ '^[A-Z]{2}$'),
  constraint companies_website_url_check check (
    website_url is null or website_url ~* '^https?://'
  ),
  constraint companies_description_length check (
    description is null or char_length(description) <= 8000
  ),
  constraint companies_verified_consistency check (
    (
      verification_status = 'verified'
      and verified_at is not null
    )
    or (
      verification_status <> 'verified'
      and verified_at is null
    )
  )
);

create index companies_industry_id_idx on public.companies (industry_id);
create index companies_location_id_idx on public.companies (location_id);
create index companies_created_by_idx on public.companies (created_by);
create index companies_country_code_idx on public.companies (country_code);

create table public.company_members (
  company_id uuid not null references public.companies (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  membership_role public.company_membership_role not null,
  status public.company_membership_status not null default 'invited',
  invited_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (company_id, user_id)
);

create index company_members_user_id_idx on public.company_members (user_id);
create index company_members_active_idx
  on public.company_members (company_id, user_id)
  where status = 'active';

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  created_by uuid references public.profiles (id) on delete set null,
  title text not null,
  slug text not null,
  description text not null,
  responsibilities text,
  qualifications text,
  job_type public.job_type not null,
  work_arrangement public.work_arrangement not null,
  experience_level public.experience_level not null,
  location_id uuid references public.locations (id) on delete set null,
  is_remote boolean not null default false,
  salary_min numeric(12, 2),
  salary_max numeric(12, 2),
  salary_currency char(3) not null default 'UGX',
  salary_period public.salary_period not null default 'month',
  salary_is_disclosed boolean not null default false,
  status public.job_status not null default 'draft',
  published_at timestamptz,
  application_deadline timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  closed_at timestamptz,
  constraint jobs_title_length check (char_length(title) between 3 and 160),
  constraint jobs_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint jobs_company_slug_key unique (company_id, slug),
  constraint jobs_description_length check (char_length(description) between 20 and 20000),
  constraint jobs_salary_range check (
    salary_min is null or salary_max is null or salary_min <= salary_max
  ),
  constraint jobs_salary_nonnegative check (
    (salary_min is null or salary_min >= 0)
    and (salary_max is null or salary_max >= 0)
  ),
  constraint jobs_salary_currency_check check (salary_currency ~ '^[A-Z]{3}$'),
  constraint jobs_published_consistency check (
    status <> 'published' or published_at is not null
  ),
  constraint jobs_remote_consistency check (
    (work_arrangement = 'remote' and is_remote = true)
    or (work_arrangement = 'on_site' and is_remote = false)
    or work_arrangement = 'hybrid'
  )
);

create index jobs_company_id_idx on public.jobs (company_id);
create index jobs_created_by_idx on public.jobs (created_by);
create index jobs_location_id_idx on public.jobs (location_id);
create index jobs_status_published_at_idx on public.jobs (status, published_at desc);
create index jobs_public_discovery_idx
  on public.jobs (published_at desc)
  where status = 'published';

-- ---------------------------------------------------------------------------
-- Helper functions (private, security definer, fixed search_path)
-- ---------------------------------------------------------------------------

create or replace function private.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function private.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = (select auth.uid())
      and role in ('admin', 'moderator')
  );
$$;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = (select auth.uid())
      and role = 'admin'
  );
$$;

create or replace function private.is_active_company_member(target_company_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.company_members
    where company_id = target_company_id
      and user_id = (select auth.uid())
      and status = 'active'
  );
$$;

create or replace function private.has_company_role(
  target_company_id uuid,
  allowed_roles public.company_membership_role[]
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.company_members
    where company_id = target_company_id
      and user_id = (select auth.uid())
      and status = 'active'
      and membership_role = any (allowed_roles)
  );
$$;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, account_status)
  values (
    new.id,
    nullif(btrim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), ''),
    'active'
  )
  on conflict (id) do nothing;
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
  return new;
end;
$$;

create or replace function private.protect_company_verification_columns()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not private.is_staff() then
    new.verification_status := old.verification_status;
    new.verified_at := old.verified_at;
    new.verified_by := old.verified_by;
    new.created_by := old.created_by;
    new.created_at := old.created_at;
  end if;
  return new;
end;
$$;

create or replace function private.add_company_creator_as_owner()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.created_by is not null then
    insert into public.company_members (
      company_id,
      user_id,
      membership_role,
      status,
      invited_by
    )
    values (
      new.id,
      new.created_by,
      'owner',
      'active',
      new.created_by
    )
    on conflict do nothing;
  end if;
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function private.set_updated_at();

create trigger companies_set_updated_at
  before update on public.companies
  for each row execute function private.set_updated_at();

create trigger jobs_set_updated_at
  before update on public.jobs
  for each row execute function private.set_updated_at();

create trigger profiles_protect_immutable_columns
  before update on public.profiles
  for each row execute function private.protect_profile_immutable_columns();

create trigger companies_protect_verification
  before update on public.companies
  for each row execute function private.protect_company_verification_columns();

create trigger companies_add_creator_owner
  after insert on public.companies
  for each row execute function private.add_company_creator_as_owner();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- ---------------------------------------------------------------------------
-- Public projections (restricted columns; table RLS remains the source of truth
-- for member/admin access to private fields)
-- ---------------------------------------------------------------------------

-- SECURITY DEFINER views expose a restricted column set. Callers do not receive
-- table-level SELECT on profiles/companies/jobs, so phone, verification actors,
-- drafts, and created_by remain hidden from public queries.
create view public.public_profiles
with (security_barrier = true) as
select
  id,
  full_name,
  headline,
  avatar_path,
  location_id
from public.profiles
where account_status = 'active';

create view public.company_directory
with (security_barrier = true) as
select
  id,
  name,
  slug,
  description,
  industry_id,
  website_url,
  logo_path,
  country_code,
  location_id,
  verification_status,
  created_at
from public.companies;

create view public.published_jobs
with (security_barrier = true) as
select
  id,
  company_id,
  title,
  slug,
  description,
  responsibilities,
  qualifications,
  job_type,
  work_arrangement,
  experience_level,
  location_id,
  is_remote,
  case when salary_is_disclosed then salary_min else null end as salary_min,
  case when salary_is_disclosed then salary_max else null end as salary_max,
  salary_currency,
  salary_period,
  salary_is_disclosed,
  published_at,
  application_deadline,
  created_at,
  updated_at
from public.jobs
where status = 'published'
  and (application_deadline is null or application_deadline > timezone('utc', now()));

-- ---------------------------------------------------------------------------
-- Grants: explicit, least privilege. RLS still applies after grants.
-- ---------------------------------------------------------------------------

revoke all on schema public from anon, authenticated;
grant usage on schema public to anon, authenticated, service_role;

revoke all on all tables in schema public from anon, authenticated;
revoke all on all functions in schema public from public, anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;

grant select on table public.locations to anon, authenticated;
grant select on table public.industries to anon, authenticated;
grant select on table public.public_profiles to anon, authenticated;
grant select on table public.company_directory to anon, authenticated;
grant select on table public.published_jobs to anon, authenticated;

grant select, update on table public.profiles to authenticated;
grant select on table public.user_roles to authenticated;
grant select, insert, update on table public.companies to authenticated;
grant select, insert, update, delete on table public.company_members to authenticated;
grant select, insert, update on table public.jobs to authenticated;
grant select on table public.locations to authenticated;
grant select on table public.industries to authenticated;

grant select, insert, update, delete on all tables in schema public to service_role;
grant execute on all functions in schema private to service_role;
grant execute on function private.is_staff() to authenticated;
grant execute on function private.is_admin() to authenticated;
grant execute on function private.is_active_company_member(uuid) to authenticated;
grant execute on function private.has_company_role(uuid, public.company_membership_role[]) to authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.locations enable row level security;
alter table public.industries enable row level security;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.companies enable row level security;
alter table public.company_members enable row level security;
alter table public.jobs enable row level security;

alter table public.profiles force row level security;
alter table public.user_roles force row level security;
alter table public.companies force row level security;
alter table public.company_members force row level security;
alter table public.jobs force row level security;

-- Locations / industries: public read, staff write.
create policy locations_select_all
  on public.locations
  for select
  to anon, authenticated
  using (true);

create policy locations_staff_write
  on public.locations
  for all
  to authenticated
  using ((select private.is_staff()))
  with check ((select private.is_staff()));

create policy industries_select_all
  on public.industries
  for select
  to anon, authenticated
  using (true);

create policy industries_staff_write
  on public.industries
  for all
  to authenticated
  using ((select private.is_staff()))
  with check ((select private.is_staff()));

-- Profiles
create policy profiles_select_own_or_staff
  on public.profiles
  for select
  to authenticated
  using (
    id = (select auth.uid())
    or (select private.is_staff())
  );

create policy profiles_update_own
  on public.profiles
  for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- user_roles: readable by owner and staff. No insert/update/delete for clients.
create policy user_roles_select_own_or_staff
  on public.user_roles
  for select
  to authenticated
  using (
    user_id = (select auth.uid())
    or (select private.is_staff())
  );

-- Companies: table access is members/staff only. Public reads use company_directory.
create policy companies_select_member_or_staff
  on public.companies
  for select
  to authenticated
  using (
    (select private.is_active_company_member(id))
    or (select private.is_staff())
  );

create policy companies_insert_self
  on public.companies
  for insert
  to authenticated
  with check (created_by = (select auth.uid()));

create policy companies_update_managers
  on public.companies
  for update
  to authenticated
  using (
    (select private.has_company_role(
      id,
      array['owner', 'recruiter']::public.company_membership_role[]
    ))
    or (select private.is_staff())
  )
  with check (
    (select private.has_company_role(
      id,
      array['owner', 'recruiter']::public.company_membership_role[]
    ))
    or (select private.is_staff())
  );

-- Company members
create policy company_members_select
  on public.company_members
  for select
  to authenticated
  using (
    user_id = (select auth.uid())
    or (select private.is_active_company_member(company_id))
    or (select private.is_staff())
  );

create policy company_members_insert_owner
  on public.company_members
  for insert
  to authenticated
  with check (
    (
      (select private.has_company_role(
        company_id,
        array['owner']::public.company_membership_role[]
      ))
      and membership_role in ('recruiter', 'hiring_manager', 'viewer')
    )
    or (select private.is_staff())
  );

create policy company_members_update_owner
  on public.company_members
  for update
  to authenticated
  using (
    (select private.has_company_role(
      company_id,
      array['owner']::public.company_membership_role[]
    ))
    or (select private.is_staff())
  )
  with check (
    (
      (select private.has_company_role(
        company_id,
        array['owner']::public.company_membership_role[]
      ))
      and membership_role in ('recruiter', 'hiring_manager', 'viewer')
    )
    or (select private.is_staff())
  );

create policy company_members_delete_owner
  on public.company_members
  for delete
  to authenticated
  using (
    (
      (select private.has_company_role(
        company_id,
        array['owner']::public.company_membership_role[]
      ))
      and user_id is distinct from (select auth.uid())
    )
    or (select private.is_staff())
  );

-- Jobs: table access is members/staff only. Public reads use published_jobs.
create policy jobs_select_member_or_staff
  on public.jobs
  for select
  to authenticated
  using (
    (select private.is_active_company_member(company_id))
    or (select private.is_staff())
  );

create policy jobs_insert_managers
  on public.jobs
  for insert
  to authenticated
  with check (
    created_by = (select auth.uid())
    and (
      (select private.has_company_role(
        company_id,
        array['owner', 'recruiter', 'hiring_manager']::public.company_membership_role[]
      ))
      or (select private.is_staff())
    )
  );

create policy jobs_update_managers
  on public.jobs
  for update
  to authenticated
  using (
    (select private.has_company_role(
      company_id,
      array['owner', 'recruiter', 'hiring_manager']::public.company_membership_role[]
    ))
    or (select private.is_staff())
  )
  with check (
    (select private.has_company_role(
      company_id,
      array['owner', 'recruiter', 'hiring_manager']::public.company_membership_role[]
    ))
    or (select private.is_staff())
  );

-- ---------------------------------------------------------------------------
-- Storage architecture for avatars, logos, and private CVs
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'avatars',
    'avatars',
    true,
    2097152,
    array['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'company-logos',
    'company-logos',
    true,
    2097152,
    array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  ),
  (
    'cvs',
    'cvs',
    false,
    10485760,
    array[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  )
on conflict (id) do nothing;

create policy avatars_public_read
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'avatars');

create policy avatars_owner_write
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy avatars_owner_update
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy company_logos_public_read
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'company-logos');

create policy cvs_owner_select
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'cvs'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy cvs_owner_insert
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'cvs'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy cvs_owner_update
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'cvs'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'cvs'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

comment on table public.profiles is 'Application profile linked 1:1 with auth.users. Credentials stay in Auth.';
comment on table public.user_roles is 'Privileged and product roles. Clients cannot assign admin or moderator.';
comment on table public.companies is 'Employer organisations. Verification is independent of publishing permission.';
comment on table public.jobs is 'Foundation vacancy table. Full recruitment workflows belong to later phases.';
comment on column public.jobs.status is 'draft and other non-public states must not leak through anonymous queries.';
