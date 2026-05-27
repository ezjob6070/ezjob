## Goal

Refine the Statistics tab so it doesn't mirror the reference 1:1. Same data, simpler wording, cleaner grouping, less visual noise.

## Renames (clearer, plain English)

- "Calls" → **Calls Received**
- "Jobs" → **Total Jobs**
- "Total" → **Revenue**
- "Company's Cut" → **Net Profit**
- "Jobs Overview" → **Job Status Breakdown**
- "Jobs By Area" → **Jobs by Region**
- "Technicians with the highest cancelling jobs" → **Most Cancellations by Technician**
- "Technicians with the highest completed jobs" → **Top Performing Technicians**
- "Job Sources By Sales Amount" → **Revenue by Source**
- "Job Sources By Done Jobs" → **Completed Jobs by Source**
- "Company's Cuts By Last 12 Months" → **Monthly Profit Trend**

## Structural simplification

1. Keep the filter bar (date, technicians, sources, regions) — already clean.
2. Keep 4 top metric cards but add a tiny one-line caption under each value (e.g. "this period", "across all sources") so the number has context.
3. Merge the two technician rows into **one card with a Tabs toggle** ("Top Performers" / "Most Cancellations") — cuts a full row, reduces scroll, easier to compare.
4. Merge the two source rows into **one card with a Tabs toggle** ("By Revenue" / "By Completed Jobs") — same reasoning.
5. Keep Job Status + Jobs by Region as a 2-column row.
6. Keep Monthly Profit Trend bar chart at the bottom, full width.

Final layout:

```text
[Filters]
[Calls Received] [Total Jobs] [Revenue] [Net Profit]
[Job Status Breakdown]    [Jobs by Region]
[Technicians — tabs: Top / Cancellations]
[Sources — tabs: Revenue / Completed]
[Monthly Profit Trend]
```

## Visual polish

- Drop the "Showing X of Y jobs" microcopy on the right of the filter bar; replace with a subtle clear-all link only when filters are active.
- Pies: thinner ring (innerRadius 55 / outerRadius 80), legend list aligned right with consistent row spacing.
- Limit long legend lists to top 6 entries + "Other" bucket so cards don't get crowded.
- Keep white cards, blue accent, light gray filter bg, rounded corners (existing design system).

## Scope

- Single file: `src/components/dashboard/StatisticsTab.tsx`.
- No changes to Dashboard tab, Analytics tab, sidebar, or data layer.
- Pre-existing TS errors in unrelated files are out of scope.
