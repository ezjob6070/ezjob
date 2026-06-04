
CREATE TABLE public.job_status_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  old_status public.job_status,
  new_status public.job_status NOT NULL,
  changed_by UUID,
  changed_by_name TEXT,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_job_status_history_job_id ON public.job_status_history(job_id);
CREATE INDEX idx_job_status_history_created_at ON public.job_status_history(created_at DESC);

GRANT SELECT ON public.job_status_history TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.job_status_history TO authenticated;
GRANT ALL ON public.job_status_history TO service_role;

ALTER TABLE public.job_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view job status history"
  ON public.job_status_history FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins/managers can insert job status history"
  ON public.job_status_history FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "Admins/managers can update job status history"
  ON public.job_status_history FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "Admins/managers can delete job status history"
  ON public.job_status_history FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

CREATE OR REPLACE FUNCTION public.log_job_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  actor_id UUID;
  actor_name TEXT;
BEGIN
  actor_id := auth.uid();
  IF actor_id IS NOT NULL THEN
    SELECT full_name INTO actor_name FROM public.profiles WHERE id = actor_id;
  END IF;

  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.job_status_history (job_id, old_status, new_status, changed_by, changed_by_name, note)
    VALUES (NEW.id, NULL, NEW.status, actor_id, actor_name, 'Job created');
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.job_status_history (job_id, old_status, new_status, changed_by, changed_by_name, note)
    VALUES (NEW.id, OLD.status, NEW.status, actor_id, actor_name, NEW.cancellation_reason);
    RETURN NEW;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_log_job_status_change ON public.jobs;
CREATE TRIGGER trg_log_job_status_change
AFTER INSERT OR UPDATE OF status ON public.jobs
FOR EACH ROW EXECUTE FUNCTION public.log_job_status_change();
