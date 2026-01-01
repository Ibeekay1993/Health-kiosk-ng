
CREATE TABLE triage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    patient_id UUID NOT NULL REFERENCES profiles(id),
    symptoms TEXT,
    status TEXT NOT NULL DEFAULT 'pending' -- e.g., pending, in-progress, completed
);

ALTER TABLE triage REPLICA IDENTITY FULL;
