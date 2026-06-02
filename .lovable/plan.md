## Add today's date to the dashboard header, light cleanup

The dashboard already shows "Hello, Alex / Welcome back to Ez Job" at the top. Replace the welcome subtitle with today's date in a professional format and add a small date pill above the metrics strip.

### Changes — `src/components/dashboard/DashboardHeader.tsx`

- Keep the indigo Home icon and "Hello, Alex" title.
- Replace the subtitle "Welcome back to Ez Job" with today's date in long format: e.g. **Tuesday, June 2, 2026** (`format(new Date(), "EEEE, MMMM d, yyyy")`).
- Keep the tabs row (Dashboard / Statistics / Analytics) and the date-range filter button on the right unchanged.
- Bell button stays.

### Changes — `src/pages/Dashboard.tsx`

- Just above the **Compact Financial Strip** (the 3 metric cards), add a single small line of text aligned left:
  - Format: `Today · Tuesday, June 2, 2026`
  - Styling: `text-xs text-muted-foreground font-medium`, small margin below.
- No structural changes to the metric cards themselves or the Jobs / Projects panels.

### Calendar question

You also mentioned "change the calendar in the location." I'm not sure which calendar you mean — the small date-range picker in the header, the upcoming events list, or another one. I'll leave calendars alone in this pass; once you confirm which one and where you want it, I'll move it in a follow-up.

### Visual notes

- Stays within the existing minimalist white-card aesthetic and indigo accent.
- Uses `date-fns` (already imported in the header) for the long date format.
- No new dependencies, no new components.
