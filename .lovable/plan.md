## Problem

The two metric cards (New This Month, Converted) at the top of the Leads page feel heavy and take up too much vertical space for only two numbers. They push the table down and visually compete with the toolbar.

## Recommendation

Replace the card grid with a **slim inline stat strip** sitting just above the search/filter toolbar. Compact, scannable, no boxes — same information, a fraction of the height.

### Visual concept

```text
 Leads · 128 total   |   New this month  12   |   Converted  34  (27%)
 ─────────────────────────────────────────────────────────────────────
 [ Search leads... ]  [Status ▾]  [Date ▾]  [Sort ▾]   [+ Add Lead]
```

- One single horizontal row, small text, muted labels, bold numbers.
- Tiny colored dot/icon before each metric (blue for new, green for converted) for quick recognition.
- A faint divider underneath separates it from the toolbar.
- On mobile: wraps to two lines, no card chrome.

### Changes

1. **`src/components/leads/LeadValueStats.tsx`** — Rewrite as an inline `<div>` strip:
   - Flex row, `text-sm`, muted labels + `font-semibold` numbers
   - Three inline stats: Total leads, New this month, Converted (with % rate)
   - No `Card`, no icons-in-rounded-boxes, no large headings
   - Bottom border for subtle separation

2. **`src/pages/LeadsClients.tsx`** — No structural change; component slot stays the same so it just renders smaller.

### Alternative options (if you prefer)

- **A. Hide metrics entirely** on the list page and show them only on a Dashboard. Cleanest list view.
- **B. Move metrics into a single right-aligned summary** next to the page title ("128 leads · 12 new · 34 converted"). Most minimal.
- **C. Keep cards but make them half-height and full-width** in one row of 3 small tiles.

My recommendation is the **inline strip** — it keeps the info visible without dominating the page. Let me know if you'd rather go with A, B, or C instead.
