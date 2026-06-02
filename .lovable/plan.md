## Add more substance to the Projects Overview panel

The Projects panel currently shows 4 progress bar rows and feels a bit empty next to the Jobs donut. Add light, useful content to fill it out without making it noisy.

### Changes — `src/components/dashboard/ProjectsDashboardSection.tsx`

**1. Add a compact stats strip above the bars**
Three small stat blocks in a single row, separated by subtle dividers:
- **Total Budget** — sum of `project.budget` across all projects, formatted as `$XXM`
- **Avg. Progress** — average `completion` across all projects, shown as `XX%`
- **Active Workers** — sum of `project.workers` across all projects

Small label on top (muted, 11px), bold value below (sm, foreground). Keeps the same white card aesthetic.

**2. Add a "Spotlight" mini-row below the 4 progress bars**
A single highlighted project — the one closest to completion but not yet done (highest `completion` where `completion < 100`). Shows:
- Project name (truncated) + type as muted subtext
- Right side: `XX%` badge in the In-Progress/Near-Done gradient
- Clicking it navigates to `/projects/:id`

Separated from the bars by a thin `border-t border-border` with `pt-3 mt-1`.

**3. Keep everything else the same**
- 4 bucket rows unchanged
- Header (title + "View all →") unchanged
- Dialog unchanged
- Same `bg-white border border-border shadow-sm rounded-xl` card

### Layout sketch

```text
┌─ Projects Overview ──────────── View all → ┐
│  10 total · tap a row to view              │
│                                            │
│  $327M     │   58%      │   1,098          │  ← new stats strip
│  Budget    │  Avg Prog. │  Workers         │
│ ─────────────────────────────────────────  │
│  ● Early          2   20%   ▰▰░░░░░░░░     │
│  ● In Progress    4   40%   ▰▰▰▰░░░░░░     │
│  ● Near Done      3   30%   ▰▰▰░░░░░░░     │
│  ● Completed      1   10%   ▰░░░░░░░░░     │
│ ─────────────────────────────────────────  │
│  Spotlight                                  │  ← new mini-row
│  Harbor View Hotel · Hospitality      90%  │
└────────────────────────────────────────────┘
```

### Visual notes
- All values computed from `src/data/projects.ts` (no new data source).
- Uses existing semantic tokens and the bucket gradients.
- Stays vertically compact and keeps height aligned with the Jobs donut card.
- Mobile: still stacks under Jobs.
