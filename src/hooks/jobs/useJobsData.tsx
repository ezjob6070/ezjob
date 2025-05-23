
// This is a minimal fix to address the TypeScript errors in Jobs.tsx
// Only adding the missing properties to the existing hook

import { useState, useEffect } from 'react';
import { initialJobs } from '@/data/jobs';
import { Job, AmountRange, PaymentMethod } from '@/components/jobs/JobTypes';
import { JOB_CATEGORIES, SERVICE_TYPES } from '@/components/jobs/constants';
import { DateRange } from 'react-day-picker';

export interface UseJobsDataResult {
  jobs: Job[];
  loading: boolean;
  error: Error | null;
  // Properties needed for Jobs.tsx
  filteredJobs: Job[];
  selectedServiceTypes: string[];
  toggleServiceType: (serviceType: string) => void;
  selectAllServiceTypes: () => void;
  deselectAllServiceTypes: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTechnicians: string[];
  selectedCategories: string[];
  selectedJobSources: string[];
  date: DateRange | undefined;
  amountRange: AmountRange | null;
  paymentMethod: PaymentMethod | null;
  appliedFilters: number;
  hasActiveFilters: boolean;
  selectedJob: Job | null;
  isStatusModalOpen: boolean;
  toggleTechnician: (technicianId: string) => void;
  toggleCategory: (category: string) => void;
  toggleJobSource: (jobSource: string) => void;
  setDate: (date: DateRange | undefined) => void;
  setAmountRange: (range: AmountRange | null) => void;
  setPaymentMethod: (method: PaymentMethod | null) => void;
  selectAllTechnicians: () => void;
  deselectAllTechnicians: () => void;
  selectAllJobSources: () => void;
  deselectAllJobSources: () => void;
  clearFilters: () => void;
  applyFilters: () => void;
  handleRescheduleJob: (jobId: string, newDate: Date | string) => void;
  openStatusModal: (job: Job) => void;
  closeStatusModal: () => void;
  handleUpdateJobStatus: (jobId: string, newStatus: string) => void;
  handleCancelJob: (jobId: string, cancellationReason?: string) => void;
  handleCompleteJob: (jobId: string, actualAmount?: number) => void;
  // Properties for sorting
  sortBy: string;
  setSortBy: (option: string) => void;
  // Properties for contractors
  selectedContractors: string[];
  toggleContractor: (contractorName: string) => void;
  selectAllContractors: () => void;
  deselectAllContractors: () => void;
}

