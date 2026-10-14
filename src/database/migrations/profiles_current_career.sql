-- Run in the Supabase SQL Editor for the project used by the app.
-- The mobile app uses public.profiles, not the legacy student_profiles table.
BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles'
      AND column_name = 'current_career'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'profiles'
        AND column_name = 'current_carreer'
    ) THEN
      ALTER TABLE public.profiles
        RENAME COLUMN current_carreer TO current_career;
    ELSE
      ALTER TABLE public.profiles
        ADD COLUMN current_career VARCHAR(150);
    END IF;
  END IF;
END
$$;

NOTIFY pgrst, 'reload schema';
COMMIT;

-- Verify the column is available after the repair.
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
  AND column_name = 'current_career';
