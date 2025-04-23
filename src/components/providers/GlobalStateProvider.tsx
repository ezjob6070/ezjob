
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Job } from "@/components/jobs/JobTypes";
import { IndustryType } from "@/components/sidebar/sidebarTypes";
import { Technician } from "@/types/technician";
import { JobSource } from "@/types/jobSource";

interface GlobalStateContextType {
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  currentIndustry: IndustryType;
  setCurrentIndustry: React.Dispatch<React.SetStateAction<IndustryType>>;
  technicians: Technician[];
  setTechnicians: React.Dispatch<React.SetStateAction<Technician[]>>;
  jobSources: JobSource[];
  setJobSources: React.Dispatch<React.SetStateAction<JobSource[]>>;
  addJob: (job: Job) => void;
  completeJob: (jobId: string, actualAmount?: number) => void;
  cancelJob: (jobId: string, reason?: string) => void;
  addJobSource: (source: JobSource) => void;
  updateJobSource: (source: JobSource) => void;
  addTechnician: (technician: Technician) => void;
  updateTechnician: (technician: Technician) => void;
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

  const [technicians, setTechnicians] = useState<Technician[]>(() => {
    const saved = localStorage.getItem('technicians');
    return saved ? JSON.parse(saved) : [];
  });

  const [jobSources, setJobSources] = useState<JobSource[]>(() => {
    const saved = localStorage.getItem('jobSources');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('currentIndustry', currentIndustry);
  }, [currentIndustry]);

  useEffect(() => {
    localStorage.setItem('technicians', JSON.stringify(technicians));
  }, [technicians]);

  useEffect(() => {
    localStorage.setItem('jobSources', JSON.stringify(jobSources));
  }, [jobSources]);

  const addJob = (job: Job) => {
    setJobs(prev => [...prev, job]);
  };

  const completeJob = (jobId: string, actualAmount?: number) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: 'completed', actualAmount: actualAmount || job.actualAmount } 
        : job
    ));
  };

  const cancelJob = (jobId: string, reason?: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: 'cancelled', cancellationReason: reason || job.cancellationReason } 
        : job
    ));
  };

  const addJobSource = (source: JobSource) => {
    setJobSources(prev => [...prev, source]);
  };

  const updateJobSource = (source: JobSource) => {
    setJobSources(prev => prev.map(s => 
      s.id === source.id ? source : s
    ));
  };

  const addTechnician = (technician: Technician) => {
    setTechnicians(prev => [...prev, technician]);
  };

  const updateTechnician = (technician: Technician) => {
    setTechnicians(prev => prev.map(t => 
      t.id === technician.id ? technician : t
    ));
  };

  return (
    <GlobalStateContext.Provider value={{ 
      jobs, 
      setJobs, 
      currentIndustry, 
      setCurrentIndustry,
      technicians,
      setTechnicians,
      jobSources,
      setJobSources,
      addJob,
      completeJob,
      cancelJob,
      addJobSource,
      updateJobSource,
      addTechnician,
      updateTechnician
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
