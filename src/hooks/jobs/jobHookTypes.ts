
import { Job, PaymentMethod, JobStatus } from "@/components/jobs/JobTypes";
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

export interface JobsDataState {
  jobs: Job[];
  filteredJobs: Job[];
  searchTerm: string;
  selectedJob: Job | null;
  isStatusModalOpen: boolean;
}

export interface UseJobsDataResult extends JobsDataState, JobFiltersState {
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  toggleTechnician: (techName: string) => void;
  toggleCategory: (category: string) => void;
  toggleJobSource: (sourceName: string) => void;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  setAmountRange: React.Dispatch<React.SetStateAction<AmountRange | null>>;
  setPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethod | null>>;
  selectAllTechnicians: () => void;
  deselectAllTechnicians: () => void;
  selectAllJobSources: () => void;
  deselectAllJobSources: () => void;
  clearFilters: () => void;
  applyFilters: () => void;
  hasActiveFilters: boolean;
  handleCancelJob: (jobId: string, cancellationReason?: string) => void;
  handleCompleteJob: (jobId: string, actualAmount: number) => void;
  handleRescheduleJob: (jobId: string, newDate: Date, isAllDay: boolean) => void;
  updateJobStatus: (jobId: string, status: JobStatus) => void;
  openStatusModal: (job: Job) => void;
  closeStatusModal: () => void;
}
