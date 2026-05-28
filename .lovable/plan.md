# Make EZ Job fit properly on phone screens

## The issue

Right now the app was designed for desktop monitors. When opened on a phone (even installed as a PWA), everything looks tiny because the same wide desktop layout is squeezed into a 375px screen. Tables, sidebars, and dashboards don't reflow — they just shrink.

The fix is to add proper **mobile responsiveness** so the UI rearranges itself based on screen size, instead of just scaling down.

## What I'll change

**1. Sidebar → mobile drawer**
- On phones, hide the fixed left sidebar and replace it with a hamburger menu (top-left) that opens a slide-in drawer.
- Main content gets the full width back (remove the `ml-16` desktop offset on mobile).

**2. Header / top bar**
- Stack title + actions vertically on small screens.
- Shrink padding (`p-4 md:p-6` → tighter on mobile).
- Make search bars full-width on mobile.

**3. Tables → cards on mobile**
- Jobs table, Clients table, Leads table, Technicians table, Estimates list: on screens <768px, render each row as a stacked card (client name, status badge, amount, date, actions) instead of a horizontally-scrolling table.
- Keeps all info visible without pinch-zoom.

**4. Dashboard grids**
- Metric cards: `grid-cols-1` on mobile, `sm:grid-cols-2`, `lg:grid-cols-4`.
- Charts: full-width, reduced height on mobile.
- Two-column sections (Tickets + Performance) stack vertically on phones.

**5. Dialogs and modals**
- Convert large dialogs (Job details, Add Client, Edit Technician, Job Status) to use a bottom-sheet style on mobile via the existing `Drawer` component, while keeping `Dialog` on desktop.

**6. Forms**
- Make inputs full-width on mobile, stack label+field vertically, increase tap target sizes (min `h-11`).

**7. Touch targets and font sizing**
- Buttons: minimum `h-10` on mobile.
- Base font stays readable (no shrinking below 14px).
- Add viewport meta is already correct in `index.html`.

**8. Pages to prioritize (most-used)**
- `/dashboard` (Index.tsx)
- `/jobs` (Jobs.tsx + JobsTable + JobActions)
- `/clients`, `/leads`, `/schedule`, `/technicians`
- Job/Client/Technician detail pages

## Technical notes

- Use the existing `useIsMobile()` hook (already at `src/hooks/use-mobile.tsx`, breakpoint 768px) to conditionally render table vs card layouts and Dialog vs Drawer.
- Use Tailwind's `sm:`, `md:`, `lg:` prefixes — no new dependencies needed.
- `Layout.tsx`: change `ml-16` to `lg:ml-16 ml-0` and add a mobile top bar with hamburger.
- `Sidebar.tsx`: wrap in shadcn `Sheet` component on mobile.
- Keep all existing functionality and business logic untouched — pure presentation changes.

## What this does NOT change

- No backend changes
- No data model changes
- No new features — same screens, just laid out properly for phones
- Desktop view stays exactly as it is today

## After the change

When customers open the installed PWA on their phone, they'll see a proper mobile layout: hamburger menu, stacked cards instead of cramped tables, full-width buttons, and dialogs that slide up from the bottom — like a real mobile app.
