# Specification

## Summary
**Goal:** Fix the Aarti section so it correctly loads and displays all aarti entries from static data without errors.

**Planned changes:**
- Fix `frontend/src/pages/Aarti.tsx` to correctly read and render all aarti entries from `frontend/src/lib/staticData.ts` as `AartiCard` components
- Ensure clicking an aarti card navigates to the correct `AartiDetail` page
- Add a graceful empty state with a friendly Hindi message if no aarti data is available, instead of showing an error or blank screen

**User-visible outcome:** Opening the Aarti section displays all available aarti cards without any error on all devices and browsers. If no data is available, a friendly message is shown instead of a crash or error.
