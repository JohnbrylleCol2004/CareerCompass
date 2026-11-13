# Mobile Profile Reference Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Implement the approved web-reference profile features as native mobile cards.

**Architecture:** Keep EditProfileScreen as the form owner. Isolate authenticated email and career-list requests in a profile-account service, reusable field validation in a plain JavaScript module, and explicit photo selection/upload in the existing ProfilePhoto component. Preserve existing profile storage and checkbox selections.

**Tech Stack:** Expo SDK 58, React Native, existing Picker dependency, Supabase, Node test runner.

**Spec:** ../specs/2026-11-13-mobile-profile-reference-design.md (approved).

## Global Constraints

- Native, vertically stacked cards; no embedded web profile or added dependencies.
- Academic years: 1st Year, 2nd Year, 3rd Year, 4th Year. Program: Bachelor of Science in Information Technology.
- PNG/JPEG images, maximum 2 MB; selection previews before explicit upload.
- Email requests use Supabase Auth; unconfirmed email must not overwrite the displayed current email or profile-table email.
- Preserve checkbox-only interests/technologies with limits of 3/5 and existing additional profile fields.
- No web deployment, authentication-policy changes, or assumed database migration.

## Review Focus

- Legacy profile values: normalize BSIT, retain unsupported values visibly until corrected.
- Career lookup failure: retain the stored goal, provide retry, and never accidentally clear it.
- Pending email change: distinguish request acceptance from confirmed account email.
- Photo cancellation or upload failure: keep the saved photo and allow retry without losing form edits.
- Concurrent saves: serialize profile, photo, and email actions to prevent duplicate requests or stale state.

### Task 1: Profile account services and validation

**Files:** create `src/services/profileAccountService.js`, `src/utils/profileFields.mjs`, `tests/profileAccountService.test.cjs`, and `tests/profileFields.test.mjs`.

**Interfaces:** `getAccountEmail(): Promise<string>` reads verified Auth user data; `requestEmailChange(nextEmail): Promise<void>` validates against current authenticated email and calls Auth updateUser; `getCareerOptions(): Promise<Array<{id,name}>>` reads careers ordered by name. `normalizeProgram(value): string`, `validateProfileFields(values, careerNames): string | null`, and `validateProfilePhoto(asset, byteSize): string | null` provide pure validation. A null careerNames value means lookup unavailable, so retain the existing career goal rather than validating it against an empty list.

- [x] Write tests for blank/invalid/unchanged email rejection, missing session, Auth failures, successful request without profile-table email mutation, career-query failure propagation, and ordered career options. Use the repository's service-test VM/stub pattern at the Supabase boundary.
- [x] Write pure validation tests asserting BSIT normalizes to the full program name; academic year accepts only the four choices or blank; unsupported nonblank program/career values require correction; PNG/JPEG at 2 MB pass and larger/non-image assets fail.
- [x] Run `node --test tests/profileAccountService.test.cjs tests/profileFields.test.mjs` and confirm missing implementation failures.
- [x] Implement services and validation. Use the configured Supabase confirmation destination by omitting an override unless an existing app-supported redirect is found. Do not add a guessed deep link.
- [x] Re-run the targeted tests and confirm they pass.

### Task 2: Explicit profile-photo upload

**Files:** modify `src/components/ProfilePhoto.js` and `src/services/profilePhotoService.js`; create `tests/profilePhotoService.test.cjs`.

**Interfaces:** extend ProfilePhoto with optional `explicitUpload`, `disabled`, and `onBusyChange` props. Default behavior remains compatible with ProfileScreen. EditProfileScreen enables explicit upload. Reuse `uploadProfilePhoto(asset)` and `getProfilePhotoUrl(path)`.

- [x] Add service tests for invalid image format/oversize rejection before storage upload, processed-size rejection, successful authenticated upload, and storage error propagation.
- [x] Run `node --test tests/profilePhotoService.test.cjs` and verify the new policy tests fail before implementation.
- [x] Validate source format/size before processing; inspect the actual source size when picker metadata is absent. Check encoded upload bytes against 2 MB as well.
- [x] In explicit-upload mode, gallery/camera selection sets a local preview; Upload Picture saves it. Cancel leaves saved state intact. Failed upload keeps the preview available for retry. Notify the parent while selection/camera/upload is active and clear busy state on all cancellation/error paths.
- [x] Re-run the photo-service tests. Verify choosing, canceling, retrying, and explicit upload in an available runtime; record any runtime limitation.

