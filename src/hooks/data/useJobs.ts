import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type JobRow = {
  id: string;
  job_number: string | null;
  title: string;
  client_name: string;
  client_phone: string | null;
  client_email: string | null;
  address: string | null;
  description: string | null;
  notes: string | null;
  technician_id: string | null;
  job_source_id: string | null;
  scheduled_date: string | null;
  status: "scheduled" | "in_progress" | "completed" | "cancelled" | "rescheduled";
  amount: number;
  actual_amount: number | null;
  payment_status: "unpaid" | "partial" | "paid" | null;
  payment_method: string | null;
  cancellation_reason: string | null;
  technician_payout: number;
  job_source_payout: number;
  company_profit: number;
  created_at: string;
  updated_at: string;
};

export type JobInput = Partial<Omit<JobRow, "id" | "created_at" | "updated_at" | "technician_payout" | "job_source_payout" | "company_profit">> & {
  title: string;
  client_name: string;
};

export const useJobs = () => {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: async (): Promise<JobRow[]> => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("scheduled_date", { ascending: false, nullsFirst: false });
      if (error) throw error;
      return data as JobRow[];
    },
  });
};

export const useCreateJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: JobInput) => {
      const { data, error } = await supabase.from("jobs").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      qc.invalidateQueries({ queryKey: ["technician-stats"] });
      qc.invalidateQueries({ queryKey: ["job_source-stats"] });
      toast({ title: "Job created" });
    },
    onError: (e: any) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
  });
};

export const useUpdateJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...patch }: { id: string } & Partial<JobInput>) => {
      const { data, error } = await supabase.from("jobs").update(patch).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      qc.invalidateQueries({ queryKey: ["technician-stats"] });
      qc.invalidateQueries({ queryKey: ["job_source-stats"] });
      toast({ title: "Job updated" });
    },
    onError: (e: any) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
  });
};

export const useDeleteJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("jobs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      toast({ title: "Job deleted" });
    },
    onError: (e: any) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
  });
};

// Live preview helper for the create/edit job form
export const calculatePayoutPreview = (params: {
  amount: number;
  techPaymentType?: "percentage" | "flat" | "hourly" | "salary";
  techRate?: number;
  srcPaymentType?: "percentage" | "fixed";
  srcValue?: number;
}) => {
  const { amount, techPaymentType, techRate = 0, srcPaymentType, srcValue = 0 } = params;
  let tech = 0;
  if (techPaymentType === "percentage") tech = (amount * techRate) / 100;
  else if (techPaymentType === "flat") tech = techRate;
  let src = 0;
  if (srcPaymentType === "percentage") src = (amount * srcValue) / 100;
  else if (srcPaymentType === "fixed") src = srcValue;
  const profit = amount - tech - src;
  return { tech: Math.round(tech * 100) / 100, src: Math.round(src * 100) / 100, profit: Math.round(profit * 100) / 100 };
};
