
-- ============ TECHNICIANS ============
CREATE TYPE public.technician_role AS ENUM ('technician', 'contractor', 'employee');
CREATE TYPE public.technician_status AS ENUM ('active', 'inactive', 'on_leave');
CREATE TYPE public.payment_type AS ENUM ('percentage', 'flat', 'hourly', 'salary');

CREATE TABLE public.technicians (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text,
  phone text,
  role public.technician_role NOT NULL DEFAULT 'technician',
  status public.technician_status NOT NULL DEFAULT 'active',
  payment_type public.payment_type NOT NULL DEFAULT 'percentage',
  payment_rate numeric NOT NULL DEFAULT 40,
  hourly_rate numeric DEFAULT 0,
  specialty text,
  hire_date date,
  notes text,
  profile_image text,
  created_by uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.technicians TO authenticated;
GRANT ALL ON public.technicians TO service_role;

ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view technicians"
  ON public.technicians FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins/managers can insert technicians"
  ON public.technicians FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

CREATE POLICY "Admins/managers can update technicians"
  ON public.technicians FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

CREATE POLICY "Admins/managers can delete technicians"
  ON public.technicians FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

CREATE TRIGGER set_technicians_updated_at
  BEFORE UPDATE ON public.technicians
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ JOB SOURCES ============
CREATE TYPE public.commission_type AS ENUM ('percentage', 'fixed');

CREATE TABLE public.job_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text,
  payment_type public.commission_type NOT NULL DEFAULT 'percentage',
  payment_value numeric NOT NULL DEFAULT 0,
  contact_person text,
  email text,
  phone text,
  website text,
  is_active boolean NOT NULL DEFAULT true,
  notes text,
  created_by uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_sources TO authenticated;
GRANT ALL ON public.job_sources TO service_role;

ALTER TABLE public.job_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view job sources"
  ON public.job_sources FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins/managers can insert job sources"
  ON public.job_sources FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

CREATE POLICY "Admins/managers can update job sources"
  ON public.job_sources FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

CREATE POLICY "Admins/managers can delete job sources"
  ON public.job_sources FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

CREATE TRIGGER set_job_sources_updated_at
  BEFORE UPDATE ON public.job_sources
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ JOBS ============
CREATE TYPE public.job_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled');
CREATE TYPE public.job_payment_status AS ENUM ('unpaid', 'partial', 'paid');

CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_number text,
  title text NOT NULL,
  client_name text NOT NULL,
  client_phone text,
  client_email text,
  address text,
  description text,
  notes text,
  technician_id uuid REFERENCES public.technicians(id) ON DELETE SET NULL,
  job_source_id uuid REFERENCES public.job_sources(id) ON DELETE SET NULL,
  scheduled_date timestamptz,
  status public.job_status NOT NULL DEFAULT 'scheduled',
  amount numeric NOT NULL DEFAULT 0,
  actual_amount numeric,
  payment_status public.job_payment_status DEFAULT 'unpaid',
  payment_method text,
  cancellation_reason text,
  technician_payout numeric NOT NULL DEFAULT 0,
  job_source_payout numeric NOT NULL DEFAULT 0,
  company_profit numeric NOT NULL DEFAULT 0,
  created_by uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_jobs_technician ON public.jobs(technician_id);
CREATE INDEX idx_jobs_source ON public.jobs(job_source_id);
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_scheduled ON public.jobs(scheduled_date);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.jobs TO authenticated;
GRANT ALL ON public.jobs TO service_role;

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view jobs"
  ON public.jobs FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins/managers can insert jobs"
  ON public.jobs FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

CREATE POLICY "Admins/managers can update any job"
  ON public.jobs FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

CREATE POLICY "Technicians can update own assigned jobs"
  ON public.jobs FOR UPDATE TO authenticated
  USING (
    technician_id IN (
      SELECT id FROM public.technicians WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins/managers can delete jobs"
  ON public.jobs FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

CREATE TRIGGER set_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ AUTO-CALCULATE PAYOUTS ============
CREATE OR REPLACE FUNCTION public.calculate_job_payouts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tech_payment_type public.payment_type;
  tech_rate numeric;
  src_payment_type public.commission_type;
  src_value numeric;
  base_amount numeric;
BEGIN
  base_amount := COALESCE(NEW.actual_amount, NEW.amount, 0);

  -- Only auto-calc if payouts not manually set (still default 0) OR amount changed
  -- We always recompute on insert/update unless user provided explicit non-zero payouts
  -- Strategy: recompute payouts every time unless caller explicitly sets them different from default calc.
  -- Simpler: always recompute; manual overrides happen via separate update without trigger trickery.

  -- Technician cut
  IF NEW.technician_id IS NOT NULL THEN
    SELECT payment_type, payment_rate INTO tech_payment_type, tech_rate
    FROM public.technicians WHERE id = NEW.technician_id;

    IF tech_payment_type = 'percentage' THEN
      NEW.technician_payout := ROUND(base_amount * COALESCE(tech_rate,0) / 100.0, 2);
    ELSIF tech_payment_type = 'flat' THEN
      NEW.technician_payout := COALESCE(tech_rate, 0);
    ELSE
      NEW.technician_payout := 0;
    END IF;
  ELSE
    NEW.technician_payout := 0;
  END IF;

  -- Job source cut
  IF NEW.job_source_id IS NOT NULL THEN
    SELECT payment_type, payment_value INTO src_payment_type, src_value
    FROM public.job_sources WHERE id = NEW.job_source_id;

    IF src_payment_type = 'percentage' THEN
      NEW.job_source_payout := ROUND(base_amount * COALESCE(src_value,0) / 100.0, 2);
    ELSE
      NEW.job_source_payout := COALESCE(src_value, 0);
    END IF;
  ELSE
    NEW.job_source_payout := 0;
  END IF;

  NEW.company_profit := base_amount - NEW.technician_payout - NEW.job_source_payout;

  RETURN NEW;
END;
$$;

CREATE TRIGGER calc_jobs_payouts
  BEFORE INSERT OR UPDATE OF amount, actual_amount, technician_id, job_source_id
  ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.calculate_job_payouts();

-- ============ AUTO-PROMOTE FIRST USER TO ADMIN ============
CREATE OR REPLACE FUNCTION public.promote_first_user_to_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.user_roles) = 1 THEN
    UPDATE public.user_roles SET role = 'admin' WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER first_user_admin
  AFTER INSERT ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.promote_first_user_to_admin();
