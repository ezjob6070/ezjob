
import { createContext, useContext, useState } from "react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { JobType } from "@/types/jobs";
import { initialJobs } from "@/data/jobs";
import { initialJobSources } from "@/data/jobSources";
import { initialTechnicians } from "@/data/technicians";
import { IndustryType } from "@/components/sidebar/sidebarTypes";

interface GlobalStateContextType {
  jobs: any[];
  setJobs: (jobs: any[]) => void;
  jobSources: any[];
  setJobSources: (jobSources: any[]) => void;
  technicians: any[];
  setTechnicians: (technicians: any[]) => void;
  currentIndustry: IndustryType;
  setCurrentIndustry: (industry: IndustryType) => void;
  dateFilter: DateRange | undefined;
  setDateFilter: (dateFilter: DateRange | undefined) => void;
  getFilteredJobs: () => any[];
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export function GlobalStateProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [jobSources, setJobSources] = useState(initialJobSources);
  const [technicians, setTechnicians] = useState(initialTechnicians);
  const [currentIndustry, setCurrentIndustry] = useState<IndustryType>("hvac");
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  // Function to get jobs filtered by the current date filter
  const getFilteredJobs = () => {
    if (!dateFilter?.from) return jobs;
    
    return jobs.filter(job => {
      // Handle both string dates and Date objects
      const jobDate = job.scheduledDate ? new Date(job.scheduledDate) : 
                     job.date ? new Date(job.date) : null;
      
      if (!jobDate) return false;
      
      if (dateFilter.to) {
        return jobDate >= dateFilter.from && jobDate <= dateFilter.to;
      }
      
      // If only from date is specified, filter for that specific day
      return jobDate.toDateString() === dateFilter.from.toDateString();
    });
  };

  return (
    <GlobalStateContext.Provider value={{
      jobs,
      setJobs,
      jobSources,
      setJobSources,
      technicians,
      setTechnicians,
      currentIndustry,
      setCurrentIndustry,
      dateFilter,
      setDateFilter,
      getFilteredJobs,
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
}
