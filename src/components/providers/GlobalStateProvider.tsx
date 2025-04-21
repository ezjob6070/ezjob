
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Technician } from '@/types/technician';
import { JobSource } from '@/types/jobSource';
import { Job } from '@/components/jobs/JobTypes';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';

interface GlobalStateContextType {
  technicians: Technician[];
  jobs: Job[];
  jobSources: JobSource[];
  addTechnician: (technician: Technician) => void;
  updateTechnician: (technician: Technician) => void;
  deleteTechnician: (id: string) => void;
  addJob: (job: Job) => void;
  updateJob: (job: Job) => void;
  completeJob: (jobId: string, actualAmount: number) => void;
  cancelJob: (jobId: string, reason?: string) => void;
  addJobSource: (jobSource: JobSource) => void;
  updateJobSource: (jobSource: JobSource) => void;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export function GlobalStateProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage or empty arrays if not found
  const [technicians, setTechnicians] = useState<Technician[]>(() => {
    const savedTechnicians = localStorage.getItem('technicians');
    return savedTechnicians ? JSON.parse(savedTechnicians) : [];
  });
  
  const [jobs, setJobs] = useState<Job[]>(() => {
    const savedJobs = localStorage.getItem('jobs');
    return savedJobs ? JSON.parse(savedJobs) : [];
  });
  
