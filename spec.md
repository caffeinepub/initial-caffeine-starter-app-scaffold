# Specification

## Summary
**Goal:** Populate complete Vrat Katha content across the app and fix the TTS narration feature on Krishna Leela katha detail pages.

**Planned changes:**
- Add full Hindi and English story text for at least 20 Vrat Kathas in the frontend static katha data (`kathaData.ts`), including Ekadashi, Somvar Shiv, Mangalvar Hanuman, Budh, Brihaspativar, Shukravar Santoshi Mata, Shanivar Shani, Karva Chauth, Teej, Navratri, Satyanarayan, Pradosh, Ganesh Chaturthi, Ahoi Ashtami, Hartalika Teej, Jivitputrika, Vat Savitri, Surya Shashti (Chhath), Nirjala Ekadashi, and Purnima Vrat Kathas — all with correct category, deity, title, and metadata
- Fix the `useSpeechNarration` hook integration in `KathaDetail.tsx` so the narration play/pause/stop controls work correctly for Krishna Leela kathas, including language-toggle restarts and browser support error handling
- Seed the backend (`main.mo`) with complete Krishna Leela kathas and all 20 Vrat Kathas (with full `hindText`, `englishText`, `category`, `deity`, `title`, and `isApproved = true`) so the Kathayen page shows all stories when the backend is available

**User-visible outcome:** Users can browse and read all 20 Vrat Kathas in Hindi or English on the Kathayen page, and can listen to audio narration of Krishna Leela kathas with working play, pause, stop, and language-switch controls.
