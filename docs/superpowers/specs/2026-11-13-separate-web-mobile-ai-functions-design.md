# Separate web and mobile AI functions

## Intent

The web and mobile apps use the same Supabase project but have incompatible `career-ai` request and response contracts. Deploying either implementation under that name replaces the other. Keep both applications working without changing the web contract.

## Approaches

- **Separate functions (chosen):** Keep the web function at `career-ai`; deploy the mobile implementation as `career-ai-mobile`. Each app can evolve its own contract. This requires a mobile app update and one new Edge Function deployment.
- **One shared function:** Add versioned request routing and both contracts to one deployment. This couples releases of the two apps and requires coordinated changes in the web repository, which is not in this workspace.

## Design

- Move this repository's mobile function files to `supabase/functions/career-ai-mobile/`. The web repository retains ownership of `career-ai`.
- Change only the mobile service invocation and its error text to `career-ai-mobile`. Preserve the mobile request and response shapes, its 20-question validation, AI retry behavior, and existing secrets.
- Configure `[functions.career-ai-mobile]` with `verify_jwt = false`; the handler still verifies the bearer token with Supabase Auth.
- Keep the shared quota SQL and RPC unchanged. Both functions consume the same project limits, so separate endpoints do not create extra quota.
- Update deployment instructions to deploy only `career-ai-mobile`. Do not deploy the web function from this repository.

## Release and checks

Deploy `career-ai-mobile` before releasing the mobile app update. Existing installed mobile versions continue to call `career-ai` until updated and may receive the web contract; this cannot be corrected solely by deploying the new endpoint. Verify the mobile function tests, service invocation tests, lint, typecheck, and the new deployment path. The web application and its `career-ai` deployment remain unchanged.
