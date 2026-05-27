## Goal

Replace the current Dashboard → **Statistics** tab with a layout that mirrors the reference screenshot (left side): a top metrics row, paired pie/area charts, technician breakdown lists, job source charts, and a 12‑month trend — with filters across the top so the whole page can be sliced by **Job Source, Technician, Area, and Date Range**.

The Dashboard tab and Analytics tab stay untouched. Only the Statistics tab content (`src/components/dashboard/StatisticsTab.tsx`) is rewritten.

## New layout (top → bottom)

1. **Filter bar** (sticky-feeling card, light gray bg, matches existing JobsFilterBar style)
   - Date range picker
   - Technician multi-select (popover + search)
   - Job Source multi-select
   - Area / Region multi-select
   - "Clear all" when any filter active
   - Right side: "Showing X of Y jobs"

2. **Top metric cards** (4 across) — white cards, blue accent, minimal (matching project design memory, no gradient cards):
   - Calls
   - Jobs
   - Total ($ revenue)
   - Company's Cut

3. **Row: Jobs Overview + Jobs By Area** (2 columns)
   - Jobs Overview: pie of Completed / Cancelled / In Progress with legend on the right
   - Jobs By Area: pie of jobs grouped by city/region with legend

4. **Row: Technicians with highest cancelling jobs + Technicians with highest completed jobs** (2 columns)
   - Small pie + ranked list of technician names with counts (like reference)

5. **Row: Job Sources By Sales Amount + Job Sources By Done Jobs** (2 columns)
   - Pie + legend list of each job source with $ or count

6. **Company's Cuts By Last 12 Months** (full width)
   - Bar chart, one bar per month

All charts react to the filter bar.

## Technical notes

- Rewrite `src/components/dashboard/StatisticsTab.tsx`. Keep the file self-contained.
- Pull data from `useGlobalState().jobs` (already used in Dashboard) so filters operate on real job data; fall back to mock data only when arrays are empty.
- Derive metrics with `useMemo`:
  - `filteredJobs` = jobs filtered by date / techs / sources / areas
  - Aggregations for each chart computed from `filteredJobs`
- Use existing UI primitives: `Card`, `Popover`, `Command`, `Button`, `Calendar` (date range), `recharts` `PieChart` / `BarChart`.
- Colors via existing `PIE_COLORS` constant (HSL tokens) — no hardcoded hex, follow design system.
- No metric cards inside Task Management / Schedule (memory respected — this is Dashboard, allowed).
- Keep design minimal: white cards, blue accent, light gray filter bar, rounded corners (matches design memory).

## Out of scope

- Dashboard tab and Analytics tab
- Sidebar, Calls page, MetricsOverview component
- Backend / data persistence — purely a presentational refactor

```text
┌─────────────────────────────────────────────────────────┐
│ [Date ▾] [Technicians ▾] [Sources ▾] [Areas ▾]  X of Y  │
├─────────────────────────────────────────────────────────┤
│ [Calls]   [Jobs]   [Total $]   [Company's Cut $]        │
├──────────────────────────┬──────────────────────────────┤
│ Jobs Overview (pie)      │ Jobs By Area (pie)           │
├──────────────────────────┼──────────────────────────────┤
│ Top Cancelling Techs     │ Top Completed Techs          │
├──────────────────────────┼──────────────────────────────┤
│ Sources By Sales $       │ Sources By Done Jobs         │
├─────────────────────────────────────────────────────────┤
│ Company's Cuts — Last 12 Months (bar)                   │
└─────────────────────────────────────────────────────────┘
```
