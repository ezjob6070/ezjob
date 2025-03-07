
import { Job } from "@/components/jobs/JobTypes";

export type DateFilterType = "all" | "today" | "week" | "month" | "custom";

export type JobFilters = {
  searchTerm: string;
  technicianFilter: string;
  dateFilter: DateFilterType;
  customDateRange: { from: Date | undefined; to: Date | undefined };
};

export type JobFilterProps = {
  filters: JobFilters;
  setFilters: (filters: JobFilters) => void;
  technicians: { id: string; name: string }[];
  resetFilters: () => void;
};

export type FilteredJobsResult = Job[];
