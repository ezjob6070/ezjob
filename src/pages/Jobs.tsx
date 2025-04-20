
import { useState } from "react";
import { useJobsData } from "@/hooks/useJobsData";
import { useJobSourceData, JOB_SOURCES } from "@/hooks/jobs/useJobSourceData";
import { JOB_CATEGORIES } from "@/components/jobs/constants";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";
import JobStats from "@/components/jobs/JobStats";
import JobModals from "@/components/jobs/JobModals";
import { Job } from "@/components/jobs/JobTypes";
import { toast } from "@/hooks/use-toast";
import JobsHeader from "@/components/jobs/JobsHeader";
import JobsContainer from "@/components/jobs/JobsContainer";
import { JobsProvider } from "@/components/jobs/context/JobsContext";

const Jobs = () => {
  const { jobs: globalJobs, technicians: globalTechnicians, jobSources: globalJobSources, addJob, completeJob, cancelJob } = useGlobalState();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>(JOB_CATEGORIES);
  
  // Control state for filter popovers
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [techPopoverOpen, setTechPopoverOpen] = useState(false);
  const [sourcePopoverOpen, setSourcePopoverOpen] = useState(false);
  const [amountPopoverOpen, setAmountPopoverOpen] = useState(false);
  const [paymentPopoverOpen, setPaymentPopoverOpen] = useState(false);

  // Get job source related data and functions
  const jobSourceData = useJobSourceData();
  
  // Map job source names from global state
  const jobSourceNames = globalJobSources.map(source => source.name);
  
  // Get jobs data and filter functionality
  const {
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
    closeStatusModal
  } = useJobsData(globalJobs, jobSourceNames);

  // Set up technician data
  const technicianNames = globalTechnicians.map(tech => tech.name);
  const technicianOptions = globalTechnicians.map(tech => ({ id: tech.id, name: tech.name }));

  // Handler functions
  const addCategory = (category: string) => {
    setCategories(prev => [...prev, category]);
  };

  const handleAddJob = (job: Job) => {
    addJob(job);
  };

  const handleCancelJob = (jobId: string, reason?: string) => {
    cancelJob(jobId, reason);
  };

  const handleCompleteJob = (jobId: string, actualAmount: number) => {
    completeJob(jobId, actualAmount);
  };
  
  // Create context value
  const contextValue = {
    // Modals state
    isCreateModalOpen,
    setIsCreateModalOpen,
    
    // Filter popovers state
    datePopoverOpen, setDatePopoverOpen,
    techPopoverOpen, setTechPopoverOpen,
    sourcePopoverOpen, setSourcePopoverOpen,
    amountPopoverOpen, setAmountPopoverOpen,
    paymentPopoverOpen, setPaymentPopoverOpen,
    
    // Jobs data 
    jobs: globalJobs,
    filteredJobs,
    searchTerm,
    setSearchTerm,
    
    // Filters
    selectedTechnicians,
    selectedCategories,
    selectedJobSources,
    date,
    amountRange,
    paymentMethod,
    hasActiveFilters,
    
    // Filter operations
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
    
    // Job operations
    handleAddJob,
    handleCancelJob,
    handleCompleteJob,
    handleRescheduleJob,
    
    // Job status modal
    selectedJob,
    isStatusModalOpen,
    openStatusModal,
    closeStatusModal,
    
    // Job source operations
    toggleJobSourceSidebar: jobSourceData.toggleJobSourceSidebar
  };

  // Transform job sources for the JobModals component
  const jobSourcesForModal = globalJobSources.map(source => ({
    id: source.id,
    name: source.name
  }));

  return (
    <JobsProvider value={contextValue}>
      <div className="space-y-6 py-8">
        {/* Header Section */}
        <JobsHeader />

        {/* Job Stats Cards */}
        <JobStats jobs={filteredJobs} date={date} />
        
        {/* Jobs Container (Filter and Table) */}
        <JobsContainer 
          technicianNames={technicianNames}
          jobSourceNames={jobSourceNames}
        />

        {/* Modals */}
        <JobModals
          isCreateModalOpen={isCreateModalOpen}
          setIsCreateModalOpen={setIsCreateModalOpen}
          isJobSourceSidebarOpen={jobSourceData.isJobSourceSidebarOpen}
          setIsJobSourceSidebarOpen={jobSourceData.setIsJobSourceSidebarOpen}
          onAddJob={handleAddJob}
          onAddJobSource={jobSourceData.handleAddJobSource}
          onEditJobSource={jobSourceData.handleEditJobSource}
          technicianOptions={technicianOptions}
          jobSources={jobSourcesForModal}
          allJobSources={globalJobSources}
        />
      </div>
    </JobsProvider>
  );
};

export default Jobs;
