DROP TABLE IF EXISTS doctors CASCADE;

CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    specialization TEXT,
    license_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can create their own profile" ON doctors FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Doctors can view their own profile" ON doctors FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can manage doctor profiles" ON doctors FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated users can view doctors" ON doctors FOR SELECT TO authenticated; 
