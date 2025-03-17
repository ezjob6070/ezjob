
import { Job, PaymentMethod } from "@/components/jobs/JobTypes";
import { AmountRange } from "@/components/jobs/AmountFilter";
import { DateRange } from "react-day-picker";

export interface JobFiltersState {
  selectedTechnicians: string[];
  selectedCategories: string[];
  selectedJobSources: string[];
  date: DateRange | undefined;
  amountRange: AmountRange | null;
  paymentMethod: PaymentMethod | null;
  appliedFilters: boolean;
}

export interface UseJobsDataResult {
  // Job data
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  filteredJobs: Job[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  
  // Filters
  selectedTechnicians: string[];
  selectedCategories: string[];
  selectedJobSources: string[];
  date: DateRange | undefined;
  amountRange: AmountRange | null;
  paymentMethod: PaymentMethod | null;
  appliedFilters: boolean;
  hasActiveFilters: boolean;
  
  // Filter actions
  toggleTechnician: (techName: string) => void;
  toggleCategory: (category: string) => void;
  toggleJobSource: (sourceName: string) => void;
  setDate: (date: DateRange | undefined) => void;
  setAmountRange: (range: AmountRange | null) => void;
  setPaymentMethod: (method: PaymentMethod | null) => void;
  selectAllTechnicians: () => void;
  deselectAllTechnicians: () => void;
  selectAllJobSources: () => void;
  deselectAllJobSources: () => void;
  clearFilters: () => void;
  applyFilters: () => void;
  
  // Job actions
  selectedJob: Job | null;
  isStatusModalOpen: boolean;
  handleCancelJob: (jobId: string, cancellationReason?: string) => void;
  handleCompleteJob: (jobId: string, actualAmount: number) => void;
  handleRescheduleJob: (jobId: string, newDate: Date, isAllDay: boolean) => void;
  updateJobStatus: (jobId: string, status: any) => void;
  openStatusModal: (job: Job) => void;
  closeStatusModal: () => void;
}
