# Phase 1 — Make the backend real (Jobs money engine)

Goal: every job calculates the 3-way split (Technician / Job Source / Company), persists forever, and rolls up into clean totals on Technicians, Job Sources, Dashboard, and Finance pages.

## What gets built

**1. Authentication wall**
- `/auth` page with email/password + Google sign-in
- All app routes protected — no session, redirect to `/auth`
- First signup = `admin`, rest = `employee` (admin can promote later)
- Logout + user name in header

**2. Database tables** (with RLS + GRANTs)
- `technicians` — name, email, phone, role (technician/contractor/employee), payment_type (percentage/flat/hourly/salary), payment_rate, hourly_rate, status, hire_date, specialty, notes
- `job_sources` — name, type, payment_type (percentage/fixed), payment_value (0 allowed for free sources like Google Ads), contact info, is_active, notes
- `jobs` — job_number, title, client_name/phone/email/address, technician_id, job_source_id, scheduled_date, status (scheduled/in_progress/completed/cancelled), amount, actual_amount, payment_status, payment_method, description, notes, cancellation_reason, **technician_payout**, **job_source_payout**, **company_profit** (snapshotted at completion so historical splits stay correct if you later change a %)

**3. The money engine**
- When a job is created or edited, a live preview shows: `Tech gets $X / Source gets $Y / Company keeps $Z`
- When a job is marked **completed**, the 3 payout fields are computed from `actual_amount` × the technician's % and the job source's %, then saved to the row
- Manual override on each payout field (for bonuses, eaten costs, etc.)

**4. Pages wired to real data**
- **Jobs page** — list/create/edit/cancel/complete all hit the database. Filters/sorting still work.
- **Technicians page** — real list, each card shows `Total earned / Paid out / Balance owed` (sum from completed jobs)
- **Job Sources page** — real list, each card shows `Jobs brought / Revenue generated / Commission owed / Company profit`
- **Dashboard** — total jobs, revenue, payouts, profit pulled live from DB
- **Finance Overview** — same numbers, broken down by period

**5. Mock data removed**
- `GlobalStateProvider` arrays deleted, replaced with React Query hooks (`useJobs`, `useTechnicians`, `useJobSources`)
- Customers start clean. Optional seed of 2 demo jobs on first admin signup (toggleable).

## Out of scope this phase (Phase 2+)
- Estimates, Payments page, Tasks, Schedule, Projects, Clients deep-wiring, file attachments, GPS, Calls
- These stay on mock data until Phase 1 is rock-solid and tested

## Security model
- Single company, multiple users (your team)
- `SELECT` for all `authenticated` users
- `INSERT/UPDATE/DELETE` restricted to `admin` or `manager` via `has_role()`
- Technicians can update their own assigned jobs only (mark complete, add notes)
- `created_by = auth.uid()` auto-set

## Technical notes
- Payouts stored as columns (not computed at query time) so historical data is immutable
- Generated columns or trigger to keep `company_profit = actual_amount - technician_payout - job_source_payout` in sync on insert/update
- React Query for all data fetching with optimistic updates
- Existing UI/design system untouched — only the data layer changes

Ready to execute. Approve and I'll start with the auth + database migration, then wire Jobs first (the core), then Technicians, then Job Sources, then the Dashboard/Finance rollups.