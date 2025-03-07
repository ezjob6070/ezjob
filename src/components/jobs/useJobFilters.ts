
import { useState, useMemo } from "react";
import { 
  format, 
  isWithinInterval, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
  isSameDay,
  isAfter,
  isBefore
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
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      switch(filters.dateFilter) {
        case "today":
          matchesDate = isSameDay(jobDate, today);
          break;
        case "tomorrow":
          matchesDate = isSameDay(jobDate, addDays(today, 1));
          break;
        case "yesterday":
          matchesDate = isSameDay(jobDate, subDays(today, 1));
          break;
        case "thisWeek": {
          const weekStart = startOfWeek(today, { weekStartsOn: 1 });
          const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
          matchesDate = isWithinInterval(jobDate, { start: weekStart, end: weekEnd });
          break;
        }
        case "nextWeek": {
          const nextWeekStart = startOfWeek(addWeeks(today, 1), { weekStartsOn: 1 });
          const nextWeekEnd = endOfWeek(addWeeks(today, 1), { weekStartsOn: 1 });
          matchesDate = isWithinInterval(jobDate, { start: nextWeekStart, end: nextWeekEnd });
          break;
        }
        case "lastWeek": {
          const lastWeekStart = startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
          const lastWeekEnd = endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
          matchesDate = isWithinInterval(jobDate, { start: lastWeekStart, end: lastWeekEnd });
          break;
        }
        case "thisMonth": {
          const monthStart = startOfMonth(today);
          const monthEnd = endOfMonth(today);
          matchesDate = isWithinInterval(jobDate, { start: monthStart, end: monthEnd });
          break;
        }
        case "nextMonth": {
          const nextMonthStart = startOfMonth(addMonths(today, 1));
          const nextMonthEnd = endOfMonth(addMonths(today, 1));
          matchesDate = isWithinInterval(jobDate, { start: nextMonthStart, end: nextMonthEnd });
          break;
        }
        case "lastMonth": {
          const lastMonthStart = startOfMonth(subMonths(today, 1));
          const lastMonthEnd = endOfMonth(subMonths(today, 1));
          matchesDate = isWithinInterval(jobDate, { start: lastMonthStart, end: lastMonthEnd });
          break;
        }
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
