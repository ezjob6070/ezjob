
import { useState, useEffect } from "react";
import { Job } from "@/components/jobs/JobTypes";
import { useJobFilters } from "./useJobFilters";
import { useJobActions } from "./useJobActions";
import { UseJobsDataResult } from "./jobHookTypes";

export const useJobsData = (initialJobs: Job[] = [], jobSourceNames: string[] = []): UseJobsDataResult => {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState<Job[]>(initialJobs || []);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(initialJobs || []);

  // Get job filters functionality
  const jobFilters = useJobFilters(jobSourceNames || []);
  
  // Get job status actions functionality
  const jobActions = useJobActions(setJobs);

  // Update filtered jobs when any filter changes
  useEffect(() => {
    const result = jobFilters.filterJobs(jobs, searchTerm);
    setFilteredJobs(result);
  }, [
    jobs, 
    searchTerm, 
    jobFilters.selectedTechnicians, 
    jobFilters.selectedCategories, 
    jobFilters.selectedJobSources, 
    jobFilters.date, 
    jobFilters.amountRange, 
    jobFilters.paymentMethod, 
    jobFilters.appliedFilters
  ]);

  // Combine all the hooks into a single result object
  return {
    // Job data
    jobs,
    setJobs,
    filteredJobs,
    searchTerm,
    setSearchTerm,
    
    // From useJobFilters
    selectedTechnicians: jobFilters.selectedTechnicians,
    selectedCategories: jobFilters.selectedCategories,
    selectedJobSources: jobFilters.selectedJobSources,
    date: jobFilters.date,
    amountRange: jobFilters.amountRange,
    paymentMethod: jobFilters.paymentMethod,
    appliedFilters: jobFilters.appliedFilters,
    hasActiveFilters: jobFilters.hasActiveFilters,
    toggleTechnician: jobFilters.toggleTechnician,
    toggleCategory: jobFilters.toggleCategory,
    toggleJobSource: jobFilters.toggleJobSource,
    setDate: jobFilters.setDate,
    setAmountRange: jobFilters.setAmountRange,
    setPaymentMethod: jobFilters.setPaymentMethod,
    selectAllTechnicians: jobFilters.selectAllTechnicians,
    deselectAllTechnicians: jobFilters.deselectAllTechnicians,
    selectAllJobSources: jobFilters.selectAllJobSources,
    deselectAllJobSources: jobFilters.deselectAllJobSources,
    clearFilters: jobFilters.clearFilters,
    applyFilters: jobFilters.applyFilters,
    
    // From useJobActions
    selectedJob: jobActions.selectedJob,
    isStatusModalOpen: jobActions.isStatusModalOpen,
    handleCancelJob: jobActions.handleCancelJob,
    handleCompleteJob: jobActions.handleCompleteJob,
    handleRescheduleJob: jobActions.handleRescheduleJob,
    updateJobStatus: jobActions.updateJobStatus,
    openStatusModal: jobActions.openStatusModal,
    closeStatusModal: jobActions.closeStatusModal
  };
};
