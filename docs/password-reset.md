# Mobile password reset

The login screen's Forgot Password action opens a form prefilled with the entered email. The form calls Supabase Auth `resetPasswordForEmail`; it never retrieves or emails an existing password.

The recovery link uses the existing shared web flow:

`https://career-compass-web-cb.vercel.app/?auth_flow=reset`

The deployed web app reads `auth_flow=reset`, establishes the recovery session, and opens its update-password page. After choosing a new password, the user returns to the mobile app to log in. The installed Supabase client uses the implicit flow, so a PKCE verifier stored only on the phone is not needed in the browser.

## Deployment checks

- Confirm the above URL is permitted in the shared Supabase project's Authentication URL configuration. An unapproved redirect can fall back to the configured Site URL and miss the recovery page.
- Keep the recovery email template connected to Supabase's confirmation link so verification happens before the web page receives the recovery session.
- Verify the project's email provider can deliver to registered users and check Auth logs if delivery fails. This implementation does not change SMTP, email templates, redirect allowlists, or authentication policies.
- If the web hostname or recovery contract changes, update `src/services/passwordResetService.js` and its regression test together.

## End-to-end check with a test account

1. Open Forgot Password in the mobile app and enter the test account's registered email.
2. Tap Send Reset Email once. Confirm inbox delivery (including checking spam).
3. Open the newest reset link, set a new password on the website, and return to mobile login.
4. Verify the new password works, the old password fails, and an expired or previously used link requires a new request.
5. Verify invalid email input, offline behavior, duplicate taps, and provider failures do not show a false success.

Automated checks cover validation, normalized email, the exact recovery redirect, and propagation of provider failures. The form uses existence-neutral confirmation text and a 60-second resend cooldown. Actual delivery and browser recovery completion require the end-to-end check above; no real reset email was sent during implementation.
