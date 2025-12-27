--
-- Add RLS policies for the profiles table
--

-- 1. Enable RLS for the table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Create a policy for inserting new profiles
-- This policy allows any user to insert a profile for themselves.
CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3. Create a policy for viewing profiles
-- This policy allows users to view their own profile.
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

-- 4. Create a policy for updating profiles
-- This policy allows users to update their own profile.
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5. Create a policy for deleting profiles
-- This policy allows users to delete their own profile.
CREATE POLICY "Users can delete their own profile" 
ON public.profiles FOR DELETE
USING (auth.uid() = user_id);
