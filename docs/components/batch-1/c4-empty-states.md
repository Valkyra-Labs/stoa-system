# C4: EmptyState, and states on Ladder and Heatmap

Why: Tyche's heatmap is a blank canvas before data arrives, the ladder
says little before playback, and there is no stale indicator while a
seek is pending.

Build `EmptyState` (title, description, optional action) for regions
with nothing to show yet.

Add to `Ladder` and `Heatmap`:
- an empty state (before the first data) rendered as text over or in
  place of the canvas, announced to assistive technology;
- a `stale` prop (for example while a seek is pending) that shows a
  visible marker and a text alternative, without redrawing the canvas
  differently in a way that could be mistaken for data;
- Heatmap height from the density tokens instead of a caller-computed
  literal (Tyche currently multiplies by a hard-coded 22 px row height
  while running at regular density); keep the prop as an override.

Tests cover each state; stories show empty, stale and live.
