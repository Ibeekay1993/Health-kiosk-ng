
-- Step 1: Drop the old trigger function and trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 2: Recreate the trigger function (Correct Version)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id,
    email,
    full_name,
    phone,
    location,
    role,
    specialization,
    license_number,
    pharmacy_name,
    vehicle_type,
    business_name,
    created_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'location',
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient'),
    NEW.raw_user_meta_data->>'specialization',
    NEW.raw_user_meta_data->>'license_number',
    NEW.raw_user_meta_data->>'pharmacy_name',
    NEW.raw_user_meta_data->>'vehicle_type',
    NEW.raw_user_meta_data->>'business_name',
    now()
  );

  RETURN NEW;
END;
$$;

-- Step 3: Re-attach the trigger
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
