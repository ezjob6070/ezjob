
import React, { createContext, useState, useContext, ReactNode } from "react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";

// Define mock data types
interface Job {
  id: string;
  title: string;
  clientName: string;
  scheduledDate?: string;
  status: "completed" | "in_progress" | "canceled" | "scheduled" | "rescheduled";
  amount: number;
  actualAmount?: number;
  // Add other job properties as needed
}

interface Technician {
  id: string;
  name: string;
  // Add other technician properties as needed
}

interface JobSource {
  id: string;
  name: string;
  // Add other jobSource properties as needed
}

interface GlobalStateContextProps {
  currentIndustry: string;
  setCurrentIndustry: (industry: string) => void;
  dateFilter: DateRange | undefined;
  setDateFilter: (range: DateRange | undefined) => void;
  serviceCategory: string;
  setServiceCategory: (category: string) => void;
  // Add missing properties that are being used in other components
  jobs: Job[];
  technicians: Technician[];
  jobSources: JobSource[];
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
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [currentIndustry, setCurrentIndustry] = useState("service");
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7)
  });
  const [serviceCategory, setServiceCategory] = useState("All Services");

  // Mock data for jobs
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: "job-1",
      title: "AC Repair",
      clientName: "John Doe",
      scheduledDate: "2023-05-02",
      status: "completed",
      amount: 250
    },
    {
      id: "job-2",
      title: "Plumbing Installation",
      clientName: "Jane Smith",
      scheduledDate: "2023-05-03",
      status: "in_progress",
      amount: 350
    },
    {
      id: "job-3",
      title: "Electrical Work",
      clientName: "Robert Johnson",
      scheduledDate: "2023-05-04",
      status: "scheduled",
      amount: 400
    }
  ]);

  // Mock data for technicians
  const [technicians, setTechnicians] = useState<Technician[]>([
    { id: "tech-1", name: "Mike Wilson" },
    { id: "tech-2", name: "Sarah Johnson" }
  ]);

  // Mock data for job sources
  const [jobSources, setJobSources] = useState<JobSource[]>([
    { id: "source-1", name: "Website" },
    { id: "source-2", name: "Referral" }
  ]);

  // Job management functions
  const addJob = (job: Job) => {
    setJobs([...jobs, job]);
  };

  const completeJob = (id: string) => {
    setJobs(jobs.map(job => job.id === id ? {...job, status: "completed"} : job));
  };

  const cancelJob = (id: string) => {
    setJobs(jobs.map(job => job.id === id ? {...job, status: "canceled"} : job));
  };

  // Technician management functions
  const addTechnician = (technician: Technician) => {
    setTechnicians([...technicians, technician]);
  };

  const updateTechnician = (id: string, updatedTechnician: Technician) => {
    setTechnicians(technicians.map(tech => tech.id === id ? updatedTechnician : tech));
  };

  // Job source management functions
  const addJobSource = (jobSource: JobSource) => {
    setJobSources([...jobSources, jobSource]);
  };

  const updateJobSource = (id: string, updatedJobSource: JobSource) => {
    setJobSources(jobSources.map(source => source.id === id ? updatedJobSource : source));
  };

  return (
    <GlobalStateContext.Provider value={{
      currentIndustry,
      setCurrentIndustry,
      dateFilter,
      setDateFilter,
      serviceCategory,
      setServiceCategory,
      jobs,
      technicians,
      jobSources,
      addJob,
      completeJob,
      cancelJob,
      addTechnician,
      updateTechnician,
      addJobSource,
      updateJobSource
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
