# Specification

## Summary
**Goal:** Expand the Dharma Darshan app with 20 Vrat Kathayen, full Ramayan (7 kandas), full Mahabharat (13 parvas), and 10+ Krishna Leela stories — all in Hindi — plus add narration controls to the KathaDetail page.

**Planned changes:**
- Add 20 Vrat Katha entries to `kathaData.ts` under the `Vrat` category, covering Ekadashi, Pradosh, Somvar, Mangalvar, Budhvar, Brihaspativar, Shukravar, Shanivaar, Navratri, Kartik, Ahoi Ashtami, Hariyali Teej, Hartalika Teej, Karva Chauth, Vat Savitri, Jivitputrika, Solah Somvar, Satyanarayan, Sakat Chauth, and Janmashtami Vrat — each with full Hindi narrative text
- Add 7 Ramayan kanda entries (Bal Kand through Uttar Kand) to `kathaData.ts` under the `Puranik` category with complete Hindi narratives, ordered sequentially
- Add 13 Mahabharat parva entries (Adi Parva through Swargarohana Parva) to `kathaData.ts` under the `Puranik` category with complete Hindi narratives; Bhishma Parva to include a Bhagavad Gita summary
- Add 10 Krishna Leela story entries to `kathaData.ts` under a new `Krishna Leela` category covering Janmotsav, Putana Vadh, Makhan Chor Leela, Govardhan Parvat Dharana, Kaliya Nag Daman, Raas Leela, Kans Vadh, Sudama Milan, Draupadi Cheerharan, and Kurukshetra Geeta Updesh — each with full Hindi narrative
- Add a `कृष्ण लीला` filter tab to the Kathayen page that displays only Krishna Leela category entries, styled consistently with existing tabs
- Add sticky/floating narration controls (Play/Pause, Stop, language label) to the KathaDetail page using the existing `useSpeechNarration` hook, with Hindi voice preferred

**User-visible outcome:** Users can browse all 20 Vrat Kathayen, the full Ramayan and Mahabharat in sequential parts, and 10 Krishna Leela stories via a new filter tab — and listen to any katha via accessible narration controls on the detail page.
