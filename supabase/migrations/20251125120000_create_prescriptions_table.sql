supabase db push
-- Create the prescriptions table
CREATE TABLE IF NOT EXISTS public.prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID REFERENCES public.consultations(id),
    patient_id UUID REFERENCES public.patients(id),
    doctor_id UUID REFERENCES auth.users(id),
    medication TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    duration TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies for prescriptions table
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- Patients can view their own prescriptions
CREATE POLICY "Patients can view their own prescriptions"
ON public.prescriptions
FOR SELECT
USING (
  patient_id = (
    SELECT id FROM public.patients WHERE user_id = auth.uid()
  )
);

-- Doctors can view prescriptions they have written
CREATE POLICY "Doctors can view prescriptions they have written"
ON public.prescriptions
FOR SELECT
USING (
  doctor_id = auth.uid()
);

-- Doctors can create prescriptions for their patients
CREATE POLICY "Doctors can create prescriptions"
ON public.prescriptions
FOR INSERT
WITH CHECK (
  doctor_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.consultations c
    WHERE c.id = consultation_id AND c.doctor_id = auth.uid()
  )
);