export const useJobsData = (initialJobsData: Job[] = [], jobSourceNames: string[] = []): UseJobsDataResult => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedJobSources, setSelectedJobSources] = useState<string[]>([]);
  const [selectedContractors, setSelectedContractors] = useState<string[]>([]);
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [amountRange, setAmountRange] = useState<AmountRange | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [hasActiveFilters, setHasActiveFilters] = useState<boolean>(false);
  const [appliedFilters, setAppliedFilters] = useState<number>(0);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("newest");

  useEffect(() => {
    try {
      const jobsToUse = initialJobsData.length > 0 ? initialJobsData : initialJobs;
      setJobs(jobsToUse);
      setFilteredJobs(jobsToUse);
      setLoading(false);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, [initialJobsData]);

  // Effect to filter jobs when filters change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedTechnicians, selectedCategories, selectedJobSources, selectedServiceTypes, selectedContractors, date, amountRange, paymentMethod, sortBy]);

  const toggleServiceType = (serviceType: string) => {
    setSelectedServiceTypes(prev => {
      if (prev.includes(serviceType)) {
        return prev.filter(type => type !== serviceType);
      } else {
        return [...prev, serviceType];
      }
    });
  };

  const selectAllServiceTypes = () => {
    const allServiceTypes = SERVICE_TYPES || [];
    setSelectedServiceTypes(allServiceTypes);
  };

  const deselectAllServiceTypes = () => {
    setSelectedServiceTypes([]);
  };

  const toggleTechnician = (technicianName: string) => {
    setSelectedTechnicians(prev => {
      if (prev.includes(technicianName)) {
        return prev.filter(name => name !== technicianName);
      } else {
        return [...prev, technicianName];
      }
    });
  };

  const toggleContractor = (contractorName: string) => {
    setSelectedContractors(prev => {
      if (prev.includes(contractorName)) {
        return prev.filter(name => name !== contractorName);
      } else {
        return [...prev, contractorName];
      }
    });
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const toggleJobSource = (jobSource: string) => {
    setSelectedJobSources(prev => {
      if (prev.includes(jobSource)) {
        return prev.filter(source => source !== jobSource);
      } else {
        return [...prev, jobSource];
      }
    });
  };

  const selectAllTechnicians = () => {
    // Get all unique technician names from jobs
    const techNames = jobs
      .map(job => job.technicianName)
      .filter(Boolean) as string[];
    setSelectedTechnicians([...new Set(techNames)]);
  };

  const deselectAllTechnicians = () => {
    setSelectedTechnicians([]);
  };

  const selectAllContractors = () => {
    // Get all unique contractor names from jobs
    const contractorNames = jobs
      .map(job => job.contractorName)
      .filter(Boolean) as string[];
    setSelectedContractors([...new Set(contractorNames)]);
  };

  const deselectAllContractors = () => {
    setSelectedContractors([]);
  };

  const selectAllJobSources = () => {
    const allSources = [...new Set(jobs.map(job => job.jobSourceName))].filter(Boolean) as string[];
    setSelectedJobSources(allSources);
  };

  const deselectAllJobSources = () => {
    setSelectedJobSources([]);
  };

  const clearFilters = () => {
    setSelectedTechnicians([]);
    setSelectedCategories([]);
    setSelectedJobSources([]);
    setSelectedServiceTypes([]);
    setSelectedContractors([]);
    setDate(undefined);
    setAmountRange(null);
    setPaymentMethod(null);
    setSearchTerm('');
    setAppliedFilters(0);
    setHasActiveFilters(false);
    setFilteredJobs(jobs);
    setSortBy("newest"); // Reset sort to newest first
  };

  const applyFilters = () => {
    let filtered = jobs;
    
    if (searchTerm) {
      filtered = filtered.filter(job => 
        (job.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.technicianName || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedTechnicians.length) {
      filtered = filtered.filter(job => job.technicianName && selectedTechnicians.includes(job.technicianName));
    }
    
    if (selectedContractors.length) {
      filtered = filtered.filter(job => job.contractorName && selectedContractors.includes(job.contractorName));
    }
    
    if (selectedCategories.length) {
      filtered = filtered.filter(job => job.category && selectedCategories.includes(job.category));
    }
    
    if (selectedJobSources.length) {
      filtered = filtered.filter(job => job.jobSourceName && selectedJobSources.includes(job.jobSourceName));
    }
    
    if (selectedServiceTypes.length) {
      filtered = filtered.filter(job => job.serviceType && selectedServiceTypes.includes(job.serviceType));
    }
    
    if (date?.from) {
      filtered = filtered.filter(job => {
        if (!job.date) return false;
        const jobDate = new Date(typeof job.date === 'string' ? job.date : job.date);
        return date.from && date.to ? 
          jobDate >= date.from && jobDate <= date.to : 
          date.from && jobDate >= date.from;
      });
    }
    
    if (amountRange) {
      filtered = filtered.filter(job => {
        const amount = job.amount || 0;
        return (amountRange.min === undefined || amount >= amountRange.min) && 
               (amountRange.max === undefined || amount <= amountRange.max);
      });
    }
    
    if (paymentMethod) {
      filtered = filtered.filter(job => job.paymentMethod === paymentMethod);
    }
    
    // Apply sorting after filtering
    if (sortBy === "newest") {
      filtered = [...filtered].sort((a, b) => {
        const dateA = new Date(a.date || a.scheduledDate || '').getTime();
        const dateB = new Date(b.date || b.scheduledDate || '').getTime();
        return dateB - dateA; // newest first
      });
    } else if (sortBy === "oldest") {
      filtered = [...filtered].sort((a, b) => {
        const dateA = new Date(a.date || a.scheduledDate || '').getTime();
        const dateB = new Date(b.date || b.scheduledDate || '').getTime();
        return dateA - dateB; // oldest first
      });
    } else if (sortBy === "name-asc") {
      filtered = [...filtered].sort((a, b) => {
        return (a.clientName || "").localeCompare(b.clientName || "");
      });
    } else if (sortBy === "name-desc") {
      filtered = [...filtered].sort((a, b) => {
        return (b.clientName || "").localeCompare(a.clientName || "");
      });
    } else if (sortBy === "revenue-high") {
      filtered = [...filtered].sort((a, b) => {
        const amountA = a.amount || 0;
        const amountB = b.amount || 0;
        return amountB - amountA; // high to low
      });
    } else if (sortBy === "revenue-low") {
      filtered = [...filtered].sort((a, b) => {
        const amountA = a.amount || 0;
        const amountB = b.amount || 0;
        return amountA - amountB; // low to high
      });
    }
    
    // Count applied filters for display
    let filterCount = 0;
    if (selectedTechnicians.length) filterCount++;
    if (selectedContractors.length) filterCount++;
    if (selectedCategories.length) filterCount++;
    if (selectedJobSources.length) filterCount++;
    if (selectedServiceTypes.length) filterCount++;
    if (date?.from) filterCount++;
    if (amountRange) filterCount++;
    if (paymentMethod) filterCount++;
    if (searchTerm) filterCount++;
    if (sortBy !== "newest") filterCount++;
    
    setAppliedFilters(filterCount);
    setHasActiveFilters(filterCount > 0);
    setFilteredJobs(filtered);
  };

  const handleRescheduleJob = (jobId: string, newDate: Date | string) => {
    const dateValue = typeof newDate === 'string' ? new Date(newDate) : newDate;
    
    const updatedJobs = jobs.map(job => 
      job.id === jobId ? { ...job, date: dateValue } : job
    );
    
    setJobs(updatedJobs);
    setFilteredJobs(updatedJobs);
  };

  const openStatusModal = (job: Job) => {
    setSelectedJob(job);
    setIsStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    setIsStatusModalOpen(false);
    setSelectedJob(null);
  };

  const handleUpdateJobStatus = (jobId: string, newStatus: string) => {
    const updatedJobs = jobs.map(job => 
      job.id === jobId ? { ...job, status: newStatus } : job
    ) as Job[];
    
    setJobs(updatedJobs);
    setFilteredJobs(updatedJobs);
    closeStatusModal();
  };

  const handleCancelJob = (jobId: string, cancellationReason?: string) => {
    const updatedJobs = jobs.map(job => 
      job.id === jobId 
        ? { ...job, status: "cancelled", cancellationReason: cancellationReason || "No reason provided" } 
        : job
    ) as Job[];
    
    setJobs(updatedJobs);
    applyFilters();
    closeStatusModal();
  };

  const handleCompleteJob = (jobId: string, actualAmount?: number) => {
    const updatedJobs = jobs.map(job => 
      job.id === jobId 
        ? { 
            ...job, 
            status: "completed", 
            actualAmount: actualAmount !== undefined ? actualAmount : job.amount
          } 
        : job
    ) as Job[];
    
    setJobs(updatedJobs);
    applyFilters();
    closeStatusModal();
  };

  return {
    jobs,
    loading,
    error,
    selectedServiceTypes,
    toggleServiceType,
    selectAllServiceTypes,
    deselectAllServiceTypes,
    filteredJobs,
    searchTerm,
    setSearchTerm,
    selectedTechnicians,
    selectedCategories,
    selectedJobSources,
    selectedContractors,
    date,
    amountRange,
    paymentMethod,
    appliedFilters,
    hasActiveFilters,
    selectedJob,
    isStatusModalOpen,
    toggleTechnician,
    toggleCategory,
    toggleJobSource,
    toggleContractor,
    setDate,
    setAmountRange,
    setPaymentMethod,
    selectAllTechnicians,
    deselectAllTechnicians,
    selectAllContractors,
    deselectAllContractors,
    selectAllJobSources,
    deselectAllJobSources,
    clearFilters,
    applyFilters,
    handleRescheduleJob,
    openStatusModal,
    closeStatusModal,
    handleUpdateJobStatus,
    handleCancelJob,
    handleCompleteJob,
    sortBy,
    setSortBy
  };
};

export default useJobsData;
