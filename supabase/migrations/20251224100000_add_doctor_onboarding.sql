
-- Drop the existing policies and table to avoid conflicts
DROP POLICY IF EXISTS "Doctors can create their own profile" ON doctors;
DROP POLICY IF EXISTS "Doctors can view their own profile" ON doctors;
DROP POLICY IF EXISTS "Admins can manage doctor profiles" ON doctors;
DROP POLICY IF EXISTS "Authenticated users can view doctors" ON doctors;
DROP TABLE IF EXISTS doctors CASCADE;

-- Create a new doctors table with an onboarding status
CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    full_name TEXT,
    phone TEXT,
    specialization TEXT,
    license_number TEXT,
    status TEXT NOT NULL DEFAULT 'pending_profile', -- [pending_profile, pending_documents, pending_referees, pending_interview, pending_review, approved, rejected]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

-- Create policies for the new doctors table
CREATE POLICY "Doctors can create their own profile" 
ON doctors FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Doctors can view and update their own profile during onboarding" 
ON doctors FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Doctors can update their own profile"
ON doctors FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all doctor profiles" 
ON doctors FOR ALL 
USING (has_role(auth.uid(), 'admin'));

-- Function to handle new user registration and create a doctor profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the new user has a doctor role
  IF EXISTS (
    SELECT 1
    FROM tbl_user_roles
    WHERE user_id = NEW.id AND role = 'doctor'
  ) THEN
    -- Insert a new entry into the doctors table
    INSERT INTO public.doctors (user_id, full_name, status)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'pending_profile');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the function after a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
