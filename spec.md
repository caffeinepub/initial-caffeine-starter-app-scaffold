# Specification

## Summary
**Goal:** Fix bugs in the Jap section's nam jap counting, make counting smooth and lag-free, and add a progress bar for the 108-bead mala cycle.

**Planned changes:**
- Fix state management issues in `Jap.tsx` that cause incorrect, skipped, or double-counted taps
- Ensure session count and daily count update correctly and consistently on every tap
- Prevent race conditions between local state and backend sync from reverting or resetting the counter
- Implement optimistic local state updates so the counter increments instantly on each tap (within one animation frame)
- Debounce/batch backend sync calls to avoid excessive re-renders and network-induced UI jank
- Add a circular or linear progress bar on the Jap page that fills from 0% to 100% as the count goes from 0 to 108
- Progress bar resets and refills for each new mala cycle, displays current count and target (e.g., "45 / 108")
- Style the progress bar with saffron/gold colors consistent with the app's devotional theme
- Preserve all existing visual effects: SacredRipple, OmParticleBurst, LotusBloomOverlay, and MalaRing

**User-visible outcome:** Users can tap to chant nam jap with an instantly responsive counter that never skips or double-counts, and a devotionally styled progress bar shows their progress toward completing each 108-bead mala cycle.
