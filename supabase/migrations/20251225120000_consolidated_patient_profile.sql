
-- 1. Drop the existing patients table if it exists
DROP TABLE IF EXISTS public.patients CASCADE;

-- 2. Recreate the patients table with a primary key and all new columns
CREATE TABLE public.patients (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  location text,
  date_of_birth date,
  gender text,
  occupation text,
  weight text,
  height text,
  blood_type text,
  marital_status text
);

-- 3. Enable RLS for the patients table
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- 4. Create policies for the patients table
CREATE POLICY "Patients can view their own data" ON public.patients
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Patients can insert their own data" ON public.patients
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Patients can update their own data" ON public.patients
  FOR UPDATE USING (auth.uid() = user_id);

-- 5. Create the medical_documents table
CREATE TABLE public.medical_documents (
  id bigserial PRIMARY KEY,
  patient_id uuid NOT NULL REFERENCES public.patients(user_id) ON DELETE CASCADE,
  document_name text NOT NULL,
  document_url text NOT NULL,
  uploaded_at timestamptz DEFAULT now()
);

-- 6. Create the insurance_details table
CREATE TABLE public.insurance_details (
  id bigserial PRIMARY KEY,
  patient_id uuid NOT NULL REFERENCES public.patients(user_id) ON DELETE CASCADE,
  provider text NOT NULL,
  policy_number text NOT NULL,
  is_active boolean DEFAULT true
);

-- 7. Enable RLS for the new tables
ALTER TABLE public.medical_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_details ENABLE ROW LEVEL SECURITY;

-- 8. Create policies for medical_documents
CREATE POLICY "Patients can view their own documents" ON public.medical_documents
  FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients can insert their own documents" ON public.medical_documents
  FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Patients can delete their own documents" ON public.medical_documents
  FOR DELETE USING (auth.uid() = patient_id);

-- 9. Create policies for insurance_details
CREATE POLICY "Patients can view their own insurance details" ON public.insurance_details
  FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients can insert their own insurance details" ON public.insurance_details
  FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Patients can update their own insurance details" ON public.insurance_details
  FOR UPDATE USING (auth.uid() = patient_id);
CREATE POLICY "Patients can delete their own insurance details" ON public.insurance_details
  FOR DELETE USING (auth.uid() = patient_id);
