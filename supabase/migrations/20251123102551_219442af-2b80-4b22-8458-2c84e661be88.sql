-- Update RLS policies for patients table to ensure proper access control
-- Drop existing policies
DROP POLICY IF EXISTS "Patients can view own record" ON patients;
DROP POLICY IF EXISTS "Admins and doctors can view patients" ON patients;
DROP POLICY IF EXISTS "Doctors and admins can update patients" ON patients;

-- Patients can view their own record
CREATE POLICY "Patients can view own record"
ON patients
FOR SELECT
USING (auth.uid() = user_id);

-- Doctors can only view patients assigned to them through consultations
CREATE POLICY "Doctors can view assigned patients"
ON patients
FOR SELECT
USING (
  has_role(auth.uid(), 'doctor') 
  AND id IN (
    SELECT patient_id 
    FROM consultations 
    WHERE doctor_id = auth.uid()
  )
);

-- Admins can view all patients
CREATE POLICY "Admins can view all patients"
ON patients
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Doctors and admins can update patient records
CREATE POLICY "Doctors and admins can update patients"
ON patients
FOR UPDATE
USING (
  has_role(auth.uid(), 'admin') 
  OR (
    has_role(auth.uid(), 'doctor') 
    AND id IN (
      SELECT patient_id 
      FROM consultations 
      WHERE doctor_id = auth.uid()
    )
  )
);

-- Update consultations table to support AI-to-doctor handoff
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS ai_handoff_reason TEXT;
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS chat_transcript JSONB;

-- Create function to auto-assign doctor based on specialty
CREATE OR REPLACE FUNCTION assign_doctor_by_specialty(consultation_id UUID, required_specialty TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  assigned_doctor_id UUID;
BEGIN
  -- Find an available doctor with matching specialty
  SELECT d.user_id INTO assigned_doctor_id
  FROM doctors d
  WHERE d.specialization ILIKE '%' || required_specialty || '%'
    AND d.status = 'available'
  ORDER BY RANDOM()
  LIMIT 1;
  
  -- If no specialist found, assign any available doctor
  IF assigned_doctor_id IS NULL THEN
    SELECT d.user_id INTO assigned_doctor_id
    FROM doctors d
    WHERE d.status = 'available'
    ORDER BY RANDOM()
    LIMIT 1;
  END IF;
  
  -- Update consultation with assigned doctor
  IF assigned_doctor_id IS NOT NULL THEN
    UPDATE consultations
    SET doctor_id = assigned_doctor_id,
        status = 'assigned',
        updated_at = NOW()
    WHERE id = consultation_id;
  END IF;
  
  RETURN assigned_doctor_id;
END;
$$;