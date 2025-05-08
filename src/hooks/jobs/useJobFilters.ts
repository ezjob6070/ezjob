
import { useState } from "react";
import { Job, PaymentMethod } from "@/components/jobs/JobTypes";
import { AmountRange } from "@/components/jobs/AmountFilter";
import { DateRange } from "react-day-picker";
import { isWithinInterval, isSameDay, startOfDay } from "date-fns";

export const useJobFilters = (initialJobSources: string[] = [], initialContractors: string[] = []) => {
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);
  const [selectedContractors, setSelectedContractors] = useState<string[]>([]);
  const [selectedJobSources, setSelectedJobSources] = useState<string[]>([]);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([]);
  
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

  const toggleContractor = (contractorName: string) => {
    setSelectedContractors(prev => 
      prev.includes(contractorName) 
        ? prev.filter(c => c !== contractorName)
        : [...prev, contractorName]
    );
  };

  const toggleJobSource = (sourceName: string) => {
    setSelectedJobSources(prev => 
      prev.includes(sourceName) 
        ? prev.filter(s => s !== sourceName)
        : [...prev, sourceName]
    );
  };

  const toggleServiceType = (serviceType: string) => {
    setSelectedServiceTypes(prev => 
      prev.includes(serviceType) 
        ? prev.filter(s => s !== serviceType)
        : [...prev, serviceType]
    );
  };

  const selectAllTechnicians = () => {
    // This should be updated to set all technician names
    setSelectedTechnicians(prevTechnicians => [...prevTechnicians]);
  };

  const deselectAllTechnicians = () => {
    setSelectedTechnicians([]);
  };

  const selectAllContractors = () => {
    setSelectedContractors(initialContractors);
  };

  const deselectAllContractors = () => {
    setSelectedContractors([]);
  };

  const selectAllJobSources = () => {
    setSelectedJobSources(initialJobSources);
  };

  const deselectAllJobSources = () => {
    setSelectedJobSources([]);
  };

  const clearFilters = () => {
    setSelectedTechnicians([]);
    setSelectedContractors([]);
    setSelectedJobSources([]);
    setSelectedServiceTypes([]);
    // Reset date to today
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
    selectedContractors.length > 0 || 
    selectedJobSources.length > 0 ||
    selectedServiceTypes.length > 0 ||
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

    // Filter by contractor
    if (selectedContractors.length > 0) {
      result = result.filter(job => 
        job.contractorName && selectedContractors.includes(job.contractorName)
      );
    }

    // Filter by service type
    if (selectedServiceTypes.length > 0) {
      result = result.filter(job => 
        job.serviceType && selectedServiceTypes.includes(job.serviceType)
      );
    }

    // Filter by job source
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
    selectedContractors,
    selectedJobSources,
    selectedServiceTypes,
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
    toggleContractor,
    toggleJobSource,
    toggleServiceType,
    selectAllTechnicians,
    deselectAllTechnicians,
    selectAllContractors,
    deselectAllContractors,
    selectAllJobSources,
    deselectAllJobSources,
    clearFilters,
    applyFilters,
    
    // Filter logic
    filterJobs
  };
};
