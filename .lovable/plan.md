# Add "Convert to Client" to Leads

Add a one-click action on every lead row that creates a matching client record and marks the lead as `converted`, so the sales pipeline stays clean and the new customer appears in the Clients tab.

## What the user will see

- A new **"Convert to Client"** button on each row of the Leads table (in the actions column, with a user-plus icon).
- Clicking it opens a small confirmation dialog showing the lead's name + a preview of what will be copied (name, company, email, phone).
- On confirm:
  - The lead's status changes to **Converted** (badge updates instantly).
  - A new client appears at the top of the Clients tab with the same contact info, status `active`.
  - A success toast: *"John Doe has been converted to a client."* with a "View client" link.
- A new **"Hide converted leads"** toggle on the Leads toolbar (on by default) so converted leads don't clutter the pipeline but can be shown when needed.
- Already-converted leads show the **Convert** button as disabled with tooltip "Already converted".

## Implementation outline

**Frontend only — no schema change needed.** Existing `leads.status` enum already supports `converted`, and the `clients` table already has all needed fields.

1. **`src/components/LeadsTable.tsx`** (and/or `src/components/leads/LeadsTable.tsx` — whichever the page uses)
   - Add an actions cell with a `UserPlus` icon button → calls `onConvert(lead)`.
   - Disable when `lead.status === "converted"`.

2. **`src/pages/LeadsClients.tsx`**
   - New `handleConvertLead(lead)` function:
     - Insert into `clients` via Supabase with `{ name, company, email, phone, status: 'active', initials }`.
     - Update the lead row: `status = 'converted'`.
     - Update local state for both lists.
     - Show toast.
   - New `ConvertLeadDialog` (simple AlertDialog) for confirmation.
   - Add a `hideConverted` toggle (Switch) in the leads toolbar; default `true`. Filter in `filteredLeads`.

3. **Edge case**: if a client with the same email already exists, show a warning toast and skip the insert (still mark lead converted, link to existing client).

## Technical notes

- Uses existing `supabase.from('clients').insert(...)` and `.from('leads').update(...)` — RLS already permits admins/managers.
- No new tables, no migration, no new dependencies.
- `initials` computed from name (first letters of first + last word).
- Sort order: new client gets `created_at = now()`, so it naturally appears at the top of "Newest first".

Confirm and I'll implement it.
