## Goal
Drop the "Salesmen" concept from two surfaces: the Technicians (Team Management) page and the Finance Report. No backend/data changes — purely UI presentation.

## Changes

### 1. Team Management — `src/pages/Technicians.tsx`
- Remove the "Salesmen" role filter card (the green Briefcase card).
- Remove the `salesmanCount` calc and the `salesman` entry from the role color map.
- Update the page subtitle "Manage your technicians, salesmen, contractors..." → "Manage your technicians, contractors and their payment structures".
- Leave the underlying technician records with `role: "salesman"` untouched (they just won't have a dedicated filter card). The "All" card still includes them.

### 2. Finance Report — `src/pages/Finance.tsx`
- Remove the `Salesmen` tab: drop the `<TabsTrigger value="salesmen">` and the `<TabsContent value="salesmen">` block.
- Remove the `import SalesmenDashboard` line.
- Adjust the tabs grid column count accordingly.

### Out of scope
- `src/components/finance/SalesmenDashboard.tsx`, role enum in `src/types/technician.ts`, validations, role select in technician forms, table/card role badges, sample data — all kept as-is so nothing else breaks. We're only hiding the entry points the user mentioned.
- No changes to Job Sources page, Dashboard, or any other surface.

### Files touched
- `src/pages/Technicians.tsx`
- `src/pages/Finance.tsx`
