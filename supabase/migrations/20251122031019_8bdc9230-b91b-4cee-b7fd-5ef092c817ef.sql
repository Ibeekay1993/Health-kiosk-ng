-- Add remaining roles
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'app_role' AND e.enumlabel = 'vendor') THEN
    ALTER TYPE app_role ADD VALUE 'vendor';
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'app_role' AND e.enumlabel = 'delivery_rider') THEN
    ALTER TYPE app_role ADD VALUE 'delivery_rider';
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'app_role' AND e.enumlabel = 'kiosk_partner') THEN
    ALTER TYPE app_role ADD VALUE 'kiosk_partner';
  END IF;
END $$;