## Goal

Make the `/dashboard` (route `Dashboard.tsx`) feel lighter, friendlier, and more polished — especially on mobile. The top "Project / Profit / Revenue / etc." metric row currently dominates the page; we'll shrink it, soften the visual weight, and tighten the rest.

## What changes (presentation only)

### 1. Slim down the top metrics row
- Reduce from 4 large KPI cards to a **compact stat strip**:
  - Mobile: `grid-cols-2`, smaller `p-3` cards, icon 28×28 in tinted soft circle (`bg-primary/10`)
  - Tablet+: `grid-cols-4`, still compact (`p-4`)
- Values: `text-lg sm:text-xl font-semibold tabular-nums` (was `text-2xl font-bold`)
- Title: `text-xs text-muted-foreground uppercase tracking-wide`
- Trend chips become tiny pill badges with ↑/↓ icon and soft background
- Drop heavy gradient/vibrant variants; use white card + subtle border, matches project's minimalist identity

### 2. Reduce vertical weight of "Profit / Revenue" headline area
- Smaller page title row, single line, `text-lg sm:text-xl font-semibold tracking-tight`
- Remove redundant subtitle if duplicated
- Tighter header padding (`py-3 sm:py-4`)

### 3. Card & spacing rhythm
- Section gap: `space-y-4 sm:space-y-6` (currently uneven)
- Card radius standardized to `rounded-xl`, `shadow-sm`, `border-border`
- Card header padding `pb-2 pt-4 px-4 sm:px-5`, content `px-4 sm:px-5 pb-4`
- Replace hardcoded grays with semantic tokens (`text-muted-foreground`, `bg-card`, `border-border`)

### 4. Charts row
- Stacked single column on mobile, 2-col on `lg:`
- Chart heights: `h-56 sm:h-64` (smaller than 80 / 72)
- Tooltip + grid styled to match card surface
- Legend below chart on mobile, smaller dots

### 5. Today's appointments / activity list
- Each row → clean compact card on mobile: priority dot, name + time on row 1, job type + address muted on row 2
- Single tap-target height `min-h-11`

### 6. Search bar
- Full-width on mobile, `max-w-md` on desktop
- `h-11` + 16px font (prevents iOS zoom), `rounded-xl`, focus ring uses `--ring`

### 7. Tab switcher (Dashboard / Statistics / Analytics)
- Horizontally scrollable on mobile, no clipping
- Active = primary underline (not heavy pill), medium weight

### 8. Micro-polish
- Tabular numerals on all numeric values
- Subtle hover lift on cards: `hover:-translate-y-0.5 hover:shadow-md transition`
- Friendly empty-state hints where lists could be empty

## Files touched

- `src/pages/Dashboard.tsx` — grid columns, spacing, header, search
- `src/components/StatCard.tsx` — compact variant (smaller value, tighter padding)
- `src/components/dashboard/DashboardHeader.tsx` — title size + tab polish
- `src/components/dashboard/MetricsOverview.tsx` — mobile-friendly grid
- `src/components/dashboard/PerformanceCard.tsx` — chart sizing
- `src/components/dashboard/TopTechniciansCard.tsx` — mobile rows
- `src/components/dashboard/ActivitySection.tsx` — mobile list polish

## Out of scope

- No data, routing, or business-logic changes
- No new pages or features
- Palette and typography family unchanged (stays minimalist white + blue accent)
- Memory respected: no metric cards added to Tasks/Schedule
