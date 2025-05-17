
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
  email: string;
  phone?: string;
  address?: string;
  position?: string;
  department?: string;
  hireDate: string; // Keep this as string only, not Date
  startDate?: string;
  status: "active" | "inactive" | "onLeave";
  specialty: string;
  paymentType: "percentage" | "flat" | "hourly" | "salary"; // Add "salary" as valid option
  paymentRate: number;
  hourlyRate: number;
  salaryBasis?: string;
  incentiveType?: string;
  incentiveAmount?: number;
  rating?: number;
  completedJobs?: number;
  cancelledJobs?: number;
  totalRevenue?: number;
  notes?: string;
  profileImage?: string;
  imageUrl?: string;
  certifications?: string[];
  skills?: string[];
  category?: string;
  // Add other technician properties as needed
}

interface JobSource {
  id: string;
  name: string;
  type?: string;
  paymentType?: string;
  paymentValue?: number;
  isActive?: boolean;
  totalJobs?: number;
  totalRevenue?: number;
  profit?: number;
  createdAt?: string;
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
    { 
      id: "tech-1", 
      name: "Mike Wilson", 
      email: "mike@example.com", 
      specialty: "HVAC",
      hireDate: "2023-01-15",
      status: "active",
      paymentType: "percentage",
      paymentRate: 25,
      hourlyRate: 20
    },
    { 
      id: "tech-2", 
      name: "Sarah Johnson", 
      email: "sarah@example.com", 
      specialty: "Plumbing",
      hireDate: "2023-02-20",
      status: "active",
      paymentType: "hourly",
      paymentRate: 30,
      hourlyRate: 30
    }
  ]);

  // Mock data for job sources
  const [jobSources, setJobSources] = useState<JobSource[]>([
    { 
      id: "source-1", 
      name: "Website",
      type: "Online",
      paymentType: "Fixed",
      paymentValue: 100,
      isActive: true,
      totalJobs: 25,
      totalRevenue: 5000,
      profit: 2000,
      createdAt: "2023-01-01"
    },
    { 
      id: "source-2", 
      name: "Referral",
      type: "Personal",
      paymentType: "Percentage",
      paymentValue: 10,
      isActive: true,
      totalJobs: 15,
      totalRevenue: 3000,
      profit: 1500,
      createdAt: "2023-02-01"
    }
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
