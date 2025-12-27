
-- 1. Create a table to manage sequences for custom IDs
CREATE TABLE IF NOT EXISTS public.id_sequences (
  role_prefix TEXT PRIMARY KEY,
  last_value INT NOT NULL DEFAULT 0
);

-- 2. Insert initial prefixes for each role if they don't exist
INSERT INTO public.id_sequences (role_prefix, last_value) VALUES
  ('HKP', 0), -- Patient
  ('HKD', 0), -- Doctor
  ('HKV', 0), -- Vendor
  ('HKR', 0), -- Delivery Rider
  ('HKK', 0)  -- Kiosk Partner
ON CONFLICT (role_prefix) DO NOTHING;

-- 3. Create a function to generate the next custom ID for a given role
CREATE OR REPLACE FUNCTION public.generate_custom_id(p_role_prefix TEXT)
RETURNS TEXT AS $$
DECLARE
  new_id_value INT;
  new_custom_id TEXT;
BEGIN
  -- Lock the sequence row to prevent race conditions, and get the new value
  SELECT last_value + 1
  INTO new_id_value
  FROM public.id_sequences
  WHERE role_prefix = p_role_prefix
  FOR UPDATE;

  -- Update the sequence value
  UPDATE public.id_sequences
  SET last_value = new_id_value
  WHERE role_prefix = p_role_prefix;

  -- Format the new ID
  new_custom_id := p_role_prefix || '-' || LPAD(new_id_value::TEXT, 4, '0');

  RETURN new_custom_id;
END;
$$ LANGUAGE plpgsql VOLATILE;


-- 4. Add 'custom_id' column to role tables
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS custom_id TEXT UNIQUE;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS custom_id TEXT UNIQUE;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS custom_id TEXT UNIQUE;
ALTER TABLE public.delivery_riders ADD COLUMN IF NOT EXISTS custom_id TEXT UNIQUE;
ALTER TABLE public.kiosk_partners ADD COLUMN IF NOT EXISTS custom_id TEXT UNIQUE;


-- 5. Modify the handle_new_user function to generate and set the custom_id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_role TEXT;
  v_full_name TEXT;
  v_phone TEXT;
  v_location TEXT;
  v_specialization TEXT;
  v_license_number TEXT;
  v_pharmacy_name TEXT;
  v_vehicle_type TEXT;
  v_business_name TEXT;
  new_custom_id TEXT;
BEGIN
  -- Extract metadata
  v_user_role := new.raw_user_meta_data->>'role';
  v_full_name := new.raw_user_meta_data->>'fullName';
  v_phone := new.raw_user_meta_data->>'phone';
  v_location := new.raw_user_meta_data->>'location';
  v_specialization := new.raw_user_meta_data->>'specialization';
  v_license_number := new.raw_user_meta_data->>'licenseNumber';
  v_pharmacy_name := new.raw_user_meta_data->>'pharmacyName';
  v_vehicle_type := new.raw_user_meta_data->>'vehicleType';
  v_business_name := new.raw_user_meta_data->>'businessName';

  -- Create a role-specific profile
  CASE v_user_role
    WHEN 'patient' THEN
      new_custom_id := public.generate_custom_id('HKP');
      INSERT INTO public.patients (user_id, custom_id, full_name, phone, location)
      VALUES (new.id, new_custom_id, v_full_name, v_phone, v_location);
    WHEN 'doctor' THEN
      new_custom_id := public.generate_custom_id('HKD');
      INSERT INTO public.doctors (user_id, custom_id, full_name, phone, specialization, license_number)
      VALUES (new.id, new_custom_id, v_full_name, v_phone, v_specialization, v_license_number);
    WHEN 'vendor' THEN
      new_custom_id := public.generate_custom_id('HKV');
      INSERT INTO public.vendors (user_id, custom_id, pharmacy_name, owner_name, phone, location)
      VALUES (new.id, new_custom_id, v_pharmacy_name, v_full_name, v_phone, v_location);
    WHEN 'delivery_rider' THEN
      new_custom_id := public.generate_custom_id('HKR');
      INSERT INTO public.delivery_riders (user_id, custom_id, full_name, phone, vehicle_type)
      VALUES (new.id, new_custom_id, v_full_name, v_phone, v_vehicle_type);
    WHEN 'kiosk_partner' THEN
      new_custom_id := public.generate_custom_id('HKK');
      INSERT INTO public.kiosk_partners (user_id, custom_id, business_name, owner_name, phone, location)
      VALUES (new.id, new_custom_id, v_business_name, v_full_name, v_phone, v_location);
  END CASE;

  -- Add role to user_roles table
  IF v_user_role IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, v_user_role::app_role)
    ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;
  END IF;

  -- Update the profiles table
  UPDATE public.profiles
  SET full_name = v_full_name,
      phone = v_phone,
      location = v_location,
      role = v_user_role::app_role,
      updated_at = now()
  WHERE id = new.id;

  RETURN new;
END;
$$;
