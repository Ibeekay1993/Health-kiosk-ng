-- Add new roles to app_role enum (one at a time in separate transaction)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'app_role' AND e.enumlabel = 'patient') THEN
    ALTER TYPE app_role ADD VALUE 'patient';
  END IF;
END $$;