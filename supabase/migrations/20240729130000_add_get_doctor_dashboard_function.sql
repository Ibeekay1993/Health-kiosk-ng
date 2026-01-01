-- supabase/migrations/20240729130000_add_get_doctor_dashboard_function.sql

CREATE OR REPLACE FUNCTION get_doctor_dashboard(p_doctor_id TEXT)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'appointments_today_count', (SELECT COUNT(*) FROM appointments WHERE doctor_id = p_doctor_id AND appointment_date = current_date),
        'triage_queue_count', (SELECT COUNT(*) FROM consultations WHERE doctor_id = p_doctor_id AND status = 'pending'),
        'new_messages_count', (SELECT COUNT(*) FROM chat_messages WHERE consultation_id IN (SELECT id FROM consultations WHERE doctor_id = p_doctor_id) AND sender_type = 'patient' AND created_at > (SELECT updated_at FROM profiles WHERE user_id = p_doctor_id)),
        'upcoming_appointments', (SELECT json_agg(a) FROM (SELECT a.id, a.appointment_time, p.full_name as patient_name, pa.avatar_url as patient_avatar, a.notes as type FROM appointments a JOIN patients p ON a.patient_id = p.id JOIN profiles pa ON p.user_id = pa.user_id WHERE a.doctor_id = p_doctor_id AND a.appointment_date = current_date ORDER BY a.appointment_time) as a),
        'triage_queue', (SELECT json_agg(c) FROM (SELECT c.id, p.full_name as patient_name, c.symptoms, c.created_at FROM consultations c JOIN patients p ON c.patient_id = p.id WHERE c.doctor_id = p_doctor_id AND c.status = 'pending' ORDER BY c.created_at) as c)
    ) INTO result;
    
    RETURN result;
END;
$$;
