-- Run in the Supabase SQL Editor for the project used by the app.
-- Keeps RLS enabled. The app must have a signed-in session before writing profiles.
BEGIN;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;

DROP POLICY IF EXISTS "careercompass_read_own_profile" ON public.profiles;
CREATE POLICY "careercompass_read_own_profile" ON public.profiles
  FOR SELECT TO authenticated USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "careercompass_insert_own_profile" ON public.profiles;
CREATE POLICY "careercompass_insert_own_profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "careercompass_update_own_profile" ON public.profiles;
CREATE POLICY "careercompass_update_own_profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = id) WITH CHECK ((SELECT auth.uid()) = id);
COMMIT;

-- Inspect any other policies, especially restrictive policies that can still block access.
SELECT policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles';
