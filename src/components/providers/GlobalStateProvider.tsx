import React, { createContext, useContext, useState } from 'react';
import { IndustryType } from '@/components/sidebar/sidebarTypes';
import { DateRange } from 'react-day-picker';
import { v4 as uuidv4 } from 'uuid';
import { technicians as initialTechnicianData } from '@/data/technicians';
import { Technician } from '@/types/technician';
// Import only the specific functions/objects from finances.ts, not the non-existent 'finances' export
import { sampleTransactions } from '@/data/finances';

// Define the types for our data
type Job = {
  id: string;
  clientName: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  date: Date | string;
  scheduledDate?: string | Date;
  amount?: number;
  actualAmount?: number;
  technicianId?: string;
  jobSourceId?: string;
  [key: string]: any;
};

type JobSource = {
  id: string;
  name: string;
  type: string;
  paymentType: "percentage" | "fixed";
  paymentValue: number;
  isActive: boolean;
  totalJobs: number;
  totalRevenue: number;
  expenses?: number;
  companyProfit?: number;
  profit: number;
  createdAt: Date;
  [key: string]: any;
};

// Define the type for our global state
type GlobalStateContextType = {
  currentIndustry: IndustryType;
  setCurrentIndustry: React.Dispatch<React.SetStateAction<IndustryType>>;
  jobs: Job[];
  addJob: (job: Job) => void;
  updateJob: (id: string, updatedJob: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  completeJob: (id: string, actualAmount: number) => void;
  cancelJob: (id: string, reason?: string) => void;
  dateFilter: DateRange | undefined;
  setDateFilter: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  technicians: Technician[];
  addTechnician: (technician: Technician) => void;
  updateTechnician: (id: string, updatedTechnician: Partial<Technician>) => void;
  deleteTechnician: (id: string) => void;
  jobSources: JobSource[];
  addJobSource: (jobSource: JobSource) => void;
  updateJobSource: (id: string, updatedJobSource: Partial<JobSource>) => void;
  deleteJobSource: (id: string) => void;
};

// Create the context
const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

// Define the provider component
export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentIndustry, setCurrentIndustry] = useState<IndustryType>('general');
  
  // Ensure jobs have all required properties with correct types
  const [jobs, setJobs] = useState<Job[]>([]);
  
  // Ensure technicians have all required properties with correct types
  const [technicians, setTechnicians] = useState<Technician[]>(
    initialTechnicianData.map(tech => {
      // Convert any Date objects to strings to ensure consistent typing
      const hireDate = typeof tech.hireDate === 'string' 
        ? tech.hireDate 
        : new Date(tech.hireDate || new Date()).toISOString();
        
      return {
        ...tech,
        status: tech.status as "active" | "inactive" | "onLeave",
        hireDate: hireDate,
        specialty: tech.specialty || '',
        paymentType: (tech.paymentType as "percentage" | "flat" | "hourly" | "salary") || 'hourly',
        paymentRate: tech.paymentRate || 0,
        hourlyRate: tech.hourlyRate || 0
      };
    })
  );
  
  // Initialize with jobSources that have all required properties
  const [jobSources, setJobSources] = useState<JobSource[]>([]);
  
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  // Function to add a job
  const addJob = (job: Job) => {
    const newJob: Job = {
      ...job,
      id: job.id || uuidv4(),
      status: job.status || "scheduled",
      date: job.date || job.scheduledDate || new Date().toISOString()
    };
    setJobs(prevJobs => [...prevJobs, newJob]);
  };

  // Function to update a job
  const updateJob = (id: string, updatedJob: Partial<Job>) => {
    setJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === id ? { ...job, ...updatedJob } : job
      )
    );
  };

  // Function to delete a job
  const deleteJob = (id: string) => {
    setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
  };

  // Function to mark a job as completed
  const completeJob = (id: string, actualAmount: number) => {
    setJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === id 
          ? { ...job, status: "completed" as const, actualAmount, completedAt: new Date() }
          : job
      )
    );
  };

  // Function to mark a job as cancelled
  const cancelJob = (id: string, reason?: string) => {
    setJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === id 
          ? { ...job, status: "cancelled" as const, cancellationReason: reason || "No reason provided", cancelledAt: new Date() }
          : job
      )
    );
  };

  // Function to add a technician
  const addTechnician = (technician: Technician) => {
    // Ensure correct types
    const newTechnician: Technician = {
      ...technician,
      id: technician.id || uuidv4(),
      hireDate: typeof technician.hireDate === 'string' 
        ? technician.hireDate 
        : new Date(technician.hireDate || new Date()).toISOString(),
      paymentType: technician.paymentType as "percentage" | "flat" | "hourly" | "salary"
    };
    setTechnicians(prevTechnicians => [...prevTechnicians, newTechnician]);
  };

  // Function to update a technician
  const updateTechnician = (id: string, updatedTechnician: Partial<Technician>) => {
    setTechnicians(prevTechnicians => 
      prevTechnicians.map(tech => {
        if (tech.id === id) {
          const updatedTech = { ...tech, ...updatedTechnician };
          
          // Ensure hireDate is a string
          if (updatedTech.hireDate && typeof updatedTech.hireDate !== 'string') {
            updatedTech.hireDate = new Date(updatedTech.hireDate).toISOString();
          }
          
          return updatedTech;
        }
        return tech;
      })
    );
  };

  // Function to delete a technician
  const deleteTechnician = (id: string) => {
    setTechnicians(prevTechnicians => prevTechnicians.filter(tech => tech.id !== id));
  };

  // Function to add a job source
  const addJobSource = (jobSource: JobSource) => {
    const newJobSource: JobSource = {
      ...jobSource,
      id: jobSource.id || uuidv4(),
      type: jobSource.type || 'general',
      paymentType: jobSource.paymentType || 'percentage',
      paymentValue: jobSource.paymentValue || 0,
      isActive: jobSource.isActive !== false,
      totalJobs: jobSource.totalJobs || 0,
      totalRevenue: jobSource.totalRevenue || 0,
      profit: jobSource.profit || 0,
      createdAt: jobSource.createdAt || new Date()
    };
    setJobSources(prevSources => [...prevSources, newJobSource]);
  };

  // Function to update a job source
  const updateJobSource = (id: string, updatedJobSource: Partial<JobSource>) => {
    setJobSources(prevSources => 
      prevSources.map(source => 
        source.id === id ? { ...source, ...updatedJobSource } : source
      )
    );
  };

  // Function to delete a job source
  const deleteJobSource = (id: string) => {
    setJobSources(prevSources => prevSources.filter(source => source.id !== id));
  };

  const value = {
    currentIndustry,
    setCurrentIndustry,
    jobs,
    addJob,
    updateJob,
    deleteJob,
    completeJob,
    cancelJob,
    dateFilter,
    setDateFilter,
    technicians,
    addTechnician,
    updateTechnician,
    deleteTechnician,
    jobSources,
    addJobSource,
    updateJobSource,
    deleteJobSource,
  };

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// Hook to use the global state
export const useGlobalState = (): GlobalStateContextType => {
  const context = useContext(GlobalStateContext);
  
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  
  return context;
};
