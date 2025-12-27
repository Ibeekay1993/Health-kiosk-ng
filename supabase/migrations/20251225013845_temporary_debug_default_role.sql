
-- 2. Create the function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Create a user role and a role-specific profile in a single transaction
  BEGIN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'patient');

    INSERT INTO public.patients (user_id, full_name, phone, location)
    VALUES (new.id, COALESCE(new.raw_user_meta_data->>'fullName', new.email), COALESCE(new.raw_user_meta_data->>'phone', 'N/A'), COALESCE(new.raw_user_meta_data->>'location', 'N/A'));

  EXCEPTION
    WHEN OTHERS THEN
      -- Log the error and re-raise the exception
      RAISE NOTICE 'Error in handle_new_user: %', SQLERRM;
      RAISE;
  END;

  RETURN new;
END;
$$;

-- 3. Create the trigger to execute the function on new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
