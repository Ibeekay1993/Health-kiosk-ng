
-- Create doctor-specific tables
CREATE TABLE IF NOT EXISTS doctors (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  full_name TEXT,
  phone TEXT,
  specialization TEXT,
  license_number TEXT,
  status TEXT DEFAULT 'pending_profile'
);

CREATE TABLE IF NOT EXISTS doctor_referees (
  id BIGSERIAL PRIMARY KEY,
  doctor_id UUID REFERENCES auth.users(id),
  name TEXT,
  email TEXT,
  phone TEXT
);

-- Secure doctor tables with RLS policies
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Doctors can view their own profile" ON doctors;
CREATE POLICY "Doctors can view their own profile" ON doctors FOR SELECT USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Doctors can update their own profile" ON doctors;
CREATE POLICY "Doctors can update their own profile" ON doctors FOR UPDATE USING (user_id = auth.uid());


-- Function to create a profile and doctor entry on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a public profile for all new users
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'role');

  -- If the new user is a doctor, create a doctor-specific entry
  IF new.raw_user_meta_data->>'role' = 'doctor' THEN
    INSERT INTO public.doctors (user_id, full_name, status)
    VALUES (new.id, new.raw_user_meta_data->>'full_name', 'pending_profile');
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users; -- Drop old trigger if it exists
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
