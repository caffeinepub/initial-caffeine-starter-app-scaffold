# Specification

## Summary
**Goal:** Add 10 long-form Vrat Kathas in Hindi to the Vrat Katha section with audio narration support.

**Planned changes:**
- Add 10 complete Vrat Katha entries (Ekadashi, Solah Somvar, Mangalwar, Sukrwar, Karva Chauth, Santoshi Mata, Pradosh, Navratri, Satyanarayan, Hartalika Teej) to `frontend/src/lib/kathaData.ts` under the `vrat` category, each with 400+ words of Hindi narrative, title, and deity fields
- Update the Kathayen listing page to display all 10 Vrat Kathas when the `vrat` tab is selected, using static data as a fallback so content always renders
- Add audio narration controls (Play, Pause, Resume, Stop) to the Katha detail page using the existing `useSpeechNarration` hook with `hi-IN` voice preference, displayed prominently near the top of the content with visual state indicators
- Seed the backend canister with the same 10 Vrat Katha records (title, Hindi text, deity, category `vrat`) without affecting existing data

**User-visible outcome:** Users can browse all 10 Vrat Kathas in the Vrat Katha section and listen to each katha read aloud in Hindi using Play, Pause, Resume, and Stop narration controls on the detail page.
