CREATE TYPE public.user_role AS ENUM ('admin', 'doctor', 'patient');
ALTER TABLE public.profiles
ALTER COLUMN role TYPE public.user_role USING (role::public.user_role);