### Task 3: Native profile cards and account confirmation UI

**Files:** modify `src/screens/student/EditProfileScreen.js`; create `src/components/ProfileSelect.js` if needed to share labeled Picker rendering; modify `src/screens/student/ProfileScreen.js` to display academic year and the preferred-goal label.

**Interfaces:** consume Task 1 services/validation and Task 2 ProfilePhoto props. EditProfileScreen owns form state and coordinates busy actions. ProfileSelect accepts `label`, `value`, `options`, `placeholder`, `disabled`, and `onValueChange`.

- [x] Add focused serialization/validation coverage showing academic_year is saved, additional fields survive, and unsupported legacy values are not silently replaced.
- [x] Render Account, Personal Information, Preferred Career Goal, Additional Details, and Interests & Technologies cards. Preserve the existing checkbox behavior.
- [x] Load authenticated email on focus and app foreground return. Load career options with an error message and Retry action. Guard asynchronous completion after unmount.
- [x] Add new-email input and explicit confirmation request button. Validate before submitting, show pending-confirmation guidance, preserve the current authenticated email, and permit retry after failure.
- [x] Add academic-year/program/career pickers, selected-track preview, and the reference preference explanation. Preserve legacy values visibly and normalize only the known BSIT abbreviation.
- [x] Save all form fields through updateProfile, coordinate all busy states, preserve drafts after failures, and ensure nested-card offsets keep focused text inputs above the keyboard.

### Task 4: Verify and review

- [x] Run `node --test tests/*.test.*` and `node --test supabase/functions/career-ai-mobile/handler.test.mjs`; report any unrelated failures distinctly.
- [x] Run `npm.cmd run lint` and `npx.cmd --no-install tsc --noEmit`.
- [x] Review the diff against every section of the approved spec, including accessibility labels, loading/error states, source photo validation, and pending-email semantics.
- [ ] Verify phone layout, dropdowns, keyboard scrolling, and photo/email actions in an available runtime. Do not send a real confirmation email or modify a real account merely to test the feature. Report unavailable device/live-service checks explicitly.
- [x] Update this plan with completed checks and remaining limitations. Leave unrelated workspace changes untouched and deliver the implementation without deployment.

## Execution record

- Tasks 1–3 implemented. Added ProfileAccountCard to keep account/photo/email state separate from the main profile form.
- Ruling: worked in the existing checkout because the requested checkbox changes and approved documents were already uncommitted there. Unrelated InterviewCoachScreen and ResumeAnalyzerScreen changes were left untouched. No commit, merge, or deployment performed.
- Ruling: native picker selection uses an explicit callback guard plus pointer-event blocking because the installed iOS Picker does not enforce the enabled prop.
- Ruling: gallery editing is disabled before validation so an oversized original cannot bypass the 2 MB limit through picker compression. Existing camera/gallery choices remain available; native source size is read from File, while web uses the picked File or local asset blob.
- Ruling: email confirmation uses the project's configured Supabase destination; no redirect or authentication configuration was changed. Live email delivery and the destination configuration remain unverified.
- New regression coverage includes source/processed photo size, invalid photo format, pending email semantics, profile serialization, legacy/null values, explicit photo upload, cancellation after a failed preview, and disabled picker events.
- Final independent review found three issues (null program normalization, disabled iOS picker events, and failed preview cancellation); all were reproduced with failing tests and fixed.
- Verification: all 61 tests pass across tests/*.test.* and the mobile Edge Function handler suite. Expo lint and TypeScript no-emit pass. Android Metro export succeeds.
- Component tests exercise event callbacks with lightweight React/native stubs; they do not replace device rendering tests. No interactive browser/device was available for visual and keyboard verification. Real account email changes and uploads were not performed.
