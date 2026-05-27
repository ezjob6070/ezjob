## Goal

Bring back a fully working **Actions** button on every row of the Jobs table (including completed and cancelled jobs) so the user can always change a job's status: mark complete, cancel, reschedule, reopen, or send to estimate.

## What's wrong today

- The dropdown trigger renders, but clicking **Update Status** doesn't reliably open the modal (the wiring between `JobActions → JobsTable → JobTabs → JobsContext` is partially broken — `closeStatusModal` is bound to `onOpenChange` with the wrong signature, and `onCancelJob` from the dropdown is a no-op `() => {}`).
- "Cancel Job" item in the dropdown is wired to an empty function in `JobsTable.tsx` (`onCancelJob={() => {}}`), so cancelling from the row does nothing.
- Once a job is **completed**, there's no menu item to reopen it or move it back to scheduled / in-progress.

## What I'll change

### 1. Fix the dropdown wiring (`JobActions.tsx`)
- Always render the action button regardless of job status (completed and cancelled jobs included).
- Status-aware menu items:
  - **Scheduled / In Progress** → Mark Complete, Reschedule, Cancel, Send to Estimate
  - **Completed** → Reopen (set back to in_progress), Edit Amount, Send to Estimate
  - **Cancelled** → Reopen (set back to scheduled)
- Every item triggers the existing `UpdateJobStatusModal` with the right preselected status, so the user lands on the correct form.

### 2. Fix the broken handlers (`JobsTable.tsx`, `JobTabs.tsx`, `JobsContainer.tsx`)
- Pass real `onCancelJob` / `onCompleteJob` / `onReschedule` from the JobsContext down to `JobActions` (no more `() => {}`).
- Fix `onOpenChange={closeStatusModal}` so it correctly receives the boolean from the Dialog and closes the modal on outside click / ESC.
- Add a new `onReopenJob(jobId, newStatus)` handler in `JobsContext` that flips a completed/cancelled job back to scheduled or in_progress.

### 3. Status modal upgrade (`UpdateJobStatusModal.tsx`)
- Accept an initial status from the trigger so "Reopen" lands on the right form instead of defaulting to "completed".
- Add a **Reopen** option to the `StatusSelection` component.

### 4. Visual polish (per design memory)
- Use the existing white-card / blue-accent style for the dropdown — destructive items (Cancel) in red, primary action (Mark Complete) highlighted with the blue accent.

## Out of scope (for now)

- Backend wiring (Supabase persistence + payout auto-calculation) — that's the bigger plan we'll write next, once this row-level action is fixed and you confirm it works.

## Technical notes

- Files touched: `src/components/jobs/JobActions.tsx`, `src/components/jobs/JobsTable.tsx`, `src/components/jobs/JobTabs.tsx`, `src/components/jobs/UpdateJobStatusModal.tsx`, `src/components/jobs/modal/StatusSelection.tsx`, and `src/components/jobs/context/JobsContext.tsx`.
- No DB or schema changes in this pass — purely frontend wiring fixes.
