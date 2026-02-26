# Specification

## Summary
**Goal:** Fix Nam Jap count persistence, add Radha Nam and Jai Shree Ram mantra options, and add animations to the Jap page.

**Planned changes:**
- Add "राधा नाम" (Radha Nam) and "जय श्री राम" (Jai Shree Ram) as selectable mantra options on the Jap page alongside existing options
- Fix Jap count persistence: save count to localStorage for guest users so it survives page refreshes
- For authenticated users, sync and save Jap count to the backend canister and restore it on page load
- Save and restore the correct count per mantra when switching between mantra options
- Add a ripple/glow pulse animation on the tap/count button each time it is pressed
- Add a smooth entrance animation for the mala bead ring and counter display on page load
- Add a celebratory animation (e.g., divine light burst or petal shower) when 108 counts (full mala) is completed

**User-visible outcome:** Users can now select Radha Nam and Jai Shree Ram for jap counting, their counts are saved and restored across page refreshes and navigation (persistently for logged-in users), and the Jap page features smooth animations including button press effects and a celebratory animation at 108 counts.
