
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Technician } from '@/types/technician';
import { Job } from '@/components/jobs/JobTypes';
import { JobSource } from '@/types/jobSource';
import { OfficeExpense } from '@/types/finance';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  company?: string;
  notes?: string;
  createdAt: string;
  lastContact?: string;
  status: 'active' | 'inactive';
  totalSpent?: number;
  projectCount?: number;
}

export interface GlobalStateContextProps {
  technicians: Technician[];
  setTechnicians: (technicians: Technician[]) => void;
  jobs: Job[];
  jobSources: JobSource[];
  setJobSources: (jobSources: JobSource[]) => void;
  addJob: (job: Job) => void;
  completeJob: (jobId: string) => void; 
  cancelJob: (jobId: string) => void;
  clients: Client[];
  setClients: (clients: Client[]) => void;
  setJobs: (jobs: Job[]) => void;
  addClient: (client: Client) => void;
  updateClient: (client: Client) => void;
  deleteClient: (clientId: string) => void;
  globalClients: Client[];
  deleteJobSource: (id: string) => void;
  officeExpenses: OfficeExpense[];
  addOfficeExpense: (expense: OfficeExpense) => void;
  updateOfficeExpense: (expense: OfficeExpense) => void;
  deleteOfficeExpense: (id: string) => void;
}

const GlobalStateContext = createContext<GlobalStateContextProps | undefined>(undefined);

export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobSources, setJobSources] = useState<JobSource[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [officeExpenses, setOfficeExpenses] = useState<OfficeExpense[]>([]);

  const addJob = (job: Job) => {
    setJobs((prevJobs) => [...prevJobs, job]);
  };

  const completeJob = (jobId: string) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId ? { ...job, status: 'completed' as const } : job
      )
    );
  };

  const cancelJob = (jobId: string) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId ? { ...job, status: 'cancelled' as const } : job
      )
    );
  };

  const addClient = (client: Client) => {
    setClients((prevClients) => [...prevClients, client]);
  };

  const updateClient = (updatedClient: Client) => {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      )
    );
  };

  const deleteClient = (clientId: string) => {
    setClients((prevClients) =>
      prevClients.filter((client) => client.id !== clientId)
    );
  };

  const deleteJobSource = (id: string) => {
    setJobSources(prevJobSources => prevJobSources.filter(source => source.id !== id));
  };

  const addOfficeExpense = (expense: OfficeExpense) => {
    setOfficeExpenses(prev => [...prev, expense]);
  };

  const updateOfficeExpense = (updatedExpense: OfficeExpense) => {
    setOfficeExpenses(prev => 
      prev.map(expense => 
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
  };

  const deleteOfficeExpense = (id: string) => {
    setOfficeExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  return (
    <GlobalStateContext.Provider
      value={{
        technicians,
        setTechnicians,
        jobs,
        setJobs,
        jobSources,
        setJobSources,
        addJob,
        completeJob,
        cancelJob,
        clients,
        setClients,
        addClient,
        updateClient,
        deleteClient,
        globalClients: clients,
        deleteJobSource,
        officeExpenses,
        addOfficeExpense,
        updateOfficeExpense,
        deleteOfficeExpense
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = (): GlobalStateContextProps => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};
