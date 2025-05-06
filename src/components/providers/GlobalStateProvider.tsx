
import React, { createContext, useContext, useState } from 'react';
import { IndustryType } from '@/components/sidebar/sidebarTypes';
import { DateRange } from 'react-day-picker';
import { v4 as uuidv4 } from 'uuid';
import { technicians as initialTechnicians } from '@/data/technicians';
// Import only the specific functions/objects from finances.ts, not the non-existent 'finances' export
import { sampleTransactions } from '@/data/finances';

// Define the types for our data
type Job = {
  id: string;
  clientName: string;
  status: string;
  scheduledDate?: string | Date;
  amount?: number;
  actualAmount?: number;
  technicianId?: string;
  jobSourceId?: string;
  [key: string]: any;
};

type Technician = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  [key: string]: any;
};

type JobSource = {
  id: string;
  name: string;
  type: string;
  totalJobs?: number;
  totalRevenue?: number;
  expenses?: number;
  companyProfit?: number;
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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians);
  // Initialize with empty array instead of referencing the non-existent finances.jobSources
  const [jobSources, setJobSources] = useState<JobSource[]>([]);
  
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  // Function to add a job
  const addJob = (job: Job) => {
    const newJob = {
      ...job,
      id: job.id || uuidv4(),
    };
    setJobs(prevJobs => [...prevJobs, newJob]);
  };

  // Function to update a job
  const updateJob = (id: string, updatedJob: Partial<Job>) => {
    setJobs(prevJobs => prevJobs.map(job => 
      job.id === id ? { ...job, ...updatedJob } : job
    ));
  };

  // Function to delete a job
  const deleteJob = (id: string) => {
    setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
  };

  // Function to complete a job
  const completeJob = (id: string, actualAmount: number) => {
    updateJob(id, { 
      status: 'completed', 
      completedDate: new Date().toISOString(),
      actualAmount
    });
  };

  // Function to cancel a job
  const cancelJob = (id: string, reason?: string) => {
    updateJob(id, { 
      status: 'cancelled', 
      cancelledDate: new Date().toISOString(),
      cancellationReason: reason || 'No reason provided'
    });
  };

  // Technician functions
  const addTechnician = (technician: Technician) => {
    const newTechnician = {
      ...technician,
      id: technician.id || uuidv4(),
    };
    setTechnicians(prevTechnicians => [...prevTechnicians, newTechnician]);
  };

  const updateTechnician = (id: string, updatedTechnician: Partial<Technician>) => {
    setTechnicians(prevTechnicians => prevTechnicians.map(tech => 
      tech.id === id ? { ...tech, ...updatedTechnician } : tech
    ));
  };

  const deleteTechnician = (id: string) => {
    setTechnicians(prevTechnicians => prevTechnicians.filter(tech => tech.id !== id));
  };

  // JobSource functions
  const addJobSource = (jobSource: JobSource) => {
    const newJobSource = {
      ...jobSource,
      id: jobSource.id || uuidv4(),
    };
    setJobSources(prevJobSources => [...prevJobSources, newJobSource]);
  };

  const updateJobSource = (id: string, updatedJobSource: Partial<JobSource>) => {
    setJobSources(prevJobSources => prevJobSources.map(source => 
      source.id === id ? { ...source, ...updatedJobSource } : source
    ));
  };

  const deleteJobSource = (id: string) => {
    setJobSources(prevJobSources => prevJobSources.filter(source => source.id !== id));
  };

  return (
    <GlobalStateContext.Provider 
      value={{ 
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
        deleteJobSource
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

// Custom hook to use the global state
export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};
