
-- 1. Create the enum for doctor specializations
CREATE TYPE public.doctor_specialization AS ENUM (
    'Cardiology',
    'Dermatology',
    'Endocrinology',
    'Gastroenterology',
    'General Practice',
    'Neurology',
    'Oncology',
    'Pediatrics',
    'Psychiatry',
    'Urology',
    'Obstetrics and Gynecology',
    'Ophthalmology',
    'Orthopedics',
    'Otolaryngology (ENT)',
    'Pulmonology',
    'Nephrology',
    'Rheumatology',
    'Anesthesiology',
    'Radiology',
    'Emergency Medicine'
);

-- 2. Alter the doctors table to use the new enum
ALTER TABLE public.doctors
  ALTER COLUMN specialization TYPE public.doctor_specialization
  USING specialization::public.doctor_specialization;
