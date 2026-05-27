
import React, { createContext, useState, useContext, ReactNode } from "react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import type { Job } from "@/components/jobs/JobTypes";
import type { Technician } from "@/types/technician";
import type { JobSource } from "@/types/jobSource";

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
  completeJob?: (id: string, actualAmount?: number) => void;
  cancelJob?: (id: string, cancellationReason?: string) => void;
  updateJob?: (id: string, updates: Partial<Job>) => void;
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
      date: "2023-05-02",
      status: "completed",
      amount: 250,
      actualAmount: 250,
      address: "123 Main St"
    },
    {
      id: "job-2",
      title: "Plumbing Installation",
      clientName: "Jane Smith",
      scheduledDate: "2023-05-03",
      date: "2023-05-03",
      status: "in_progress",
      amount: 350,
      address: "456 Oak Ave"
    },
    {
      id: "job-3",
      title: "Electrical Work",
      clientName: "Robert Johnson",
      scheduledDate: "2023-05-04",
      date: "2023-05-04",
      status: "scheduled",
      amount: 400,
      address: "789 Pine Rd"
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
      role: "technician",
      paymentType: "percentage",
      paymentRate: 25,
      hourlyRate: 20,
      salaryBasis: "hourly",
      completedJobs: 12,
      cancelledJobs: 1,
      totalRevenue: 18000,
      rating: 4.8
    },
    { 
      id: "tech-2", 
      name: "Sarah Johnson", 
      email: "sarah@example.com", 
      specialty: "Plumbing",
      hireDate: "2023-02-20",
      status: "active",
      role: "contractor",
      paymentType: "hourly",
      paymentRate: 30,
      hourlyRate: 30,
      salaryBasis: "hourly",
      completedJobs: 9,
      cancelledJobs: 0,
      totalRevenue: 12600,
      rating: 4.7
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
    setJobs((prevJobs) => [...prevJobs, job]);
  };

  const completeJob = (id: string, actualAmount?: number) => {
    setJobs((prevJobs) => prevJobs.map(job => job.id === id ? {
      ...job,
      status: "completed",
      actualAmount: actualAmount ?? job.amount,
      cancellationReason: undefined,
    } : job));
  };

  const cancelJob = (id: string, cancellationReason?: string) => {
    setJobs((prevJobs) => prevJobs.map(job => job.id === id ? {
      ...job,
      status: "cancelled",
      cancellationReason: cancellationReason ?? "No reason provided",
    } : job));
  };

  const updateJob = (id: string, updates: Partial<Job>) => {
    setJobs((prevJobs) => prevJobs.map(job => job.id === id ? { ...job, ...updates } : job));
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
      updateJob,
      addTechnician,
      updateTechnician,
      addJobSource,
      updateJobSource
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
