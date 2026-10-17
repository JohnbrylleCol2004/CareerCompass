BEGIN;
CREATE TABLE IF NOT EXISTS public.career_ai_usage (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  usage_day date NOT NULL,
  interview_requests integer NOT NULL DEFAULT 0,
  resume_requests integer NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, usage_day)
);
ALTER TABLE public.career_ai_usage ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.career_ai_usage FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.consume_career_ai_quota(p_user_id uuid, p_feature text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  today date := (now() AT TIME ZONE 'UTC')::date;
  used_interview integer;
  used_resume integer;
  project_total bigint;
BEGIN
  IF p_user_id IS NULL OR p_feature NOT IN ('interview', 'resume') OR p_feature IS NULL THEN RETURN false; END IF;
  -- Serialize the shared project quota as well as the per-user counters.
  PERFORM pg_catalog.pg_advisory_xact_lock(734251609);
  SELECT coalesce(sum(interview_requests + resume_requests), 0) INTO project_total
    FROM public.career_ai_usage WHERE usage_day = today;
  IF project_total >= 300 THEN RETURN false; END IF;
  INSERT INTO public.career_ai_usage (user_id, usage_day) VALUES (p_user_id, today)
    ON CONFLICT (user_id, usage_day) DO NOTHING;
  SELECT interview_requests, resume_requests INTO used_interview, used_resume
    FROM public.career_ai_usage WHERE user_id = p_user_id AND usage_day = today;
  IF (p_feature = 'interview' AND used_interview >= 30)
    OR (p_feature = 'resume' AND used_resume >= 3) THEN RETURN false; END IF;
  UPDATE public.career_ai_usage SET
    interview_requests = interview_requests + CASE WHEN p_feature = 'interview' THEN 1 ELSE 0 END,
    resume_requests = resume_requests + CASE WHEN p_feature = 'resume' THEN 1 ELSE 0 END
    WHERE user_id = p_user_id AND usage_day = today;
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.consume_career_ai_quota(uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_career_ai_quota(uuid, text) TO service_role;
NOTIFY pgrst, 'reload schema';
COMMIT;
