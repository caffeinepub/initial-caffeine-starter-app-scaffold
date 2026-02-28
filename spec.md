# Specification

## Summary
**Goal:** Fix admin bootstrap logic so the first registered user automatically becomes Admin, and add image/video/file media upload support to community posts.

**Planned changes:**
- Fix backend admin bootstrap: when the very first user profile is created and no admin exists, automatically assign that user the Admin role; subsequent users remain regular users
- Update the `CommunityPost` backend data type to include optional fields for image blob, video blob, and file attachment blob (with filename)
- Update backend `createCommunityPost` function to accept and store optional media blobs
- Update the Community page post submission form to include a media attachment button supporting image (JPG/PNG/GIF), video (MP4/WebM), and file uploads
- Show an image preview thumbnail after selecting an image before submission
- Display attached media inline in the community feed: images shown inline, videos shown as a playable player, files shown as a downloadable link
- Add file type and size validation with user-friendly error messages

**User-visible outcome:** The first registered user gains admin access automatically without manual steps. Community members can attach images, videos, or files to their posts along with a text caption, and see media displayed inline in the feed.
