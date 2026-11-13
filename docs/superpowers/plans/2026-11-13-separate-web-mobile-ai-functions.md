# Separate Web and Mobile AI Functions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the mobile app its own Supabase Edge Function so web deployments cannot replace its 20-question and feedback contracts.

**Architecture:** The web app retains `career-ai`. Move this repository's function to `career-ai-mobile` and change the mobile Supabase invocation to that name. Preserve the handler behavior and shared quota RPC.

**Tech Stack:** Expo/React Native, Supabase Edge Functions, Node tests.

**Spec:** `docs/superpowers/specs/2026-11-13-separate-web-mobile-ai-functions-design.md`

## Global Constraints

- Keep the web `career-ai` function and its contract unchanged.
- Preserve the mobile function's authentication, 20-question validation, quota RPC, and AI request handling.
- Deploy the new function before releasing the mobile app update.

## Review Focus

- An existing installed app still calls `career-ai` until updated; deployment instructions must say so.
- The new function must keep explicit bearer-token verification with `verify_jwt = false`.
- Web and mobile continue to share the same quota SQL and limits.
- A failed new endpoint must show `career-ai-mobile` in the mobile connection guidance.
- The repository must no longer offer a deployable mobile implementation under `career-ai`.

---

### Task 1: Route mobile AI requests to a dedicated function

**Files:** `tests/careerAiService.test.cjs`, `src/services/careerAiService.js`, `src/data/interviewQuestionSet.mjs`, `supabase/functions/career-ai-mobile/{index.ts,handler.mjs,contracts.mjs,handler.test.mjs}`, `supabase/config.toml`, `supabase/README.md`.

**Interfaces:** `requestCareerAi(body)` continues to return the same result; its Supabase function name changes to `career-ai-mobile`.

- [x] Change the service test expectation to `career-ai-mobile`, then run `node --test tests/careerAiService.test.cjs` and observe the name mismatch.
- [x] Move the four mobile function files from `supabase/functions/career-ai/` to `supabase/functions/career-ai-mobile/`, preserving their content.
- [x] Change `requestCareerAi` to invoke `career-ai-mobile` and update its connection message. Update the 20-question error guidance to the new name.
- [x] Rename the config section to `[functions.career-ai-mobile]` and keep `verify_jwt = false`.
- [x] Update `supabase/README.md` paths, deployment command, and existing-installed-app guidance. State explicitly that the web owns `career-ai` and the quota remains shared.
- [x] Run `node --test tests/*.test.cjs tests/*.test.mjs supabase/functions/career-ai-mobile/handler.test.mjs`, `npx.cmd expo lint`, `npx.cmd tsc --noEmit`, and `git diff --check`; report any pre-existing failures.
