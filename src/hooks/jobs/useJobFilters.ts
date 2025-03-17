
import { useState } from "react";
import { Job, PaymentMethod } from "@/components/jobs/JobTypes";
import { AmountRange } from "@/components/jobs/AmountFilter";
import { DateRange } from "react-day-picker";
import { isWithinInterval, isSameDay, startOfDay } from "date-fns";
import { JobFiltersState } from "./jobHookTypes";

export const useJobFilters = (initialJobSources: string[] = []) => {
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedJobSources, setSelectedJobSources] = useState<string[]>([]);
  
  // Initialize date range to today
  const today = new Date();
  const [date, setDate] = useState<DateRange | undefined>({
    from: today,
    to: today
  });
  
  const [amountRange, setAmountRange] = useState<AmountRange | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [appliedFilters, setAppliedFilters] = useState(false);

  const toggleTechnician = (techName: string) => {
    setSelectedTechnicians(prev => 
      prev.includes(techName) 
        ? prev.filter(t => t !== techName)
        : [...prev, techName]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleJobSource = (sourceName: string) => {
    setSelectedJobSources(prev => 
      prev.includes(sourceName) 
        ? prev.filter(s => s !== sourceName)
        : [...prev, sourceName]
    );
  };

  const selectAllTechnicians = () => {
    // This should be updated to set all technician names
    setSelectedTechnicians(prevTechnicians => [...prevTechnicians]);
  };

  const deselectAllTechnicians = () => {
    setSelectedTechnicians([]);
  };

  const selectAllJobSources = () => {
    setSelectedJobSources(initialJobSources);
  };

  const deselectAllJobSources = () => {
    setSelectedJobSources([]);
  };

  const clearFilters = () => {
    setSelectedTechnicians([]);
    setSelectedCategories([]);
    setSelectedJobSources([]);
    // Reset date to today instead of undefined
    const resetToday = new Date();
    setDate({
      from: resetToday,
      to: resetToday
    });
    setAmountRange(null);
    setPaymentMethod(null);
    setAppliedFilters(false);
  };

  const applyFilters = () => {
    setAppliedFilters(true);
  };

  const hasActiveFilters = 
    (appliedFilters && selectedTechnicians.length > 0) || 
    selectedCategories.length > 0 || 
    selectedJobSources.length > 0 ||
    !!date?.from || 
    !!amountRange || 
    !!paymentMethod;

  // Filter jobs based on various criteria
  const filterJobs = (jobs: Job[], searchTerm: string): Job[] => {
    let result = jobs;

    if (searchTerm) {
      result = result.filter(job =>
        job.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.title && job.title.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (appliedFilters && selectedTechnicians.length > 0) {
      result = result.filter(job => 
        job.technicianName && selectedTechnicians.includes(job.technicianName)
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter(job => 
        job.title && selectedCategories.some(category => 
          job.title!.toLowerCase().includes(category.toLowerCase())
        )
      );
    }

    // Filter by job source if any are selected
    if (selectedJobSources.length > 0) {
      result = result.filter(job => 
        job.source && selectedJobSources.includes(job.source)
      );
    }

    if (date?.from) {
      const fromDate = startOfDay(date.from);
      const toDate = date.to ? startOfDay(date.to) : fromDate;
      
      result = result.filter(job => {
        const jobDate = startOfDay(job.date);
        
        if (isSameDay(fromDate, toDate)) {
          return isSameDay(jobDate, fromDate);
        }
        
        return isWithinInterval(jobDate, { start: fromDate, end: toDate });
      });
    }

    if (amountRange) {
      result = result.filter(job => {
        if (!job.amount) return true;
        
        if (amountRange.min !== undefined && amountRange.max !== undefined) {
          return job.amount >= amountRange.min && job.amount <= amountRange.max;
        } else if (amountRange.min !== undefined) {
          return job.amount >= amountRange.min;
        } else if (amountRange.max !== undefined) {
          return job.amount <= amountRange.max;
        }
        return true;
      });
    }

    if (paymentMethod) {
      result = result.filter(job => 
        job.paymentMethod === paymentMethod
      );
    }

    return result;
  };

  return {
    // Filter state
    selectedTechnicians,
    selectedCategories,
    selectedJobSources,
    date,
    amountRange,
    paymentMethod,
    appliedFilters,
    hasActiveFilters,
    
    // Filter setters
    setDate,
    setAmountRange,
    setPaymentMethod,
    
    // Filter actions
    toggleTechnician,
    toggleCategory,
    toggleJobSource,
    selectAllTechnicians,
    deselectAllTechnicians,
    selectAllJobSources,
    deselectAllJobSources,
    clearFilters,
    applyFilters,
    
    // Filter logic
    filterJobs
  };
};
