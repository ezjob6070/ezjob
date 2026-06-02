Move the date filter button from the top-right corner to sit inline with the Dashboard / Statistics / Analytics tabs, and change its label from the current date-range text to "Filter by date" with a calendar icon.

### What changes
1. **DashboardHeader.tsx**
   - Relocate the date filter `Popover` so it appears inside the tab row instead of right-aligned in the header.
   - Update the button label to "Filter by date" (calendar icon stays).
   - Adjust spacing so the tabs + filter still fit on mobile without overflow.

2. **Dashboard.tsx**
   - Verify no hardcoded date-filter references need updating after the move.

### Why this spot
Right next to the section tabs makes the filter clearly control the content below it, rather than feeling like a separate top-right action. It also frees up the header right edge for cleaner spacing.