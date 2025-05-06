
import React, { createContext, useContext, useState } from 'react';
import { IndustryType } from '@/components/sidebar/sidebarTypes';
import { DateRange } from 'react-day-picker';

// Define the type for our global state
type GlobalStateContextType = {
  currentIndustry: IndustryType;
  setCurrentIndustry: React.Dispatch<React.SetStateAction<IndustryType>>;
  jobs: any[];
  addJob: (job: any) => void;
  updateJob: (id: string, updatedJob: any) => void;
  deleteJob: (id: string) => void;
  dateFilter: DateRange | undefined;
  setDateFilter: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
};

// Create the context
const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

// Define the provider component
export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentIndustry, setCurrentIndustry] = useState<IndustryType>('general');
  const [jobs, setJobs] = useState<any[]>([]);
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  // Function to add a job
  const addJob = (job: any) => {
    setJobs(prevJobs => [...prevJobs, job]);
  };

  // Function to update a job
  const updateJob = (id: string, updatedJob: any) => {
    setJobs(prevJobs => prevJobs.map(job => 
      job.id === id ? { ...job, ...updatedJob } : job
    ));
  };

  // Function to delete a job
  const deleteJob = (id: string) => {
    setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
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
        dateFilter,
        setDateFilter
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
