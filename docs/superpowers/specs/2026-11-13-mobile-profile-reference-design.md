# Mobile profile aligned with the web reference

## Intent and scope

Implement all sections in the supplied profile screenshot in the mobile Edit Profile screen. The user confirmed that this includes profile-picture selection/upload and account-email change. Keep the existing checkbox-only interests and technologies section.

Reference: https://career-compass-web-cb.vercel.app/#/profile

## Approaches

- Recommended: build native, vertically stacked cards using the existing React Native components, photo services, and Supabase session. This fits phone screens and reuses authentication and storage.
- Alternative: embed the web profile. This reproduces the web layout but introduces web-session coordination and does not integrate naturally with the existing mobile edit form.

The native approach is proposed for approval. This is a focused profile feature with photo and authentication integration, not a redesign of the rest of the app.

## Screen and behavior

- Account card: profile-photo preview, Choose Profile Picture, a separate Upload Picture action, student ID, and the authenticated account email. Selection previews the pending image; upload explicitly saves it. Preserve the existing camera/gallery capabilities. Disable duplicate uploads and show actionable errors.
- Match the reference upload policy: PNG/JPEG images, maximum 2 MB, with square images recommended. Validate selected assets before upload and check the processed upload size. Reuse existing image processing and private photo storage; do not change storage permissions.
- Personal Information card: editable first name, middle name, surname, and student ID; dropdowns for academic year and program/course. Academic-year choices are 1st Year through 4th Year. The program choice is Bachelor of Science in Information Technology. Normalize the existing BSIT abbreviation; flag other legacy values for explicit correction rather than silently discarding them.
- Preferred Career Goal card: dropdown populated from the shared careers table, explanatory text that this is a preference rather than a recommendation ranking, and a Selected Track preview. A load failure offers retry and preserves the stored goal. No manually entered new career goals.
- Preserve username, department, and position data. Keep their existing editing capability in a secondary Additional Details section so the change does not silently remove functionality.
- Keep interests and technologies as predefined checkboxes with the existing 3/5 limits.
- Save Profile persists the form through the existing updateProfile flow, including academic_year. Photo upload and email-change requests are separate explicit actions, as in the reference. Coordinate busy states and preserve form input on failures.

## Email confirmation

- Display the current email from Supabase Auth, rather than treating a profile-table email as authoritative.
- Provide a New email address input and Send email change confirmation action. Validate the address and reject an unchanged address before making a request.
- Use the authenticated Supabase email-update flow. Explain that the user must complete the required email confirmations. Do not mark the new email as confirmed merely because the request succeeds.
- Refresh the authenticated email when the screen regains focus after confirmation. Do not directly overwrite the profile email with an unconfirmed address.
- Implementation checks the project's existing confirmation redirect configuration and reuses its supported destination. No authentication-policy changes are included.

## Data and boundaries

The live web app reads profiles.academic_year and loads career goals from careers. Confirm the mobile save path supports that shared schema; do not rely on the older local student_profiles schema. Preserve unrelated profile fields and the existing AI contracts. No web deployment or database migration is assumed necessary.

## Verification

Test email-request validation, errors, and pending-confirmation behavior; profile field serialization and legacy values; career-list loading/failure; photo format/size validation and cancellation. Run the existing test suite, lint, and typecheck. Verify the mobile layout and keyboard/scroll behavior in an available runtime, or explicitly report if visual/device verification is unavailable.
