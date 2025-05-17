
import { FinancialTransaction } from "@/types/finance";

export type DateFilterType = 
  | "all" 
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

export type DateFilterCategory = "current" | "past" | "future" | "custom";

export type FinanceFilters = {
  searchTerm: string;
  jobSourceFilter: string;
  dateFilter: DateFilterType;
  customDateRange: { from: Date | undefined; to: Date | undefined };
};

export type FinanceFilterProps = {
  filters: FinanceFilters;
  setFilters: (filters: FinanceFilters) => void;
  jobSources: { id: string; name: string }[];
  resetFilters: () => void;
};

export type FilteredTransactionsResult = FinancialTransaction[];

export interface SearchBarProps {
  searchTerm: string;
  updateFilter?: <K extends keyof FinanceFilters>(key: K, value: FinanceFilters[K]) => void;
  hidden?: boolean;
}
