create or replace function get_doctor_specializations()
returns text[] as $$
  select enum_range(null::doctor_specialization)::text[];
$$ language sql stable;