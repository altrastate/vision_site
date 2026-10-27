-- Reference taxonomy for local development. Not live marketplace data.

insert into public.industries (name, slug)
select name, slug
from (
  values
    ('Information Technology', 'information-technology'),
    ('Healthcare', 'healthcare'),
    ('Education', 'education'),
    ('Finance and Banking', 'finance-and-banking'),
    ('Agriculture', 'agriculture'),
    ('Construction', 'construction'),
    ('Hospitality and Tourism', 'hospitality-and-tourism'),
    ('Retail and Trade', 'retail-and-trade'),
    ('Logistics and Transport', 'logistics-and-transport'),
    ('Public Administration', 'public-administration')
) as seed(name, slug)
where not exists (
  select 1 from public.industries existing where existing.slug = seed.slug
);

insert into public.locations (country_code, name, region)
select country_code, name, region
from (
  values
    ('UG', 'Kampala', 'Central'),
    ('UG', 'Wakiso', 'Central'),
    ('UG', 'Entebbe', 'Central'),
    ('UG', 'Jinja', 'Eastern'),
    ('UG', 'Mbale', 'Eastern'),
    ('UG', 'Gulu', 'Northern'),
    ('UG', 'Lira', 'Northern'),
    ('UG', 'Arua', 'Northern'),
    ('UG', 'Mbarara', 'Western'),
    ('UG', 'Fort Portal', 'Western'),
    ('KE', 'Nairobi', 'Nairobi'),
    ('RW', 'Kigali', 'Kigali')
) as seed(country_code, name, region)
where not exists (
  select 1
  from public.locations existing
  where existing.country_code = seed.country_code
    and existing.name = seed.name
    and coalesce(existing.region, '') = coalesce(seed.region, '')
);
