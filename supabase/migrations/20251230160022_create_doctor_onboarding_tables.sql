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
