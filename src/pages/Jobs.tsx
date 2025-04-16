
import { useState } from "react";
import { initialJobs } from "@/data/jobs";
import { initialTechnicians } from "@/data/technicians";
import { useJobsData } from "@/hooks/useJobsData";
import { useJobSourceData, JOB_SOURCES } from "@/hooks/jobs/useJobSourceData";
import { JOB_CATEGORIES } from "@/components/jobs/constants";
import JobStats from "@/components/jobs/JobStats";
import JobModals from "@/components/jobs/JobModals";
import { Job } from "@/components/jobs/JobTypes";
import { toast } from "@/hooks/use-toast";
import JobsHeader from "@/components/jobs/JobsHeader";
import JobsContainer from "@/components/jobs/JobsContainer";
import { JobsProvider } from "@/components/jobs/context/JobsContext";

const Jobs = () => {
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
  
  // Get jobs data and filter functionality
  const {
    jobs,
    setJobs,
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
    handleCancelJob,
    handleCompleteJob,
    handleRescheduleJob,
    openStatusModal,
    closeStatusModal
  } = useJobsData(initialJobs, JOB_SOURCES ? JOB_SOURCES.map(source => source.name) : []);

  // Ensure technicians data is properly initialized and not undefined
  const technicianOptions = initialTechnicians ? initialTechnicians.map(tech => ({
    id: tech.id,
    name: tech.name
  })) : [];
  
  const technicianNames = initialTechnicians ? initialTechnicians.map(tech => tech.name) : [];
  const jobSourceNames = JOB_SOURCES ? JOB_SOURCES.map(source => source.name) : [];

  // Handler functions
  const addCategory = (category: string) => {
    setCategories(prev => [...prev, category]);
  };

  const handleAddJob = (job: Job) => {
    setJobs([job, ...jobs]);
    toast({
      title: "Job created",
      description: `New job for ${job.clientName} has been created and is in progress.`,
    });
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
    jobs,
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
          jobSources={JOB_SOURCES ? JOB_SOURCES.map(source => ({ id: source.id, name: source.name })) : []}
          allJobSources={jobSourceData.jobSources || []}
        />
      </div>
    </JobsProvider>
  );
};

export default Jobs;
