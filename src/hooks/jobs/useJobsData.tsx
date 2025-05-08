
// This is a minimal fix to address the TypeScript errors in Jobs.tsx

import { useState, useEffect, useMemo } from 'react';
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
  selectedContractors: string[];  // Added for contractors
  date: DateRange | undefined;
  amountRange: AmountRange | null;
  paymentMethod: PaymentMethod | null;
  appliedFilters: number;
  hasActiveFilters: boolean;
  selectedJob: Job | null;
  isStatusModalOpen: boolean;
  toggleTechnician: (technicianId: string) => void;
  toggleContractor: (contractorId: string) => void;  // Added for contractors
  toggleCategory: (category: string) => void;
  toggleJobSource: (jobSource: string) => void;
  setDate: (date: DateRange | undefined) => void;
  setAmountRange: (range: AmountRange | null) => void;
  setPaymentMethod: (method: PaymentMethod | null) => void;
  selectAllTechnicians: () => void;
  deselectAllTechnicians: () => void;
  selectAllContractors: () => void;  // Added for contractors
  deselectAllContractors: () => void;  // Added for contractors
  selectAllJobSources: () => void;
  deselectAllJobSources: () => void;
  clearFilters: () => void;
  applyFilters: () => void;
  handleRescheduleJob: (jobId: string, newDate: Date | string, isAllDay?: boolean) => void;
  openStatusModal: (job: Job) => void;
  closeStatusModal: () => void;
  handleUpdateJobStatus: (jobId: string, newStatus: string) => void;
  datePopoverOpen: boolean;
  setDatePopoverOpen: (open: boolean) => void;
  techPopoverOpen: boolean;
  setTechPopoverOpen: (open: boolean) => void;
  contractorPopoverOpen: boolean;
  setContractorPopoverOpen: (open: boolean) => void;
  sourcePopoverOpen: boolean;
  setSourcePopoverOpen: (open: boolean) => void;
  amountPopoverOpen: boolean;
  setAmountPopoverOpen: (open: boolean) => void;
  paymentPopoverOpen: boolean;
  setPaymentPopoverOpen: (open: boolean) => void;
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
  const [selectedContractors, setSelectedContractors] = useState<string[]>([]);  // Added for contractors
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [amountRange, setAmountRange] = useState<AmountRange | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [hasActiveFilters, setHasActiveFilters] = useState<boolean>(false);
  const [appliedFilters, setAppliedFilters] = useState<number>(0);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);
  
  // Popovers state
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [techPopoverOpen, setTechPopoverOpen] = useState(false);
  const [contractorPopoverOpen, setContractorPopoverOpen] = useState(false);
  const [sourcePopoverOpen, setSourcePopoverOpen] = useState(false);
  const [amountPopoverOpen, setAmountPopoverOpen] = useState(false);
  const [paymentPopoverOpen, setPaymentPopoverOpen] = useState(false);

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

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedTechnicians, selectedCategories, selectedJobSources, selectedContractors, date, amountRange, paymentMethod, jobs]);

  // Service type selection functions
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
    setSelectedServiceTypes(SERVICE_TYPES);
  };

  const deselectAllServiceTypes = () => {
    setSelectedServiceTypes([]);
  };

  const toggleTechnician = (technicianId: string) => {
    setSelectedTechnicians(prev => {
      if (prev.includes(technicianId)) {
        return prev.filter(id => id !== technicianId);
      } else {
        return [...prev, technicianId];
      }
    });
  };

  const toggleContractor = (contractorId: string) => {
    setSelectedContractors(prev => {
      if (prev.includes(contractorId)) {
        return prev.filter(id => id !== contractorId);
      } else {
        return [...prev, contractorId];
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

  // Selection functions
  const selectAllTechnicians = () => {
    const allTechIds = [...new Set(jobs.map(job => job.technicianName))].filter(Boolean) as string[];
    setSelectedTechnicians(allTechIds);
  };

  const deselectAllTechnicians = () => {
    setSelectedTechnicians([]);
  };

  const selectAllContractors = () => {
    const allContractors = [...new Set(jobs.map(job => job.contractorName))].filter(Boolean) as string[];
    setSelectedContractors(allContractors);
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

  // Filter management
  const clearFilters = () => {
    setSelectedTechnicians([]);
    setSelectedContractors([]);
    setSelectedCategories([]);
    setSelectedJobSources([]);
    setSelectedServiceTypes([]);
    setDate(undefined);
    setAmountRange(null);
    setPaymentMethod(null);
    setSearchTerm('');
    setAppliedFilters(0);
    setHasActiveFilters(false);
    setFilteredJobs(jobs);
  };

  const applyFilters = () => {
    let filtered = jobs;
    
    if (searchTerm) {
      filtered = filtered.filter(job => 
        (job.clientName || '')?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.address || '')?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.description || '')?.toLowerCase().includes(searchTerm.toLowerCase())
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

    if (selectedServiceTypes.length) {
      filtered = filtered.filter(job => job.serviceType && selectedServiceTypes.includes(job.serviceType));
    }
    
    if (selectedJobSources.length) {
      filtered = filtered.filter(job => job.jobSourceName && selectedJobSources.includes(job.jobSourceName));
    }
    
    if (date?.from) {
      filtered = filtered.filter(job => {
        if (!job.date) return false;
        const jobDate = new Date(job.date);
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
    
    // Count applied filters for display
    let filterCount = 0;
    if (selectedTechnicians.length) filterCount++;
    if (selectedContractors.length) filterCount++;
    if (selectedCategories.length) filterCount++;
    if (selectedServiceTypes.length) filterCount++;
    if (selectedJobSources.length) filterCount++;
    if (date?.from) filterCount++;
    if (amountRange) filterCount++;
    if (paymentMethod) filterCount++;
    if (searchTerm) filterCount++;
    
    setAppliedFilters(filterCount);
    setHasActiveFilters(filterCount > 0);
    setFilteredJobs(filtered);
  };

  // Job modification functions
  const handleRescheduleJob = (jobId: string, newDate: Date | string, isAllDay: boolean = false) => {
    const dateValue = typeof newDate === 'string' ? new Date(newDate) : newDate;
    
    const updatedJobs = jobs.map(job => 
      job.id === jobId ? { 
        ...job, 
        date: dateValue,
        scheduledDate: dateValue,
        isAllDay: isAllDay,
        status: 'scheduled' as const
      } : job
    );
    
    setJobs(updatedJobs);
    applyFilters();
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
      job.id === jobId ? { ...job, status: newStatus as any } : job
    );
    
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
    toggleContractor,
    toggleCategory,
    toggleJobSource,
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
    datePopoverOpen,
    setDatePopoverOpen,
    techPopoverOpen,
    setTechPopoverOpen,
    contractorPopoverOpen,
    setContractorPopoverOpen,
    sourcePopoverOpen,
    setSourcePopoverOpen,
    amountPopoverOpen,
    setAmountPopoverOpen,
    paymentPopoverOpen,
    setPaymentPopoverOpen
  };
};

export default useJobsData;
