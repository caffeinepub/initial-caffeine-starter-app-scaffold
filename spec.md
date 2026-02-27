# Specification

## Summary
**Goal:** Redesign the entire frontend of the Divya Darshan devotional app to use a warm saffron/gold Hindu temple theme, replacing all dark styling with a light, devotional aesthetic.

**Planned changes:**
- Update global CSS (`index.css`) and `tailwind.config.js` to replace dark theme with saffron (`#FF6B00`), gold (`#FFD700`), red (`#C0392B`), warm yellow (`#FFA500`), and cream (`#FFF8E7`) palette as defaults
- Redesign `AppLayout.tsx` header with saffron-to-gold gradient, gold Om logo, and devotional typography
- Redesign `BottomNav.tsx` with warm cream/saffron background and gold active state with soft golden halo
- Redesign `Home.tsx` with grand hero banner (Om symbol, Sanskrit greeting, Panchang tithi), category cards (Mantras, Aarti, Puja Vidhi, Bhajans), and ornate gold-bordered Shloka/Dharma Quote cards
- Redesign all card components (`AartiCard`, `KathaCard`, `ShlokaCard`, `FestivalCountdownCard`, `DailyDharmaQuote`) with cream/gold backgrounds, gold/saffron borders, and dark maroon text
- Redesign `Jap.tsx` with saffron/gold gradient background, gold/amber MalaRing beads, ornate golden count circle, and saffron LotusBloomOverlay
- Redesign `Aarti.tsx` and `AartiDetail.tsx` with saffron hero banner, diya imagery, and gold-bordered aarti text cards on cream background
- Redesign `Kathayen.tsx` and `KathaDetail.tsx` with saffron active tab filters, cream/gold story cards, and dark maroon text on cream for reading
- Redesign `Panchang.tsx` with warm amber/cream card styling and gold borders
- Redesign `Profile.tsx` with saffron accents for mantra selection and stats display

**User-visible outcome:** The entire app displays a warm, light devotional Hindu temple aesthetic with saffron, gold, and cream colors throughout every page and component — no dark backgrounds remain anywhere.
