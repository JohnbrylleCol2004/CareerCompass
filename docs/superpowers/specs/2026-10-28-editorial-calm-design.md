# CareerCompass: Editorial Calm

## Intent and selected direction
Apply the Editorial Calm concept selected by the user across the existing Expo mobile application. Replace the repetitive mint card treatment with a deliberate, readable career guidance interface. Success means consistent hierarchy, recognizable branding, and an obvious next action without changing existing service behavior.

## Approaches considered
- **Editorial Calm (selected):** warm neutral surfaces, forest green, serif display headings, and quiet list sections. Distinctive and calm, with careful platform font handling required.
- **Focused Workspace:** blue accents, sans-serif headings, and a prominent task card. Efficient but closer to a conventional productivity dashboard.
- **Warm Field Guide:** terracotta accents and a journey layout. Friendly but more prescriptive about the order of student activities.

## Scope
Cover landing, login, registration, password recovery, dashboard, skill gap, career and elective recommendations, profile and profile editing, resume analysis, and interview practice. Update shared headers, buttons, summary sections, feedback sections, progress indicators, input treatments, and navigation chrome.

## Visual system (implementation proposals)
- Background #FAF9F5, surface #FFFFFF, primary text #1B3028, secondary text #5B675F, dividers #DCDED5, primary action #225B44 with white text.
- Use semantic tokens for errors, success, disabled states, and subdued emphasis. Check contrast for each actual text/background pairing.
- Use platform serif headings: Georgia where available, Android's system serif fallback, with system sans-serif for forms and body copy. No remote font dependency required. Cross-platform typography may differ slightly.
- Display headings approximately 32–36 points; section headings 19–22; body/input text 16; supporting text 13–14. Allow font scaling and wrapping.
- Main screen gutters 24 points where space permits, reduced to 20 on narrow layouts; use a consistent 4/8-point spacing scale.
- Restrained 6–10 point corners for inputs and controls. Prefer white or neutral surfaces and thin dividers over repeated colored cards. No decorative gradients or heavy shadows.
- Replace sparkle branding with an existing compass icon and CareerCompass wordmark. Use the existing icon package.
- Retain a light appearance for this first integration, matching the selected concept; a complete dark theme is outside this change.

## Screen behavior and hierarchy
### Landing and authentication
Use an editorial heading and concise supporting copy. Create Account is the primary landing action; Login is secondary. Keep current form fields, validation, password visibility, submission handlers, and recovery links. Ensure long forms and keyboard states remain usable on small screens.

### Dashboard
Use a compact branded header with the existing profile destination. Show a serif greeting or headline and one prominent Review my skills action routed to the existing Skill Gap screen. Beneath it, provide simple rows for career exploration, interview practice, and resume review. Do not invent personalized completion states or new assessment behavior. Avoid presenting the mock top-career score as an earned personal result.

### Skills, careers, and electives
Use readable section/list layouts and retain current content and progress data. Clearly label sample/mock recommendations where applicable; do not imply they are newly personalized. Use green for progress and key actions, not every container. Preserve existing destinations.

### Profile and editing
Present identity/photo once, followed by grouped labeled information instead of a stack of large statistic cards. Keep all existing fields, fallbacks, editing controls, photo/camera flows, and logout functionality.

### Resume and interview tools
Use serif page headings, restrained input/upload sections, primary action emphasis, and secondary treatment for remove, previous, and regenerate actions as appropriate. Group feedback under readable headings with dividers. Retain loading, disabled, validation, error, privacy disclosure, AI limitations, and offline states. Do not alter requests, scores, parsing, storage, or question progression.

## Architecture and constraints
Centralize colors, typography, spacing, and reusable component variants; replace duplicated screen-level visual decisions with shared tokens where practical. Continue using the existing React Native components and Expo SDK 57 dependencies. Read matching official docs before touching Expo/React Native APIs.

The repository guidance requests Expo Router, while the running application uses React Navigation. This visual integration proposes retaining existing routing behavior and styling its chrome; a routing migration is a separate architectural task. Preserve route names and back behavior.

## Non-goals and anti-goals
No backend, authentication, AI service, schema, or recommendation logic changes. No new dependencies unless implementation proves one necessary. No fabricated progress, decorative scores, new onboarding funnel, or unrelated route migration. Do not remove essential disclosures to simplify a screen. Preserve unrelated workspace edits.

## Acceptance and verification
- All listed screens use the same palette and typography hierarchy.
- Primary and secondary actions are visually distinguishable; interactive controls have accessible labels and approximately 44–48 point touch areas.
- At narrow mobile widths, long names, body copy, inputs, and navigation remain readable without horizontal clipping.
- Loading, error, empty, offline, and disabled states remain legible.
- Run the repository's existing tests, lint and typecheck; report existing failures or missing configuration accurately rather than claiming unrun checks passed.
- Inspect the rendered web preview at mobile dimensions where available. Native-only behaviors require native device/emulator validation; report any unavailable validation explicitly.

## Left to implementation
Exact spacing adjustments, compatible serif fallbacks, row component boundaries, and platform-specific layout corrections may be settled during implementation within this direction. Any behavior changes beyond the scope above require separate discussion.
