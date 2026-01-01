
create or replace function get_doctor_patients(p_doctor_id uuid)
returns table (
    id uuid,
    full_name text,
    email text,
    last_visit date
)
language plpgsql
as $$
begin
    return query
    select distinct on (p.id)
        p.id,
        p.full_name,
        u.email,
        max(a.appointment_date) as last_visit
    from
        profiles p
    join
        auth.users u on p.id = u.id
    join
        appointments a on a.patient_id = p.id
    where
        a.doctor_id = p_doctor_id
    group by
        p.id, u.email
    order by
        p.id, last_visit desc;
end;
$$;
