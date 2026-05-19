## Remove Employed sidebar entry

**File:** `src/components/sidebar/sidebarConstants.tsx`

Delete the `Employed` nav item (lines 87–91) from `commonNavItems`. The `/employed` route itself stays in place so any existing links still work, but it is no longer listed in the sidebar.

No other files need changes.