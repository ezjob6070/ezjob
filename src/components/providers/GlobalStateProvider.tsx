
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Technician } from '@/types/technician';
import { technicians as initialTechnicians } from '@/data/technicians';
import { JobSource } from '@/types/jobSource';
import { Job } from '@/components/jobs/JobTypes';
import { initialJobs } from '@/data/jobs';
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
  // Initialize state from localStorage or use default data
  const [technicians, setTechnicians] = useState<Technician[]>(() => {
    const saved = localStorage.getItem('technicians');
    return saved ? JSON.parse(saved) : initialTechnicians;
  });
  
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('jobs');
    return saved ? JSON.parse(saved) : initialJobs;
  });
  
  const [jobSources, setJobSources] = useState<JobSource[]>(() => {
    const saved = localStorage.getItem('jobSources');
    if (saved) return JSON.parse(saved);
    
    // Default job sources if none exist in localStorage
    return [
      {
        id: "1",
        name: "Google Ads",
        website: "https://ads.google.com",
        phone: "(555) 123-4567",
        email: "ads@google.com",
        logoUrl: "https://source.unsplash.com/random/200x200/?google",
        paymentType: "percentage",
        paymentValue: 10,
        isActive: true,
        totalJobs: 0,
        totalRevenue: 0,
        profit: 0,
        createdAt: new Date(),
        notes: "Our primary advertising channel for service leads."
      },
      {
        id: "2",
        name: "Facebook Marketplace",
        website: "https://facebook.com/marketplace",
        phone: "(555) 234-5678",
        email: "marketplace@facebook.com",
        logoUrl: "https://source.unsplash.com/random/200x200/?facebook",
        paymentType: "fixed",
        paymentValue: 50,
        isActive: true,
        totalJobs: 0,
        totalRevenue: 0,
        profit: 0,
        createdAt: new Date(),
        notes: "Targeting local homeowners in need of services."
      },
      {
        id: "3",
        name: "Referral Program",
        phone: "(555) 987-6543",
        paymentType: "percentage",
        paymentValue: 5,
        isActive: true,
        totalJobs: 0,
        totalRevenue: 0,
        profit: 0,
        createdAt: new Date(),
        notes: "Customer referrals - $50 credit for both referrer and new customer."
      }
    ];
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
      id: uuidv4(),
      completedJobs: 0,
      cancelledJobs: 0,
      totalRevenue: 0,
      rating: 5,
      initials: technician.name.split(' ').map(n => n[0]).join('').toUpperCase()
    };
    
    setTechnicians(prev => [newTechnician, ...prev]);
    toast({
      title: "Technician Added",
      description: `${newTechnician.name} has been added to your team.`
    });
  };

  const updateTechnician = (technician: Technician) => {
    setTechnicians(prev => 
      prev.map(t => t.id === technician.id ? technician : t)
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
      id: uuidv4(),
      createdAt: new Date()
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
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        const updatedJob = {
          ...job,
          status: "completed" as const,
          actualAmount,
        };
        
        // Update technician statistics
        if (job.technicianId) {
          setTechnicians(techs => techs.map(tech => {
            if (tech.id === job.technicianId) {
              return {
                ...tech,
                completedJobs: (tech.completedJobs || 0) + 1,
                totalRevenue: (tech.totalRevenue || 0) + actualAmount
              };
            }
            return tech;
          }));
        }
        
        return updatedJob;
      }
      return job;
    }));
    
    toast({
      title: "Job Completed",
      description: `Job has been marked as completed with final amount of $${actualAmount}.`
    });
  };
  
  const cancelJob = (jobId: string, reason?: string) => {
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        const updatedJob = {
          ...job,
          status: "cancelled" as const,
          cancellationReason: reason || "No reason provided"
        };
        
        // Update technician statistics
        if (job.technicianId) {
          setTechnicians(techs => techs.map(tech => {
            if (tech.id === job.technicianId) {
              return {
                ...tech,
                cancelledJobs: (tech.cancelledJobs || 0) + 1
              };
            }
            return tech;
          }));
        }
        
        return updatedJob;
      }
      return job;
    }));
    
    toast({
      title: "Job Cancelled",
      description: `Job has been cancelled${reason ? `: ${reason}` : ''}.`
    });
  };
  
  const addJobSource = (jobSource: JobSource) => {
    // Ensure job source has required fields
    const newJobSource = {
      ...jobSource,
      id: uuidv4(),
      totalJobs: 0,
      totalRevenue: 0,
      profit: 0,
      createdAt: new Date()
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
