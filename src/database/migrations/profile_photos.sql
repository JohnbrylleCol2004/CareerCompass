-- Run once in your project's Supabase SQL Editor before uploading profile photos.
BEGIN;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_image_path TEXT;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('profile-photos', 'profile-photos', false, 5242880, ARRAY['image/jpeg'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users upload their own profile photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = (SELECT auth.uid())::text);

CREATE POLICY "Users read their own profile photos"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = (SELECT auth.uid())::text);

-- The existing profiles SELECT/UPDATE policies must allow users to access their own row.
NOTIFY pgrst, 'reload schema';
COMMIT;
