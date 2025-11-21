-- Fix missing RLS policies for user_roles table
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Fix missing RLS policies for vitals table
CREATE POLICY "Users can view own vitals"
  ON public.vitals FOR SELECT
  USING (
    patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()) OR
    public.has_role(auth.uid(), 'doctor') OR
    public.has_role(auth.uid(), 'admin')
  );

-- Fix missing policies for profiles
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Fix missing INSERT/UPDATE/DELETE policies for patients
CREATE POLICY "Kiosk partners can insert patients"
  ON public.patients FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'kiosk_partner') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Doctors and admins can update patients"
  ON public.patients FOR UPDATE
  USING (public.has_role(auth.uid(), 'doctor') OR public.has_role(auth.uid(), 'admin'));

-- Fix missing INSERT policies for consultations
CREATE POLICY "Patients can create consultations"
  ON public.consultations FOR INSERT
  WITH CHECK (
    patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid())
  );

CREATE POLICY "Doctors can update consultations"
  ON public.consultations FOR UPDATE
  USING (doctor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Fix missing INSERT policy for chat_messages
CREATE POLICY "Users can send messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid() AND
    (
      EXISTS (
        SELECT 1 FROM public.consultations c
        WHERE c.id = consultation_id
        AND (c.patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()) OR c.doctor_id = auth.uid())
      ) OR public.has_role(auth.uid(), 'admin')
    )
  );

-- Fix missing INSERT policy for appointments
CREATE POLICY "Patients can create appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (
    patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()) OR
    public.has_role(auth.uid(), 'kiosk_partner') OR
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Users can update own appointments"
  ON public.appointments FOR UPDATE
  USING (
    patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()) OR
    doctor_id = auth.uid() OR
    public.has_role(auth.uid(), 'admin')
  );