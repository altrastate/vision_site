begin;
select plan(10);

create or replace function tests.mk_user(email text, full_name text)
returns uuid
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  new_id uuid := gen_random_uuid();
begin
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  )
  values (
    '00000000-0000-0000-0000-000000000000',
    new_id,
    'authenticated',
    'authenticated',
    email,
    crypt('test-password-12', gen_salt('bf')),
    timezone('utc', now()),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('full_name', full_name),
    timezone('utc', now()),
    timezone('utc', now())
  );
  return new_id;
end;
$$;

create temp table test_ids as
select
  tests.mk_user('owner-a@vision.test', 'Owner A') as owner_a,
  tests.mk_user('owner-b@vision.test', 'Owner B') as owner_b,
  tests.mk_user('stranger@vision.test', 'Stranger') as stranger;

select isnt(
  (select p.id from public.profiles p join test_ids t on t.owner_a = p.id),
  null,
  'new auth users receive a profile'
);

insert into public.companies (name, slug, created_by, description)
select 'Alpha Ltd', 'alpha-ltd', owner_a, 'First company' from test_ids
union all
select 'Beta Ltd', 'beta-ltd', owner_b, 'Second company' from test_ids;

insert into public.jobs (
  company_id, created_by, title, slug, description,
  job_type, work_arrangement, experience_level, status
)
select
  c.id, c.created_by, 'Draft role', 'draft-role',
  'This draft vacancy must stay private to the company.',
  'full_time', 'on_site', 'mid', 'draft'
from public.companies c
where c.slug = 'alpha-ltd';

-- 1. Anonymous visitors cannot read private profiles.
set local role anon;
select throws_ok(
  'select phone from public.profiles',
  '42501',
  null,
  'anonymous role cannot read the profiles table'
);

reset role;

-- 2. Authenticated user cannot update another user's profile.
select set_config('request.jwt.claim.sub', (select stranger from test_ids)::text, true);
select set_config('request.jwt.claims', json_build_object('sub', (select stranger from test_ids), 'role', 'authenticated')::text, true);
set local role authenticated;

update public.profiles
set full_name = 'Hijacked'
where id = (select owner_a from test_ids);

reset role;
select is(
  (select full_name from public.profiles where id = (select owner_a from test_ids)),
  'Owner A',
  'cross-account profile updates change zero rows'
);

-- 3. A user cannot assign themselves an administrator role.
select set_config('request.jwt.claim.sub', (select stranger from test_ids)::text, true);
select set_config('request.jwt.claims', json_build_object('sub', (select stranger from test_ids), 'role', 'authenticated')::text, true);
set local role authenticated;
select throws_ok(
  format(
    'insert into public.user_roles (user_id, role) values (%L, %L)',
    (select stranger from test_ids),
    'admin'
  ),
  '42501',
  null,
  'unprivileged users cannot insert user_roles'
);

-- 4. A company member cannot manage another company's data.
reset role;
select set_config('request.jwt.claim.sub', (select owner_a from test_ids)::text, true);
select set_config('request.jwt.claims', json_build_object('sub', (select owner_a from test_ids), 'role', 'authenticated')::text, true);
set local role authenticated;
update public.companies
set description = 'taken over'
where slug = 'beta-ltd';
reset role;
select is(
  (select description from public.companies where slug = 'beta-ltd'),
  'Second company',
  'owner A cannot update company B'
);

-- 5. An unprivileged user cannot change company membership.
select set_config('request.jwt.claim.sub', (select stranger from test_ids)::text, true);
select set_config('request.jwt.claims', json_build_object('sub', (select stranger from test_ids), 'role', 'authenticated')::text, true);
set local role authenticated;
select throws_ok(
  format(
    $sql$
      insert into public.company_members (company_id, user_id, membership_role, status)
      select id, %L, 'owner', 'active' from public.companies where slug = 'alpha-ltd'
    $sql$,
    (select stranger from test_ids)
  ),
  '42501',
  null,
  'strangers cannot insert memberships'
);

-- 6. Non-public job records are not publicly readable.
set local role anon;
select throws_ok(
  'select id from public.jobs where status = ''draft''',
  '42501',
  null,
  'anonymous visitors cannot read jobs from the table'
);
select is(
  (select count(*)::int from public.published_jobs),
  0,
  'draft jobs are absent from published_jobs'
);

-- 7. Constraints reject invalid data.
reset role;
select throws_ok(
  $sql$
    insert into public.jobs (
      company_id, created_by, title, slug, description,
      job_type, work_arrangement, experience_level, salary_min, salary_max
    )
    select id, created_by, 'Bad pay', 'bad-pay',
           'Salary minimum must not exceed maximum for this vacancy.',
           'full_time', 'on_site', 'mid', 5000, 1000
    from public.companies where slug = 'alpha-ltd'
  $sql$,
  '23514',
  null,
  'salary_min > salary_max is rejected'
);

select throws_ok(
  $sql$ insert into public.industries (name, slug) values ('Duplicate IT', 'information-technology') $sql$,
  '23505',
  null,
  'duplicate industry slug is rejected'
);

select * from finish();
rollback;
