# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

CareerCompass targets Android and iPhone through one Expo and React Native app. Platform-specific interface behavior should follow each operating system's conventions where it matters.

## Users

The primary users are Bachelor of Science in Information Technology (BSIT) students at the University of Makati. They use the app to explore suitable IT career paths and prepare for related opportunities.

## Product Purpose

CareerCompass helps students discover suitable IT career paths through skill gap analysis, elective recommendations, resume support, and interview preparation. It should help a student understand possible roles and choose useful next steps toward a career target.

## Positioning

The intended guidance combines the BSIT curriculum and elective mapping supplied for this project, student profile and skill context, and AI coaching. Completing all 20 Interview Coach answers produces practice-based skill findings and career paths to explore. Electives remain a curriculum list rather than individualized recommendations.

## Operating Context

Students create an account, enter their program, career target, interests, and technologies, then explore career roles and recommended electives. They can practice interview questions, assess a completed set to see evidence-based skill findings and role suggestions, and submit a PDF resume for AI feedback when connected to the service.

## Capabilities and Constraints

- The mobile app uses Expo and React Native with Supabase authentication and profile data.
- The current BSIT catalog includes primary and secondary job roles and six recommended elective courses from the curriculum excerpts the user supplied. The curriculum's issuing authority and whether it is the university's current official curriculum have not been established.
- Skill Gap and suggested career paths derive from the completed Interview Coach set. Ratings reflect evidence in answers, not verified ability; areas without enough evidence are marked unassessed. Career ordering uses a fixed heuristic mapping from skill areas to the supplied BSIT roles, not an official university or employer requirement. The full role and elective catalogs remain available.
- Interview Coach and Resume Analyzer use a Supabase Edge Function backed by Google's AI service. The built-in interview questions remain available offline; AI requests need a connection.
- Resume analysis is coaching guidance, not an ATS score or hiring prediction. The selected PDF may contain personal information and is sent to the AI provider for analysis. Interview answers and resume results remain in screen memory. Only derived area ratings, question numbers, and short notes are saved on the device per signed-in account after assessment; raw answers are not saved.

## Brand Commitments

The product name is CareerCompass. The repository includes an existing app logo at `assets/careercompass_logo.png`. No replacement visual style or university branding permission has been established by this init.

## Evidence on Hand

- The user's BSIT curriculum screenshots supplied the listed job roles and recommended elective titles and codes; the extracted app data is in `src/data/mockData.js`.
- The current screens and navigation in `src/screens/` and `src/navigation/` show the implemented student workflow.
- `supabase/README.md` documents the AI service behavior, data handling, and setup limits. It does not establish that the external service is deployed and working in every environment.

## Product Principles

1. Make the path from career exploration to a useful student action clear.
2. Ground BSIT guidance in the supplied curriculum while distinguishing interview evidence from verified skill.
3. Use profile context and AI feedback where they improve preparation, with clear limits on what the guidance can claim.
4. Respect student privacy when handling resumes, interview answers, and account data.
