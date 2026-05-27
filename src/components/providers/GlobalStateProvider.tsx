import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface Job {
  id: string;
  title: string;
  clientName: string;
  scheduledDate?: string;
  date?: string;
  status: "completed" | "in_progress" | "canceled" | "scheduled" | "rescheduled";
  amount: number;
  actualAmount?: number;
  technicianId?: string;
  jobSourceId?: string;
  technicianPayout?: number;
  jobSourcePayout?: number;
  companyProfit?: number;
  [key: string]: any;
}

interface Technician {
  id: string;
  name: string;
  email: string;
  phone?: string;
  specialty: string;
  hireDate: string;
  status: "active" | "inactive" | "onLeave";
  paymentType: "percentage" | "flat" | "hourly" | "salary";
  paymentRate: number;
  hourlyRate: number;
  completedJobs?: number;
  cancelledJobs?: number;
  totalRevenue?: number;
  rating?: number;
  salaryBasis?: string;
  [key: string]: any;
}

interface JobSource {
  id: string;
  name: string;
  type: string;
  paymentType?: string;
  paymentValue?: number;
  isActive?: boolean;
  totalJobs?: number;
  totalRevenue?: number;
  profit?: number;
  createdAt?: string;
  [key: string]: any;
}

interface GlobalStateContextProps {
  currentIndustry: string;
  setCurrentIndustry: (industry: string) => void;
  dateFilter: DateRange | undefined;
  setDateFilter: (range: DateRange | undefined) => void;
  serviceCategory: string;
  setServiceCategory: (category: string) => void;
  jobs: Job[];
  technicians: Technician[];
  jobSources: JobSource[];
  loading: boolean;
  refresh: () => Promise<void>;
  addJob?: (job: Job) => void;
  completeJob?: (id: string) => void;
  cancelJob?: (id: string) => void;
  addTechnician?: (technician: Technician) => void;
  updateTechnician?: (id: string, technician: Technician) => void;
  addJobSource?: (jobSource: JobSource) => void;
  updateJobSource?: (id: string, jobSource: JobSource) => void;
}

const GlobalStateContext = createContext<GlobalStateContextProps | undefined>(undefined);

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) throw new Error("useGlobalState must be used within a GlobalStateProvider");
  return context;
};

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [currentIndustry, setCurrentIndustry] = useState("service");
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [serviceCategory, setServiceCategory] = useState("All Services");

  const [jobs, setJobs] = useState<Job[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [jobSources, setJobSources] = useState<JobSource[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    const [jobsRes, techRes, srcRes] = await Promise.all([
      supabase.from("jobs").select("*").order("scheduled_date", { ascending: false, nullsFirst: false }),
      supabase.from("technicians").select("*").order("name"),
      supabase.from("job_sources").select("*").order("name"),
    ]);

    const mappedJobs: Job[] = (jobsRes.data || []).map((j: any) => ({
      id: j.id,
      title: j.title,
      clientName: j.client_name,
      scheduledDate: j.scheduled_date,
      status: j.status,
      amount: Number(j.amount) || 0,
      actualAmount: j.actual_amount != null ? Number(j.actual_amount) : undefined,
      technicianId: j.technician_id,
      jobSourceId: j.job_source_id,
      technicianPayout: Number(j.technician_payout) || 0,
      jobSourcePayout: Number(j.job_source_payout) || 0,
      companyProfit: Number(j.company_profit) || 0,
    }));

    const mappedTechs: Technician[] = (techRes.data || []).map((t: any) => ({
      id: t.id,
      name: t.name,
      email: t.email || "",
      phone: t.phone || undefined,
      specialty: t.specialty || "",
      hireDate: t.hire_date || "",
      status: t.status,
      paymentType: t.payment_type,
      paymentRate: Number(t.payment_rate) || 0,
      hourlyRate: Number(t.hourly_rate) || 0,
    }));

    const mappedSources: JobSource[] = (srcRes.data || []).map((s: any) => {
      const sourceJobs = mappedJobs.filter((j) => j.jobSourceId === s.id);
      const totalRevenue = sourceJobs.reduce((sum, j) => sum + (j.actualAmount ?? j.amount ?? 0), 0);
      const profit = sourceJobs.reduce((sum, j) => sum + (j.companyProfit ?? 0), 0);
      return {
        id: s.id,
        name: s.name,
        type: s.type || undefined,
        paymentType: s.payment_type,
        paymentValue: Number(s.payment_value) || 0,
        isActive: s.is_active,
        totalJobs: sourceJobs.length,
        totalRevenue,
        profit,
        createdAt: s.created_at,
      };
    });

    setJobs(mappedJobs);
    setTechnicians(mappedTechs);
    setJobSources(mappedSources);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();

    const channel = supabase
      .channel("global-state-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "jobs" }, fetchAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "technicians" }, fetchAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "job_sources" }, fetchAll)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <GlobalStateContext.Provider
      value={{
        currentIndustry,
        setCurrentIndustry,
        dateFilter,
        setDateFilter,
        serviceCategory,
        setServiceCategory,
        jobs,
        technicians,
        jobSources,
        loading,
        refresh: fetchAll,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};
