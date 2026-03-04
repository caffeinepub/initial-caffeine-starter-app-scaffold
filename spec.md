# Sanatan Pro

## Current State
Community section exists but posts fail in APK (Appilix) because:
1. `getCommunityPosts` backend function requires Internet Identity authentication (`#user` permission), which doesn't work in Appilix WebView
2. `Community.tsx` and `CommunityPostCard.tsx` use `useInternetIdentity` for auth checks instead of the local `useAuth` (username/password) hook
3. Video upload is supported but causes APK compatibility issues
4. Public users (not logged in) cannot view posts at all

## Requested Changes (Diff)

### Add
- New backend function `getPublicCommunityPosts` that returns approved posts without authentication requirement (anonymous/public access)

### Modify
- `main.mo`: Add `getPublicCommunityPosts` public query (no auth check) that returns approved posts
- `Community.tsx`: Replace `useInternetIdentity` with `useAuth`; show posts to public (unauthenticated) users read-only; require login only for creating posts; remove video upload UI
- `CommunityPostCard.tsx`: Replace `useInternetIdentity` with `useAuth`; remove video display section; like button uses `useAuth` isAuthenticated
- `useQueries.ts`: Add `useGetPublicCommunityPosts` hook that works without authentication (anonymous actor)

### Remove
- Video upload option in Community post creation form
- Video display in CommunityPostCard
- `useInternetIdentity` imports in Community.tsx and CommunityPostCard.tsx

## Implementation Plan
1. Add `getPublicCommunityPosts` to `main.mo` as a public query (no caller check)
2. Add `useGetPublicCommunityPosts` hook in `useQueries.ts` using anonymous actor
3. Update `Community.tsx` to use `useAuth` and show public posts feed to all users, with login-gated post creation
4. Update `CommunityPostCard.tsx` to use `useAuth`, remove video rendering
5. Build and deploy
