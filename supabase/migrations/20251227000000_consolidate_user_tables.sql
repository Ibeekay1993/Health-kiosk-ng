DROP TABLE IF EXISTS public.profiles CASCADE;

DROP TYPE IF EXISTS public.user_role CASCADE;

-- Create a new user_role enum
CREATE TYPE
  public.user_role AS ENUM (
    'patient',
    'doctor',
    'vendor',
    'delivery_rider',
    'kiosk_partner',
    'admin'
  );

-- Create a consolidated profiles table
CREATE TABLE
  public.profiles (
    id uuid NOT NULL DEFAULT gen_random_uuid () UNIQUE,
    user_id uuid NOT NULL UNIQUE,
    email character varying NOT NULL UNIQUE,
    role user_role NOT NULL DEFAULT 'patient'::user_role,
    full_name text NULL,
    phone text NULL,
    location character varying NULL,
    specialization text NULL,
    license_number text NULL,
    pharmacy_name text NULL,
    vehicle_type text NULL,
    business_name text NULL,
    avatar_url text NULL,
    updated_at timestamp with time zone NULL,
    CONSTRAINT profiles_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON UPDATE CASCADE ON DELETE CASCADE
  );

-- Drop the old tables
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS vendors CASCADE;
DROP TABLE IF EXISTS delivery_riders CASCADE;
DROP TABLE IF EXISTS kiosk_partners CASCADE;

-- And the user_roles table
DROP TABLE IF EXISTS user_roles CASCADE;

-- RLS Policies for the new profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR
SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT
WITH
  CHECK (auth.uid () = user_id);

CREATE POLICY "Users can update own profile." ON public.profiles FOR
UPDATE USING (auth.uid () = user_id);
