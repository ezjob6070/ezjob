
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Job } from "@/components/jobs/JobTypes";
import { IndustryType } from "@/components/sidebar/sidebarTypes";

interface GlobalStateContextType {
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  currentIndustry: IndustryType;
  setCurrentIndustry: React.Dispatch<React.SetStateAction<IndustryType>>;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export const GlobalStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>(() => {
    const savedJobs = localStorage.getItem('jobs');
    return savedJobs ? JSON.parse(savedJobs) : [];
  });

  const [currentIndustry, setCurrentIndustry] = useState<IndustryType>(() => {
    const savedIndustry = localStorage.getItem('currentIndustry');
    return (savedIndustry as IndustryType) || 'construction';
  });

  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('currentIndustry', currentIndustry);
  }, [currentIndustry]);

  return (
    <GlobalStateContext.Provider value={{ 
      jobs, 
      setJobs, 
      currentIndustry, 
      setCurrentIndustry 
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};
