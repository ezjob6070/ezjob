
import { useState, useMemo } from "react";
import { 
  format, 
  isWithinInterval, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth 
} from "date-fns";
import { Job } from "./JobTypes";
import { JobFilters, DateFilterType, FilteredJobsResult } from "./JobFilterTypes";

export const useJobFilters = (jobs: Job[]) => {
  const [filters, setFilters] = useState<JobFilters>({
    searchTerm: "",
    technicianFilter: "",
    dateFilter: "all",
    customDateRange: {
      from: undefined,
      to: undefined
    }
  });

  const resetFilters = () => {
    setFilters({
      searchTerm: "",
      technicianFilter: "",
      dateFilter: "all",
      customDateRange: { from: undefined, to: undefined }
    });
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search filter
      const matchesSearch = 
        job.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        job.clientName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        job.technicianName.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      // Technician filter
      const matchesTechnician = 
        filters.technicianFilter === "" || job.technicianId === filters.technicianFilter;
      
      // Date filter
      let matchesDate = true;
      const jobDate = new Date(job.scheduledDate);
      
      switch(filters.dateFilter) {
        case "today":
          matchesDate = format(jobDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
          break;
        case "week":
          const weekStart = startOfWeek(new Date());
          const weekEnd = endOfWeek(new Date());
          matchesDate = isWithinInterval(jobDate, { start: weekStart, end: weekEnd });
          break;
        case "month":
          const monthStart = startOfMonth(new Date());
          const monthEnd = endOfMonth(new Date());
          matchesDate = isWithinInterval(jobDate, { start: monthStart, end: monthEnd });
          break;
        case "custom":
          if (filters.customDateRange.from && filters.customDateRange.to) {
            matchesDate = isWithinInterval(jobDate, { 
              start: filters.customDateRange.from, 
              end: filters.customDateRange.to 
            });
          }
          break;
        default:
          matchesDate = true;
      }
      
      return matchesSearch && matchesTechnician && matchesDate;
    });
  }, [jobs, filters]);

  return {
    filters,
    setFilters,
    filteredJobs,
    resetFilters
  };
};
