# Specification

## Summary
**Goal:** Add full Ramayan and Mahabharat kathas to the Katha section of the Nam Jap app.

**Planned changes:**
- Add a "Ramayan - Sampurna Katha" entry to the backend Katha data store with category "Puranik", deity "Ram", and full Hindi narrative covering all major kandas (Bal, Ayodhya, Aranya, Kishkindha, Sundar, Lanka/Yuddha, Uttar Kand) plus an English summary
- Add a "Mahabharat - Sampurna Katha" entry to the backend Katha data store with category "Puranik", deity "Krishna", and full Hindi narrative covering all major parvas plus an English summary; positioned after Ramayan
- Update the frontend static fallback data in `kathaData.ts` to include both entries matching the backend structure, with Ramayan listed before Mahabharat

**User-visible outcome:** Users can browse the Kathayen section, find both Ramayan and Mahabharat under the "Puranik" category, tap either entry to read the full Hindi text, and use the existing text-to-speech narration feature on both kathas.
