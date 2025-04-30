
// This is a minimal fix to address the TypeScript errors in Jobs.tsx
// Only adding the missing properties to the existing hook

import { useState, useEffect } from 'react';
import { initialJobs } from '@/data/jobs';
import { Job, AmountRange, PaymentMethod } from '@/components/jobs/JobTypes';
import { JOB_CATEGORIES, SERVICE_TYPES } from '@/components/jobs/constants';

export interface UseJobsDataResult {
  jobs: Job[];
  loading: boolean;
  error: Error | null;
  // Properties needed for Jobs.tsx
  filteredJobs: Job[];
  selectedServiceTypes: string[];
  toggleServiceType: (serviceType: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTechnicians: string[];
  selectedCategories: string[];
  selectedJobSources: string[];
  date: string | null;
  amountRange: AmountRange | null;
  paymentMethod: PaymentMethod | null;
  appliedFilters: number;
  hasActiveFilters: boolean;
  selectedJob: Job | null;
  isStatusModalOpen: boolean;
  toggleTechnician: (technicianId: string) => void;
  toggleCategory: (category: string) => void;
  toggleJobSource: (jobSource: string) => void;
  setDate: (date: string | null) => void;
  setAmountRange: (range: AmountRange | null) => void;
  setPaymentMethod: (method: PaymentMethod | null) => void;
  selectAllTechnicians: () => void;
  deselectAllTechnicians: () => void;
  selectAllJobSources: () => void;
  deselectAllJobSources: () => void;
  clearFilters: () => void;
  applyFilters: () => void;
  handleRescheduleJob: (jobId: string, newDate: string) => void;
  openStatusModal: (job: Job) => void;
  closeStatusModal: () => void;
  handleUpdateJobStatus: (jobId: string, newStatus: string) => void;
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
  const [date, setDate] = useState<string | null>(null);
  const [amountRange, setAmountRange] = useState<AmountRange | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [hasActiveFilters, setHasActiveFilters] = useState<boolean>(false);
  const [appliedFilters, setAppliedFilters] = useState<number>(0);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);

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

  const toggleServiceType = (serviceType: string) => {
    setSelectedServiceTypes(prev => {
      if (prev.includes(serviceType)) {
        return prev.filter(type => type !== serviceType);
      } else {
        return [...prev, serviceType];
      }
    });
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
    const allTechIds = [...new Set(jobs.map(job => job.technicianId))].filter(Boolean) as string[];
    setSelectedTechnicians(allTechIds);
  };

  const deselectAllTechnicians = () => {
    setSelectedTechnicians([]);
  };

  const selectAllJobSources = () => {
    const allSources = [...new Set(jobs.map(job => job.jobSourceId))].filter(Boolean) as string[];
    setSelectedJobSources(allSources);
  };

  const deselectAllJobSources = () => {
    setSelectedJobSources([]);
  };

  const clearFilters = () => {
    setSelectedTechnicians([]);
    setSelectedCategories([]);
    setSelectedJobSources([]);
    setDate(null);
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
      filtered = filtered.filter(job => job.technicianId && selectedTechnicians.includes(job.technicianId));
    }
    
    if (selectedCategories.length) {
      filtered = filtered.filter(job => job.category && selectedCategories.includes(job.category));
    }
    
    if (selectedJobSources.length) {
      filtered = filtered.filter(job => job.jobSourceId && selectedJobSources.includes(job.jobSourceId));
    }
    
    if (date) {
      filtered = filtered.filter(job => {
        const jobDate = job.date ? (typeof job.date === 'string' ? job.date : job.date.toISOString()) : '';
        return jobDate === date;
      });
    }
    
    if (amountRange) {
      filtered = filtered.filter(job => {
        const amount = job.amount || 0;
        return amount >= amountRange.min && amount <= amountRange.max;
      });
    }
    
    if (paymentMethod) {
      filtered = filtered.filter(job => job.paymentMethod === paymentMethod);
    }
    
    // Count applied filters for display
    let filterCount = 0;
    if (selectedTechnicians.length) filterCount++;
    if (selectedCategories.length) filterCount++;
    if (selectedJobSources.length) filterCount++;
    if (date) filterCount++;
    if (amountRange) filterCount++;
    if (paymentMethod) filterCount++;
    if (searchTerm) filterCount++;
    
    setAppliedFilters(filterCount);
    setHasActiveFilters(filterCount > 0);
    setFilteredJobs(filtered);
  };

  const handleRescheduleJob = (jobId: string, newDate: string) => {
    const updatedJobs = jobs.map(job => 
      job.id === jobId ? { ...job, date: newDate } : job
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

  return {
    jobs,
    loading,
    error,
    selectedServiceTypes,
    toggleServiceType,
    filteredJobs,
    searchTerm,
    setSearchTerm,
    selectedTechnicians,
    selectedCategories,
    selectedJobSources,
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
    setDate,
    setAmountRange,
    setPaymentMethod,
    selectAllTechnicians,
    deselectAllTechnicians,
    selectAllJobSources,
    deselectAllJobSources,
    clearFilters,
    applyFilters,
    handleRescheduleJob,
    openStatusModal,
    closeStatusModal,
    handleUpdateJobStatus
  };
};

export default useJobsData;
