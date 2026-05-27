import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type JobSourceRow = {
  id: string;
  name: string;
  type: string | null;
  payment_type: "percentage" | "fixed";
  payment_value: number;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type JobSourceInput = Partial<Omit<JobSourceRow, "id" | "created_at" | "updated_at">> & { name: string };

export const useJobSources = () => {
  return useQuery({
    queryKey: ["job_sources"],
    queryFn: async (): Promise<JobSourceRow[]> => {
      const { data, error } = await supabase.from("job_sources").select("*").order("name");
      if (error) throw error;
      return data as JobSourceRow[];
    },
  });
};

export const useJobSourceStats = () => {
  return useQuery({
    queryKey: ["job_source-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("job_source_id, status, actual_amount, amount, job_source_payout, company_profit");
      if (error) throw error;
      const stats: Record<string, { jobs: number; completed: number; revenue: number; commission: number; profit: number }> = {};
      (data ?? []).forEach((j: any) => {
        if (!j.job_source_id) return;
        const s = stats[j.job_source_id] ?? { jobs: 0, completed: 0, revenue: 0, commission: 0, profit: 0 };
        s.jobs++;
        if (j.status === "completed") {
          s.completed++;
          s.revenue += Number(j.actual_amount ?? j.amount ?? 0);
          s.commission += Number(j.job_source_payout ?? 0);
          s.profit += Number(j.company_profit ?? 0);
        }
        stats[j.job_source_id] = s;
      });
      return stats;
    },
  });
};

export const useCreateJobSource = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: JobSourceInput) => {
      const { data, error } = await supabase.from("job_sources").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["job_sources"] });
      toast({ title: "Job source added" });
    },
    onError: (e: any) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
  });
};

export const useUpdateJobSource = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...patch }: { id: string } & Partial<JobSourceInput>) => {
      const { data, error } = await supabase.from("job_sources").update(patch).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["job_sources"] });
      qc.invalidateQueries({ queryKey: ["jobs"] });
      toast({ title: "Job source updated" });
    },
    onError: (e: any) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
  });
};

export const useDeleteJobSource = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("job_sources").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["job_sources"] });
      toast({ title: "Job source removed" });
    },
    onError: (e: any) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
  });
};
