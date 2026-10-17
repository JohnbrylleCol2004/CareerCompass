# Gemini setup for CareerCompass

Both Interview Coach and Resume Analyzer call the `career-ai` Supabase Edge Function. It verifies the student's Supabase Auth token, loads only career-related profile context, enforces server-side limits, and calls the Google Gemini API using `gemini-3.5-flash-lite`. The Gemini key and Supabase service-role key never belong in the mobile app.

## 1. Create a Gemini API key

Open [Google AI Studio](https://aistudio.google.com/apikey), create/select a project, and create an API key. Keep the project on the Free Tier to test without setting up paid billing. Gemini 3.5 Flash-Lite is currently listed with free-tier access, subject to project eligibility, region, and quotas. Check its availability in your AI Studio project.

Google now limits access to Gemini 2.5 models to established users. This integration uses the stable `gemini-3.5-flash-lite` model for new projects; it supports PDF inputs and structured responses. See [model documentation](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash-lite) and [model availability guidance](https://ai.google.dev/gemini-api/docs/deprecations).

Free-tier inputs and outputs may be used to improve Google products. Use fictional interview answers and sample resumes for testing. Paid usage has separate billing and data-use terms; do not enable it unless you intend to pay for API requests. See [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing) and [billing](https://ai.google.dev/gemini-api/docs/billing).

## 2. Install database usage limits

In the Supabase project used by `EXPO_PUBLIC_SUPABASE_URL`, open **SQL Editor** and run all of:

`supabase/migrations/202610160001_career_ai_quota.sql`

This adds usage counters and a service-role-only quota function. It does not change the `profiles` table or its policies. `profiles.id` must match the Auth user ID, and authenticated users need permission to read their own profile.

Default limits reset at midnight UTC:

- 30 interview requests per student per day (generation and feedback combined).
- 3 resume analyses per student per day.
- 300 AI requests across the project per day.

Counts are atomic, persist across app reinstalls, and attempts that reach Gemini count even if Gemini fails. These request limits are not dollar spending caps. To change them, edit and rerun the SQL function. Usage records contain only user IDs, dates, and counts; review or prune old counters according to your retention needs.

## 3. Save your API key in Supabase

Under **Edge Functions → Secrets**, add:

`GEMINI_API_KEY` = your Google AI Studio API key

Never paste your key into chat, source code, or an `EXPO_PUBLIC_*` variable. Supabase supplies `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` inside hosted Edge Functions; do not copy the service key into the mobile `.env`.

## 4. Deploy

From the `CareerCompass` folder in PowerShell:

```powershell
npx.cmd supabase login
npx.cmd supabase functions deploy career-ai --project-ref YOUR_PROJECT_REF
```

Replace `YOUR_PROJECT_REF` with your Supabase project reference. Use the same project as the mobile app. Deployment reads `supabase/config.toml`. Gateway JWT verification is disabled to support current Supabase JWT configurations, but the handler explicitly verifies every bearer token using Supabase Auth before loading profiles or calling Gemini. Keep that verification in place.

No extra mobile native package was added for this integration. Reload the app for local development, or rebuild your installed APK to include these screen changes.

## 5. Test on your device

1. Sign in and set your program/course and career target in Profile.
2. Open Interview Coach, tap **Generate 5 AI Questions**, write an answer, and tap **Get AI Feedback**. Check that Previous/Next preserves each answer and feedback, and editing an answer removes its stale feedback.
3. Open Resume Analyzer and choose a short, unencrypted PDF resume (up to 10 MB). Tap **Analyze Resume**. Confirm feedback refers to its actual content. Test with a different resume; results should change. An unrelated PDF should get a document warning.
4. Turn off Wi-Fi and mobile data. AI actions should show the designed connection warning. Built-in interview questions remain available offline.
5. Check Supabase Function logs and Google AI Studio usage for status/errors. Never add request-body, PDF, answer, token, or secret logging.

Setup errors are shown in the app. A missing migration fails closed before calling Gemini. Gemini quota or access failures, invalid PDFs, refusals, timeouts, and incomplete model responses do not produce mock successful results. There are no automatic paid retries; try again explicitly when appropriate.

## Data and limitations

Only `program`, `career_target`, `interests`, and `technologies` are included as profile context. Interview feedback includes the question and answer. Resume analysis sends the entire selected PDF, which may include personal information. Each screen explains this before the user starts the request.

PDFs are sent inline to Gemini without uploading to Supabase Storage or the Gemini Files API. The picker may keep a temporary local copy in the app cache. The function does not log PDFs or answers. Provider processing and retention follow [Gemini API terms](https://ai.google.dev/gemini-api/terms); free-tier inputs and outputs may be used to improve Google products. Results and interview answers are kept in screen memory only. No analysis history or automatic offline synchronization is implemented.

PDF extension, size, Base64 encoding, and signature are checked on the server. Document parsing is performed by Gemini; damaged, encrypted, or excessively long PDFs may be rejected. A resume score is coaching guidance, not an ATS test or hiring probability. Review AI suggestions and replace placeholders with real experience.

## Automated checks

```powershell
node --test supabase/functions/career-ai/handler.test.mjs
node --test tests/authRegistration.test.cjs
node --test tests/careerAiService.test.cjs
```

These use mock network responses and do not consume API credits. A real end-to-end test requires the SQL migration, Supabase deployment, and a Gemini key with access to this model; local tests do not verify your deployed database policies or Gemini access.

References: [Gemini content generation](https://ai.google.dev/api/generate-content), [PDF inputs](https://ai.google.dev/gemini-api/docs/document-processing), [structured outputs](https://ai.google.dev/gemini-api/docs/structured-output), [Supabase secrets](https://supabase.com/docs/guides/functions/secrets).

If you previously deployed the OpenAI version, add `GEMINI_API_KEY` and redeploy `career-ai`. The previous `OPENAI_API_KEY` is no longer read; you can remove that unused secret from Supabase. Existing usage counters and SQL policies continue to work without a new migration. Gemini's project quotas apply in addition to the app's limits, so a free-tier quota may be reached sooner.
