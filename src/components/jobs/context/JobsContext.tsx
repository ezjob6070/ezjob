import { createContext, useContext } from "react";
import { Job, AmountRange } from "../JobTypes";
import { DateRange } from "react-day-picker";

interface JobsContextType {
  // Modals
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  
  // Filter popovers
  datePopoverOpen: boolean;
  setDatePopoverOpen: (open: boolean) => void;
  techPopoverOpen: boolean;
  setTechPopoverOpen: (open: boolean) => void;
  contractorPopoverOpen: boolean;
  setContractorPopoverOpen: (open: boolean) => void;
  sourcePopoverOpen: boolean;
  setSourcePopoverOpen: (open: boolean) => void;
  amountPopoverOpen: boolean;
  setAmountPopoverOpen: (open: boolean) => void;
  paymentPopoverOpen: boolean;
  setPaymentPopoverOpen: (open: boolean) => void;
  
  // Jobs
  jobs: Job[];
  filteredJobs: Job[];
  
  // Search and filters
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTechnicians: string[];
  selectedCategories: string[];
  selectedJobSources: string[];
  selectedServiceTypes: string[];
  date?: DateRange;
  amountRange: AmountRange | null;
  paymentMethod: string | null;
  hasActiveFilters: boolean;
  
  // Filter operations
  toggleTechnician: (techName: string) => void;
  toggleCategory: (category: string) => void;
  toggleJobSource: (source: string) => void;
  toggleServiceType: (type: string) => void;
  setDate: (dateRange?: DateRange) => void;
  setAmountRange: (range: AmountRange | null) => void;
  setPaymentMethod: (method: string | null) => void;
  selectAllTechnicians: () => void;
  deselectAllTechnicians: () => void;
  selectAllJobSources: () => void;
  deselectAllJobSources: () => void;
  clearFilters: () => void;
  
  // Job operations
  handleAddJob: (job: Job) => void;
  handleCancelJob: (jobId: string, reason?: string) => void;
  handleCompleteJob: (jobId: string, actualAmount: number) => void;
  handleRescheduleJob: (jobId: string, newDate: Date, isAllDay: boolean) => void;
  handleSendToEstimate?: (job: Job) => void;
  
  // Job status modal
  selectedJob: Job | null;
  isStatusModalOpen: boolean;
  openStatusModal: (job: Job) => void;
  closeStatusModal: () => void;
  
  // Other operations
  toggleJobSourceSidebar: () => void;
}

const JobsContext = createContext<JobsContextType | null>(null);

export const JobsProvider = ({ children, value }: { children: React.ReactNode, value: JobsContextType }) => {
  return (
    <JobsContext.Provider value={value}>
      {children}
    </JobsContext.Provider>
  );
};

export const useJobsContext = (): JobsContextType => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error("useJobsContext must be used within a JobsProvider");
  }
  return context;
};
