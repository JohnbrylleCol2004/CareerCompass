# Gemini setup for CareerCompass

Interview Coach, its completed-set assessment, and Resume Analyzer call the mobile-only `career-ai-mobile` Supabase Edge Function. The web app owns the separate `career-ai` function in the same project. Their request and response contracts differ; deploying the mobile code as `career-ai` overwrites the web function. The mobile function verifies the student's Supabase Auth token, loads only career-related profile context, enforces server-side limits, and calls the Google Gemini API using `gemini-3.5-flash-lite` first. For interview requests, an HTTP 503 triggers one attempt with `gemini-3.8-flash`. The Gemini key and Supabase service-role key never belong in the mobile app.

## 1. Create a Gemini API key

Open [Google AI Studio](https://aistudio.google.com/apikey), create/select a project, and create an API key. Keep the project on the Free Tier to test without setting up paid billing. Gemini 3.5 Flash-Lite is currently listed with free-tier access, subject to project eligibility, region, and quotas. Check its availability in your AI Studio project.

Google now limits access to Gemini 2.5 models to established users. This integration uses the stable `gemini-3.5-flash-lite` model first; it supports PDF inputs and structured responses. Interview requests can fall back to the stable `gemini-3.8-flash` model, which also supports structured responses. Access to either model depends on the project. See [Flash-Lite documentation](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash-lite), [Flash documentation](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash), and [model availability guidance](https://ai.google.dev/gemini-api/docs/deprecations).

Free-tier inputs and outputs may be used to improve Google products. Use fictional interview answers and sample resumes for testing. Paid usage has separate billing and data-use terms; do not enable it unless you intend to pay for API requests. See [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing) and [billing](https://ai.google.dev/gemini-api/docs/billing).

## 2. Install database usage limits

From the `CareerCompass` folder, apply the quota migration to the same Supabase project used by `EXPO_PUBLIC_SUPABASE_URL`:

```powershell
npx.cmd supabase db push --dry-run --remote=YOUR_PROJECT_REF
npx.cmd supabase db push --remote=YOUR_PROJECT_REF
```

The migration is [`supabase/migrations/20261110000000_career_ai_quota.sql`](migrations/20261110000000_career_ai_quota.sql). Replace `YOUR_PROJECT_REF` with the project reference from the app's Supabase URL. Check that the dry run lists only the expected migration, then confirm the push. If the CLI reports that this migration was already applied, do not run the SQL again.

This adds usage counters and a service-role-only quota function. It does not change the `profiles` table or its policies. `profiles.id` must match the Auth user ID, and authenticated users need permission to read their own profile.

Default app limits reset at midnight UTC (8:00 AM Philippine time). When the app limit is reached, the mobile function shows the next reset date and time:

- 30 interview requests per student per day (generation, feedback, and completed-set assessment combined).
- 3 resume analyses per student per day.
- 300 AI requests across the project per day.

Counts are atomic, persist across app reinstalls, and are shared by the web and mobile functions in this Supabase project. Attempts that reach Gemini count even if Gemini fails. These request limits are not dollar spending caps. To change them, edit and rerun the SQL function. Usage records contain only user IDs, dates, and counts; review or prune old counters according to your retention needs.

## 3. Save your API key in Supabase

Under **Edge Functions → Secrets**, add:

`GEMINI_API_KEY` = your Google AI Studio API key

Never paste your key into chat, source code, or an `EXPO_PUBLIC_*` variable. Supabase supplies `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` inside hosted Edge Functions; do not copy the service key into the mobile `.env`.

## 4. Deploy

From the `CareerCompass` folder in PowerShell:

```powershell
npx.cmd supabase login
npx.cmd supabase functions deploy career-ai-mobile --remote=YOUR_PROJECT_REF
```

Replace `YOUR_PROJECT_REF` with your Supabase project reference. Use the same project as the mobile app. Deployment reads `supabase/config.toml`. Gateway JWT verification is disabled to support current Supabase JWT configurations, but the handler explicitly verifies every bearer token using Supabase Auth before loading profiles or calling Gemini. Keep that verification in place.

Deploy `career-ai-mobile` before releasing a mobile app update. Do not deploy `career-ai` from this repository; that name belongs to the web app. Existing installed mobile versions still call `career-ai` until updated and may receive the web response contract. Because this change updates the app's function name, those installations need an app update or rebuild. Later backend-only updates to `career-ai-mobile` do not require a new APK.

If the last `career-ai` deployment came from this mobile repository, redeploy the web implementation from the web repository to restore its five-question and module-context contract. The mobile and web functions then run side by side.

If Interview Coach reports `Question, answer and module context are required.`, that app version is still calling the web function. Update the mobile app to invoke `career-ai-mobile`; its feedback request sends `action`, `question`, and `answer` and does not send a module context field.

## 5. Test on your device

1. Sign in and set your program/course and career target in Profile.
2. Open Interview Coach, tap **Generate 20 AI Questions**, write an answer, and tap **Get AI Feedback**. Check that Previous/Next preserves each answer and feedback, and editing an answer removes its stale feedback.
   Answer all 20 questions and tap **Assess answers for Skill Gap and Careers**. Check that Skill Gap shows area evidence and Careers suggests paths only where the answers provide enough evidence. Restart the app to check that the derived findings remain available without the raw answers.
3. Open Resume Analyzer and choose a short, unencrypted PDF resume (up to 10 MB). Tap **Analyze Resume**. Confirm feedback refers to its actual content. Test with a different resume; results should change. An unrelated PDF should get a document warning.
4. Turn off Wi-Fi and mobile data. AI actions should show the designed connection warning. Built-in interview questions remain available offline.
5. Check Supabase Function logs and Google AI Studio usage for status/errors. Never add request-body, PDF, answer, token, or secret logging.

Setup errors are shown in the app. A missing migration fails closed before calling Gemini. Gemini quota or access failures, invalid PDFs, refusals, timeouts, and incomplete model responses do not produce mock successful results. The displayed reset time applies only to the app's UTC daily limit; Gemini's own rate limits and HTTP 503 outages have no guaranteed recovery time. Interview question generation, feedback, and completed-set assessment try `gemini-3.8-flash` once when `gemini-3.5-flash-lite` returns HTTP 503. This can make a second Gemini API request, while consuming the app's daily quota only once; the provider may count or bill each model request separately. Resume analysis and other failures are not retried automatically. If both models are unavailable, try again later.

## Data and limitations

Only `program`, `career_target`, `interests`, and `technologies` are included as profile context. Interview feedback includes the question and answer. Completed-set assessment sends all 20 questions and answers in one request. Resume analysis sends the entire selected PDF, which may include personal information. Each screen explains this before the user starts the request.

PDFs are sent inline to Gemini without uploading to Supabase Storage or the Gemini Files API. The picker may keep a temporary local copy in the app cache. The function does not log PDFs or answers. Provider processing and retention follow [Gemini API terms](https://ai.google.dev/gemini-api/terms); free-tier inputs and outputs may be used to improve Google products. Raw interview answers and resume results stay in screen memory. Completed-set assessment saves only derived area levels, question numbers, and short notes on the device under the signed-in user ID. This is device-local storage, with no cloud sync or history.

PDF extension, size, Base64 encoding, and signature are checked on the server. Document parsing is performed by Gemini; damaged, encrypted, or excessively long PDFs may be rejected. A resume score is coaching guidance, not an ATS test or hiring probability. Review AI suggestions and replace placeholders with real experience.

## Automated checks

```powershell
node --test supabase/functions/career-ai-mobile/handler.test.mjs
node --test tests/authRegistration.test.cjs
node --test tests/careerAiService.test.cjs
```

These use mock network responses and do not consume API credits. A real end-to-end test requires the SQL migration, Supabase deployment, and a Gemini key with access to this model; local tests do not verify your deployed database policies or Gemini access.

References: [Gemini content generation](https://ai.google.dev/api/generate-content), [PDF inputs](https://ai.google.dev/gemini-api/docs/document-processing), [structured outputs](https://ai.google.dev/gemini-api/docs/structured-output), [Supabase secrets](https://supabase.com/docs/guides/functions/secrets).

If you previously deployed the OpenAI version, add `GEMINI_API_KEY` and deploy `career-ai-mobile`. The previous `OPENAI_API_KEY` is no longer read by the mobile function; check whether the web function still needs it before removing that secret. Existing usage counters and SQL policies continue to work without a new migration. Gemini's project quotas apply in addition to the app's limits, so a free-tier quota may be reached sooner.
