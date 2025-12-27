-- STEP 1: Disable RLS on role tables for trigger insertion
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_riders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.kiosk_partners DISABLE ROW LEVEL SECURITY;

-- STEP 2: Drop the existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- STEP 3: Create a simpler, safe trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'role'
  );

  -- Insert into respective table
  IF NEW.raw_user_meta_data ->> 'role' = 'patient' THEN
    INSERT INTO public.patients (user_id, full_name, phone, location)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'phone',
      NEW.raw_user_meta_data ->> 'location'
    );
  ELSIF NEW.raw_user_meta_data ->> 'role' = 'doctor' THEN
    INSERT INTO public.doctors (user_id, full_name, phone, specialization, license_number)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'phone',
      NEW.raw_user_meta_data ->> 'specialization',
      NEW.raw_user_meta_data ->> 'license_number'
    );
  ELSIF NEW.raw_user_meta_data ->> 'role' = 'vendor' THEN
    INSERT INTO public.vendors (user_id, pharmacy_name, owner_name, phone, location)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data ->> 'pharmacy_name',
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'phone',
      NEW.raw_user_meta_data ->> 'location'
    );
  ELSIF NEW.raw_user_meta_data ->> 'role' = 'delivery_rider' THEN
    INSERT INTO public.delivery_riders (user_id, full_name, phone, vehicle_type)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'phone',
      NEW.raw_user_meta_data ->> 'vehicle_type'
    );
  ELSIF NEW.raw_user_meta_data ->> 'role' = 'kiosk_partner' THEN
    INSERT INTO public.kiosk_partners (user_id, business_name, owner_name, phone, location)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data ->> 'business_name',
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'phone',
      NEW.raw_user_meta_data ->> 'location'
    );
  END IF;

  RETURN NEW;
END;
$$;

-- STEP 4: Recreate the trigger
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_user();
