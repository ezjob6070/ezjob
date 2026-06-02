## Projects panel → horizontal progress bars

Replace the donut chart in the Projects section of the dashboard with a compact horizontal progress bar list, keeping the same side-by-side layout with the Jobs donut.

### Changes

**`src/components/dashboard/ProjectsDashboardSection.tsx`**
- Keep the same 4 buckets (Early <33%, In Progress 33–66%, Near Done 67–99%, Completed ≥100%) and their colors/gradients.
- Remove the `EnhancedDonutChart`.
- Render a stacked list of 4 rows, one per bucket. Each row:
  - Colored gradient dot + bucket label on the left
  - Count + percentage of total on the right
  - Full-width progress bar below (bg = muted, fill = bucket gradient, width = bucket count / total)
  - Entire row is a button → opens the existing `Dialog` with that bucket's projects
- Header stays: title "Projects Overview" + total count, clickable to open all projects (same `onCenterClick` behavior).
- Keep the existing `Dialog` listing matching projects unchanged.

**`src/pages/Dashboard.tsx`**
- No structural change. The `grid grid-cols-1 lg:grid-cols-2` layout already hosts Jobs (donut) on the left and Projects (now bars) on the right.

### Visual notes
- Uses existing semantic tokens and the bucket gradients already defined.
- Vertically compact so the whole dashboard stays above the fold on desktop.
- Mobile: stacks under Jobs as today.
