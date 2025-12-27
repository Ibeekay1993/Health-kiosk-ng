-- This migration refactors the user signup process to use an Edge Function
-- for profile creation, making the auth trigger simpler and more robust.

-- STEP 1: (As before) Ensure RLS is disabled on role tables so the new Edge Function can insert data.
-- Note: The service_role_key used by the function bypasses RLS, but this is a safeguard.
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_riders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.kiosk_partners DISABLE ROW LEVEL SECURITY;

-- STEP 2: Drop the previous, overly complex trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- STEP 3: Create the new, simplified trigger function that ONLY inserts the role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert only the user role into the user_roles table.
  -- The detailed profile creation is now handled by the 'create-user-profile' Edge Function.
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'role'
  );
  RETURN NEW;
END;
$$;

-- STEP 4: Recreate the trigger to use the new, simple function
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_user();
