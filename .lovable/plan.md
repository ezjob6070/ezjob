## Goal
On the Dashboard's top metric row, replace the **Period Profit** card with an **Expenses** card styled in red with a minus sign in front of the amount.

## Change
File: `src/components/dashboard/MetricsOverview.tsx`

- Compute `periodExpenses` = `periodRevenue * 0.4` (inverse of the existing 60% profit assumption, so numbers stay consistent with mock data until real expense data is wired up).
- Replace the 4th `DashboardMetricCard` (currently "Period Profit", green gradient, DollarSign icon) with:
  - **title:** "Expenses"
  - **value:** `-${formatCurrency(periodExpenses)}` (minus sign prefixed)
  - **icon:** `TrendingDown` (lucide)
  - **className:** red gradient `bg-gradient-to-br from-red-500 to-red-600` to match the existing vibrant card style of the other 3 cards
  - **trend:** `{ value: "↓", isPositive: false }`
  - **onClick:** open the existing `metrics` detail dialog (keeps wiring intact)

## Out of scope
- The other 3 cards (Completed Jobs, Active Jobs, Period Revenue) stay as-is.
- No backend / data-model changes; expenses use a derived placeholder until a real expenses source is added.
