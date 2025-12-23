create or replace function get_doctors()
returns table (id uuid, full_name text) as $$
begin
  return query
  select u.id, u.raw_user_meta_data->>'full_name' as full_name
  from auth.users u
  where u.raw_user_meta_data->>'role' = 'doctor';
end;
$$ language plpgsql security definer;