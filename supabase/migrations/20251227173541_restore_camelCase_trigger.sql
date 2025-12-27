-- 1. Drop the incorrect trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Recreate the function with correct multi-role logic and camelCase keys
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_role text := new.raw_user_meta_data->>'role';
  full_name text := new.raw_user_meta_data->>'fullName';
  phone text := new.raw_user_meta_data->>'phone';
  location text := new.raw_user_meta_data->>'location';
  specialization text := new.raw_user_meta_data->>'specialization';
  license_number text := new.raw_user_meta_data->>'licenseNumber';
  pharmacy_name text := new.raw_user_meta_data->>'pharmacyName';
  vehicle_type text := new.raw_user_meta_data->>'vehicleType';
  business_name text := new.raw_user_meta_data->>'businessName';
BEGIN
  IF user_role IS NULL OR user_role = '' THEN
    user_role := 'patient';
  END IF;

  IF NOT (user_role = ANY (enum_range(NULL::public.app_role)::text[])) THEN
    RAISE EXCEPTION 'Invalid user role: %', user_role;
  END IF;

  BEGIN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, user_role::public.app_role);

    CASE user_role
      WHEN 'patient' THEN
        INSERT INTO public.patients (user_id, full_name, phone, location)
        VALUES (new.id, COALESCE(full_name, new.email), COALESCE(phone, 'N/A'), COALESCE(location, 'N/A'));
      WHEN 'doctor' THEN
        INSERT INTO public.doctors (user_id, full_name, phone, specialization, license_number)
        VALUES (new.id, COALESCE(full_name, new.email), COALESCE(phone, 'N/A'), COALESCE(specialization, 'N/A'), COALESCE(license_number, 'N/A'));
      WHEN 'vendor' THEN
        INSERT INTO public.vendors (user_id, pharmacy_name, owner_name, phone, location)
        VALUES (new.id, COALESCE(pharmacy_name, 'N/A'), COALESCE(full_name, new.email), COALESCE(phone, 'N/A'), COALESCE(location, 'N/A'));
      WHEN 'delivery_rider' THEN
        INSERT INTO public.delivery_riders (user_id, full_name, phone, vehicle_type)
        VALUES (new.id, COALESCE(full_name, new.email), COALESCE(phone, 'N/A'), COALESCE(vehicle_type, 'N/A'));
      WHEN 'kiosk_partner' THEN
        INSERT INTO public.kiosk_partners (user_id, business_name, owner_name, phone, location)
        VALUES (new.id, COALESCE(business_name, 'N/A'), COALESCE(full_name, new.email), COALESCE(phone, 'N/A'), COALESCE(location, 'N/A'));
      ELSE
        NULL;
    END CASE;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'Error in handle_new_user: %', SQLERRM;
      RAISE;
  END;

  RETURN new;
END;
$$;

-- 3. Re-attach the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
