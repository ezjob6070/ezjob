
import { useState, useEffect } from "react";
import { Job, PaymentMethod } from "@/components/jobs/JobTypes";
import { AmountRange } from "@/components/jobs/AmountFilter";
import { DateRange } from "react-day-picker";
import { addDays, isSameDay, isWithinInterval, startOfDay } from "date-fns";

export const useJobsData = (initialJobs: Job[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(initialJobs);
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [amountRange, setAmountRange] = useState<AmountRange | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [appliedFilters, setAppliedFilters] = useState(false);

  const handleCancelJob = (jobId: string) => {
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === jobId ? { ...job, status: "cancelled" } : job
      )
    );
  };

  useEffect(() => {
    let result = jobs;

    if (searchTerm) {
      result = result.filter(job =>
        job.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (appliedFilters && selectedTechnicians.length > 0) {
      result = result.filter(job => 
        job.technicianName && selectedTechnicians.includes(job.technicianName)
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter(job => 
        selectedCategories.some(category => 
          job.title.toLowerCase().includes(category.toLowerCase())
        )
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

    setFilteredJobs(result);
  }, [jobs, searchTerm, selectedTechnicians, selectedCategories, date, amountRange, paymentMethod, appliedFilters]);

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

  const selectAllTechnicians = () => {
    setSelectedTechnicians(prevTechnicians => [...prevTechnicians]);
  };

  const deselectAllTechnicians = () => {
    setSelectedTechnicians([]);
  };

  const clearFilters = () => {
    setSelectedTechnicians([]);
    setSelectedCategories([]);
    setDate(undefined);
    setAmountRange(null);
    setPaymentMethod(null);
    setAppliedFilters(false);
  };

  const applyFilters = () => {
    setAppliedFilters(true);
  };

  const hasActiveFilters = appliedFilters || 
    selectedCategories.length > 0 || 
    date?.from || 
    amountRange || 
    paymentMethod;

  return {
    jobs,
    setJobs,
    filteredJobs,
    searchTerm,
    setSearchTerm,
    selectedTechnicians,
    selectedCategories,
    date,
    amountRange,
    paymentMethod,
    appliedFilters,
    hasActiveFilters,
    toggleTechnician,
    toggleCategory,
    setDate,
    setAmountRange,
    setPaymentMethod,
    selectAllTechnicians,
    deselectAllTechnicians,
    clearFilters,
    applyFilters,
    handleCancelJob
  };
};
