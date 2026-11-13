# Shared web and mobile profile photos

Both apps must use the same Supabase project and Auth account ID. The shared contract is:

- Profile row: `profiles.id = auth user ID`.
- Profile photo reference: `profiles.profile_image_path` stores an object path, never an expiring signed URL.
- Private storage bucket: `avatars`.
- Image formats: PNG/JPEG; maximum 2 MB.
- Unique object paths beneath the authenticated user's folder prevent cached images from surviving a photo replacement.

Verified against the web repository's [profile implementation](https://github.com/SammyyB/career-compass-web/blob/main/src/pages/student/Profile.tsx) and [storage migration](https://github.com/SammyyB/career-compass-web/blob/main/supabase/migrations/0002_storage_restrictions.sql).

Mobile previously uploaded and signed photos in `profile-photos`, which caused the image shown on the web to fail in mobile. New mobile uploads now use `avatars` and update the same profile column as the web. Mobile reads the latest profile path when its profile screen gains focus, when the app returns to the foreground, and when refreshing expiring signed URLs.

The current web implementation loads the profile on app initialization and after its own uploads. After changing a photo in mobile, refresh the web page to retrieve it. Changes from web appear when mobile's profile is reopened or the app resumes. This is refresh-based synchronization, not a live subscription.

Older mobile photos in `profile-photos` retain a read fallback in mobile. To make one of those photos visible on the current web app, select and upload it again from either updated app. No automatic copy, deletion, or storage-policy change is performed.

## Account test

1. Sign in to the same account in both apps against the same Supabase project.
2. Upload a photo on the web, then reopen the mobile profile or resume mobile. Confirm the same image appears.
3. Upload a different photo on mobile, then refresh the web profile. Confirm the replacement appears.
4. Verify each saved path points to an object in `avatars`, and the bucket's private owner-read/write policies from the web migrations are installed.

Automated tests cover the shared upload bucket, web-photo signing, legacy read fallback, latest-path lookup, focus/foreground refresh, and photo removal. A real account test requires the updated mobile app and live backend access.
