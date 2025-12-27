
-- Add avatar_url to profiles table
ALTER TABLE public.profiles
ADD COLUMN avatar_url TEXT;

-- Allow users to update their own avatar_url
CREATE POLICY "Users can update their own avatar" 
ON storage.objects FOR UPDATE
USING ( auth.uid() = owner );
