import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type TechnicianRow = {
  id: string;
  user_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  role: "technician" | "contractor" | "employee";
  status: "active" | "inactive" | "on_leave";
  payment_type: "percentage" | "flat" | "hourly" | "salary";
  payment_rate: number;
  hourly_rate: number | null;
  specialty: string | null;
  hire_date: string | null;
  notes: string | null;
  profile_image: string | null;
  created_at: string;
  updated_at: string;
};

export type TechnicianInput = Partial<Omit<TechnicianRow, "id" | "created_at" | "updated_at">> & { name: string };

export const useTechnicians = () => {
  return useQuery({
    queryKey: ["technicians"],
    queryFn: async (): Promise<TechnicianRow[]> => {
      const { data, error } = await supabase
        .from("technicians")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as TechnicianRow[];
    },
  });
};

export const useTechnicianStats = () => {
  return useQuery({
    queryKey: ["technician-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("technician_id, status, actual_amount, amount, technician_payout");
      if (error) throw error;
      const stats: Record<string, { jobsTotal: number; jobsCompleted: number; revenue: number; earned: number }> = {};
      (data ?? []).forEach((j: any) => {
        if (!j.technician_id) return;
        const s = stats[j.technician_id] ?? { jobsTotal: 0, jobsCompleted: 0, revenue: 0, earned: 0 };
        s.jobsTotal++;
        if (j.status === "completed") {
          s.jobsCompleted++;
          s.revenue += Number(j.actual_amount ?? j.amount ?? 0);
          s.earned += Number(j.technician_payout ?? 0);
        }
        stats[j.technician_id] = s;
      });
      return stats;
    },
  });
};

export const useCreateTechnician = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: TechnicianInput) => {
      const { data, error } = await supabase.from("technicians").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["technicians"] });
      toast({ title: "Technician added" });
    },
    onError: (e: any) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
  });
};

export const useUpdateTechnician = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...patch }: { id: string } & Partial<TechnicianInput>) => {
      const { data, error } = await supabase.from("technicians").update(patch).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["technicians"] });
      qc.invalidateQueries({ queryKey: ["jobs"] });
      toast({ title: "Technician updated" });
    },
    onError: (e: any) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
  });
};

export const useDeleteTechnician = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("technicians").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["technicians"] });
      toast({ title: "Technician removed" });
    },
    onError: (e: any) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
  });
};
