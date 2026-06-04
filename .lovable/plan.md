## Goal

On the Jobs page, the three‑dot Actions button on every job row/card should let you actually change that job's status — Mark Complete, Reschedule, Cancel, Reopen, Send to Estimate — and the change should immediately show on the card (status badge updates, tab counts update, filters re-apply).

The UI for this already exists (dropdown + status modal), but the wiring has a few gaps that make it feel broken. This plan fixes those gaps. No backend / payout work in this step — that's a separate plan.

## What's broken today

1. **Stale hook state.** `useJobsData` keeps its own internal `jobs` array seeded from `localJobs`. When you complete/cancel/reschedule from the modal, Jobs.tsx updates `localJobs` and the global mock store, but the hook's internal copy only refreshes when the `localJobs` reference changes — and the hook also overwrites `filteredJobs` with its own copy, so the new status sometimes doesn't render until you click a filter.
2. **No toast / no visible feedback** after Cancel, Reschedule, or Reopen — only Complete shows a toast, so users think nothing happened.
3. **Reopen from a completed/cancelled job** goes through `handleReopenJob`, but the dropdown only offers it for cancelled jobs and not consistently for completed ones.
4. **"Send to Estimate"** currently just logs + navigates after 1.5s with no clear toast on the row.

## What changes

### 1. Make status updates the single source of truth
- In `src/pages/Jobs.tsx`, route every status action (`handleCompleteJob`, `handleCancelJob`, `handleLocalRescheduleJob`, `handleLocalReopenJob`) through one path that:
  - Updates `localJobs` (already done)
  - Updates the global mock store via `useGlobalState` (already done)
  - Closes the status modal
  - Shows a toast describing the action
- Remove the duplicate `handleCompleteJob` / `handleCancelJob` inside `useJobsData` (they mutate a stale internal copy and aren't called from the modal path). Keep only `openStatusModal`, `closeStatusModal`, `handleRescheduleJob`, `handleReopenJob` for selection state.

### 2. Keep `useJobsData` in sync with the latest jobs
- In `useJobsData`, when `initialJobsData` changes, also reset `selectedJob` if that job's status changed, so the modal never shows stale data.
- Re-run `applyFilters` against the freshly received `initialJobsData` so the row re-renders with the new badge instantly.

### 3. Tighten the Actions dropdown (`JobActions.tsx`)
- Active jobs: View / Update, Mark Complete, Mark In Progress, Reschedule, Send to Estimate, Cancel Job.
- Completed jobs: View / Update, Edit Amount, Reopen as Scheduled, Reopen as In Progress.
- Cancelled jobs: View / Update, Reopen as Scheduled, Reopen as In Progress.
- Each item opens the existing `UpdateJobStatusModal` with the right initial status preselected — no new modal.

### 4. Feedback on every action
- Add toasts for cancel ("Job cancelled"), reschedule ("Job rescheduled to …"), reopen ("Job reopened"), send to estimate ("Sent to Estimates").
- After the modal submits, the row's status badge color (yellow / black / green / red) reflects the new status immediately.

### 5. Tab counts stay correct
- The "All / Scheduled / In Progress / Completed / Cancelled" tabs already count from `jobs.filter(...)`. Because step 1+2 makes the jobs list update synchronously, counts will move with every action automatically — verify after wiring.

## Out of scope (separate plan)

- Persisting jobs to the real Supabase `jobs` table.
- Auto-calculating technician payout / job source payout / company profit (the backend trigger + Dashboard / Finance wiring).
- Any payment-status or invoicing changes.

## Files touched

- `src/pages/Jobs.tsx` — consolidate status handlers, add toasts.
- `src/hooks/jobs/useJobsData.tsx` — drop duplicate complete/cancel handlers, keep filters in sync with incoming jobs.
- `src/components/jobs/JobActions.tsx` — add "Mark In Progress", "Reopen as Scheduled / In Progress" items where missing.
- `src/components/jobs/UpdateJobStatusModal.tsx` — make sure `initialStatus="in_progress"` is handled (currently only completed/cancelled/reschedule/estimate get a sub-form; "in progress" should submit immediately as a status change).

## Verification

After the change, on the Jobs page:
- Click ⋯ → Mark Complete → enter amount → Update Status. Card badge turns green, "Completed" tab count +1, toast appears.
- Click ⋯ → Cancel Job → enter reason → Update Status. Card badge turns red, toast appears.
- Click ⋯ → Reschedule → pick new date/time → Update Status. Card date updates, badge becomes yellow ("Scheduled"), toast appears.
- On a completed job, click ⋯ → Reopen as In Progress. Badge turns black, toast appears.
