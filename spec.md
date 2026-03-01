# Specification

## Summary
**Goal:** Fix authentication flow, public visibility of content, PWA narration, admin community controls, and image loading performance for the Divya Darshan app.

**Planned changes:**
- Implement one-click Internet Identity login/logout: clicking login immediately opens the Internet Identity popup (Google/passkey), no intermediate password form; a logout button is always visible when authenticated
- Fix Vrat Katha public visibility: published kathas are returned by the backend for anonymous callers and displayed without requiring login
- Fix Community posts public visibility: approved community posts are visible to unauthenticated users; backend returns approved posts for anonymous callers
- Fix TTS narration in PWA: update the speech narration hook to handle Chrome Android PWA voice-loading bug, re-initialize Speech Synthesis on visibility changes, and add a fallback resume mechanism with a user-facing message if TTS is unavailable
- Add Community Approval Queue tab in Admin Panel: list pending posts with Accept, Reject, and Delete actions; approved posts are also deletable by admin; backend restricts these actions to admin callers
- Optimize community post image loading: add native lazy loading, skeleton/placeholder while loading, cache blob URLs to avoid re-fetching on every render

**User-visible outcome:** Users can log in and out with one click via Internet Identity; Vrat Kathas and community posts are publicly visible without login; narration works correctly in the installed PWA; admins can manage community post approvals; community images load faster with placeholders.