  const [jobSources, setJobSources] = useState<JobSource[]>(() => {
    const savedJobSources = localStorage.getItem('jobSources');
    return savedJobSources ? JSON.parse(savedJobSources) : [];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('technicians', JSON.stringify(technicians));
  }, [technicians]);

  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('jobSources', JSON.stringify(jobSources));
  }, [jobSources]);

  const addTechnician = (technician: Technician) => {
    // Ensure technician has a unique id and initialize statistics
    const newTechnician = {
      ...technician,
      id: technician.id || uuidv4(),
      completedJobs: technician.completedJobs || 0,
      cancelledJobs: technician.cancelledJobs || 0,
      totalRevenue: technician.totalRevenue || 0,
      rating: technician.rating || 5,
      initials: technician.name ? technician.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'UN'
    };
    
    setTechnicians(prev => [newTechnician, ...prev]);
    toast({
      title: "Technician Added",
      description: `${newTechnician.name} has been added to your team.`
    });
  };

  const updateTechnician = (technician: Technician) => {
    setTechnicians(prev => 
      prev.map(t => t.id === technician.id ? {
        ...technician,
        initials: technician.name ? technician.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'UN'
      } : t)
    );
    
    toast({
      title: "Technician Updated",
      description: `${technician.name}'s information has been updated.`
    });
  };

  const deleteTechnician = (id: string) => {
    setTechnicians(prev => prev.filter(t => t.id !== id));
    
    toast({
      title: "Technician Removed",
      description: "Technician has been removed from your team."
    });
  };

  const addJob = (job: Job) => {
    // Ensure job has required fields and update related statistics
    const newJob = {
      ...job,
      id: job.id || uuidv4(),
      createdAt: job.createdAt || new Date(),
      status: job.status || "scheduled",
      date: job.date || new Date()
    };
    
    setJobs(prev => [newJob, ...prev]);
    
    // Update job source statistics
    if (job.jobSourceId && job.amount) {
      setJobSources(prev => prev.map(source => {
        if (source.id === job.jobSourceId) {
          const updatedSource = { 
            ...source, 
            totalJobs: (source.totalJobs || 0) + 1,
            totalRevenue: (source.totalRevenue || 0) + (job.amount || 0)
          };
          
          // Calculate profit based on payment type
          if (source.paymentType === "percentage") {
            updatedSource.profit = updatedSource.totalRevenue - (updatedSource.totalRevenue * (source.paymentValue / 100));
          } else { // fixed payment
            updatedSource.profit = updatedSource.totalRevenue - source.paymentValue;
          }
          
          return updatedSource;
        }
        return source;
      }));
    }
    
    toast({
      title: "Job Added",
      description: `New job for ${job.clientName} has been created.`
    });
  };

  const updateJob = (job: Job) => {
    setJobs(prev => prev.map(j => j.id === job.id ? job : j));
    
    toast({
      title: "Job Updated",
      description: `Job for ${job.clientName} has been updated.`
    });
  };
  
  const completeJob = (jobId: string, actualAmount: number) => {
    let updatedJob: Job | null = null;

    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        updatedJob = {
          ...job,
          status: "completed" as const,
          actualAmount,
        };
        return updatedJob;
      }
      return job;
    }));
    
    // Update technician statistics
    if (updatedJob && updatedJob.technicianId) {
      setTechnicians(techs => techs.map(tech => {
        if (tech.id === updatedJob?.technicianId) {
          return {
            ...tech,
            completedJobs: (tech.completedJobs || 0) + 1,
            totalRevenue: (tech.totalRevenue || 0) + actualAmount
          };
        }
        return tech;
      }));
    }
    
    // Update job source data when job is completed
    if (updatedJob && updatedJob.jobSourceId) {
      setJobSources(sources => sources.map(source => {
        if (source.id === updatedJob?.jobSourceId) {
          // Calculate actual profit based on the actual amount
          const updatedRevenue = (source.totalRevenue || 0) + actualAmount;
          let updatedProfit = 0;
          
          if (source.paymentType === "percentage") {
            updatedProfit = updatedRevenue - (updatedRevenue * (source.paymentValue / 100));
          } else { // fixed payment
            updatedProfit = updatedRevenue - source.paymentValue;
          }
          
          return {
            ...source,
            totalRevenue: updatedRevenue,
            profit: updatedProfit
          };
        }
        return source;
      }));
    }
    
    toast({
      title: "Job Completed",
      description: `Job has been marked as completed with final amount of $${actualAmount}.`
    });
  };
  
  const cancelJob = (jobId: string, reason?: string) => {
    let updatedJob: Job | null = null;

    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        updatedJob = {
          ...job,
          status: "cancelled" as const,
          cancellationReason: reason || "No reason provided"
        };
        return updatedJob;
      }
      return job;
    }));
    
    // Update technician statistics
    if (updatedJob && updatedJob.technicianId) {
      setTechnicians(techs => techs.map(tech => {
        if (tech.id === updatedJob?.technicianId) {
          return {
            ...tech,
            cancelledJobs: (tech.cancelledJobs || 0) + 1
          };
        }
        return tech;
      }));
    }
    
    toast({
      title: "Job Cancelled",
      description: `Job has been cancelled${reason ? `: ${reason}` : ''}.`
    });
  };
  
  const addJobSource = (jobSource: JobSource) => {
    // Ensure job source has required fields
    const newJobSource = {
      ...jobSource,
      id: jobSource.id || uuidv4(),
      totalJobs: jobSource.totalJobs || 0,
      totalRevenue: jobSource.totalRevenue || 0,
      profit: jobSource.profit || 0,
      createdAt: jobSource.createdAt || new Date()
    };
    
    setJobSources(prev => [newJobSource, ...prev]);
    
    toast({
      title: "Job Source Added",
      description: `${newJobSource.name} has been added as a job source.`
    });
  };
  
  const updateJobSource = (jobSource: JobSource) => {
    setJobSources(prev => prev.map(js => js.id === jobSource.id ? jobSource : js));
    
    toast({
      title: "Job Source Updated",
      description: `${jobSource.name} has been updated.`
    });
  };

  return (
    <GlobalStateContext.Provider value={{ 
      technicians, 
      jobs,
      jobSources,
      addTechnician, 
      updateTechnician, 
      deleteTechnician,
      addJob,
      updateJob,
      completeJob,
      cancelJob,
      addJobSource,
      updateJobSource
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
}
