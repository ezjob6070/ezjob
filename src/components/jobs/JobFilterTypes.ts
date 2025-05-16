
import { DateRange } from "react-day-picker";
import { Job } from "./JobTypes";

export type DateFilterType = 
  | "today" 
  | "tomorrow" 
  | "yesterday" 
  | "thisWeek" 
  | "nextWeek"
  | "lastWeek"
  | "thisMonth"
  | "nextMonth"
  | "lastMonth"
  | "custom";

export interface JobFilters {
  searchTerm: string;
  technicianFilter: string;
  dateFilter: DateFilterType;
  customDateRange: DateRange | {
    from: Date | undefined;
    to: Date | undefined;
  };
}

export interface JobFilterProps {
  filters: JobFilters;
  setFilters: React.Dispatch<React.SetStateAction<JobFilters>>;
  technicians: { id: string; name: string }[];
  resetFilters: () => void;
}

export interface JobFiltersSectionProps {
  technicianNames: string[];
  selectedTechnicians: string[];
  date?: DateRange | undefined;
  amountRange?: any;
  paymentMethod?: any;
  appliedFilters?: boolean;
  toggleTechnician: (techName: string) => void;
  setDate?: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  setAmountRange?: React.Dispatch<React.SetStateAction<any>>;
  setPaymentMethod?: React.Dispatch<React.SetStateAction<any>>;
  clearFilters: () => void;
  applyFilters: () => void;
  selectAllTechnicians?: () => void;
  deselectAllTechnicians?: () => void;
  selectAllCustomers?: () => void;
  deselectAllCustomers?: () => void;
  selectAllJobSources?: () => void;
  deselectAllJobSources?: () => void;
  selectAllContractors?: () => void;
  deselectAllContractors?: () => void;
  jobSourceNames?: string[];
  selectedJobSources?: string[];
  toggleJobSource?: (sourceName: string) => void;
  contractorNames?: string[];
  selectedContractors?: string[];
  toggleContractor?: (contractorName: string) => void;
}

export interface FilteredJobsResult {
  jobs: Job[];
  totalCount: number;
}
