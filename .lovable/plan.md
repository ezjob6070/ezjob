# Improve Calendar Overview Layout

The current month view forces a `min-w-[800px]` calendar with large 48×48px day cells, so users have to scroll horizontally. The selected-day details are pushed below the fold. Goal: shrink the calendar, put a rich day-detail panel beside it, and make hours visible at a glance.

## New layout (Calendar Overview tab, month mode)

```text
┌─────────────────────────────────────────────────────────────┐
│ Calendar Overview      [Day][Week][Month]   < May 2026 >    │
├──────────────────────────────┬──────────────────────────────┤
│  COMPACT MONTH CALENDAR      │  SELECTED DAY PANEL          │
│  ~ 360px wide                │  Thu, May 7 · 3 jobs · 2 tasks│
│  36×36 day cells             │  ─────────────────────────── │
│  Color dots for jobs/tasks   │  ▸ Jobs (2)                  │
│  Click day → updates panel   │   09:00  AC Repair – Acme    │
│                              │   14:30  Install – Ortega    │
│  Legend: ● jobs ● tasks      │  ▸ Tasks (1)                 │
│                              │   11:00  Call back lead      │
│                              │  ▸ Reminders (0)             │
│                              │                              │
│                              │  [Hourly timeline 8am–8pm]   │
│                              │  Compact strip with blocks   │
│                              │  positioned by hour          │
└──────────────────────────────┴──────────────────────────────┘
```

- Desktop (≥1024px): two columns, `lg:grid-cols-[360px_1fr]`, no horizontal scroll.
- Tablet/mobile: stacks vertically, calendar first, panel below.
- Day and Week modes keep current behavior (timeline / 7-column grid) but get slight sizing tweaks for consistency.

## Changes

1. **`src/components/schedule/CalendarView.tsx`**
   - Wrap month mode in `grid lg:grid-cols-[360px_1fr] gap-4` (replaces the `min-w-[800px]` wrapper).
   - Shrink calendar: remove `min-w-[800px]`, drop day-cell size from `h-12 w-12` to `h-9 w-9`, smaller font, keep colored dots underneath.
   - Right pane: new `SelectedDayPanel` component (inline or extracted) showing:
     - Header: full date + counts ("3 jobs · 2 tasks").
     - Jobs section (sorted by hour) with time, title, client, status chip.
     - Tasks section (sorted by hour) with time, title, priority dot, client.
     - Empty state when nothing is scheduled.
     - Compact hourly timeline strip (8am–8pm) at the bottom with colored blocks for each job/task.
   - Remove the redundant `UpcomingEvents` block below the calendar in month mode (its info now lives in the day panel).

2. **`src/pages/Schedule.tsx`**
   - No structural change; existing `jobsForSelectedDate` / `tasksForSelectedDate` already feed the panel.

## Out of scope
- Day and Week views: keep as-is for now (only minor padding tweaks if needed).
- Jobs / Tasks tabs: unchanged.
- No backend, data, or filter changes.
