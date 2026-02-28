# Specification

## Summary
**Goal:** Make Katha publishing instant from the Admin Panel, add automatic TTS narration to all Katha detail pages, make Community photo uploads appear immediately without approval delays, and improve overall app performance.

**Planned changes:**
- Admin-added Kathas are saved with a published/approved status by default so they appear immediately in the Kathayen section without any extra approval step.
- Every Katha detail page (including dynamically added ones) automatically shows TTS play/pause/stop controls using the existing Hindi speech narration hook, with no additional admin configuration required.
- Community posts with image/video attachments bypass any approval queue and appear in the feed instantly after submission.
- Optimize React Query cache settings (staleTime, cacheTime) to reduce redundant refetches and prevent flickering on Kathayen and Community pages.
- Reduce unnecessary re-renders on Home, Kathayen, and Community pages for smoother scrolling and navigation.

**User-visible outcome:** Admins can add a Katha and it appears live immediately; all Katha pages have a built-in TTS narration control; community photos are visible right after upload; and the app navigates and loads faster with no flickering.
