
create or replace function get_upcoming_appointments(p_patient_id uuid)
returns table (
    id uuid,
    appointment_date date,
    appointment_time time,
    doctor_name text,
    doctor_avatar text
)
language plpgsql
as $$
begin
    return query
    select
        a.id,
        a.appointment_date,
        a.appointment_time,
        p.full_name as doctor_name,
        p.avatar_url as doctor_avatar
    from
        appointments a
    join
        profiles p on a.doctor_id = p.id
    where
        a.patient_id = p_patient_id
        and a.status = 'scheduled'
        and a.appointment_date >= current_date
    order by
        a.appointment_date, a.appointment_time
    limit 3;
end;
$$;
