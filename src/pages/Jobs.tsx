
import { useState } from "react";
import { initialJobs } from "@/data/jobs";
import { initialTechnicians } from "@/data/technicians";
import { useJobsData } from "@/hooks/useJobsData";
import { useJobSourceData, JOB_SOURCES } from "@/hooks/jobs/useJobSourceData";
import { JOB_CATEGORIES } from "@/components/jobs/constants";
import JobStats from "@/components/jobs/JobStats";
import JobTabs from "@/components/jobs/JobTabs";
import JobFiltersWrapper from "@/components/jobs/JobFiltersWrapper";
import JobHeaderActions from "@/components/jobs/JobHeaderActions";
import JobModals from "@/components/jobs/JobModals";
import { Job } from "@/components/jobs/JobTypes";
import { toast } from "@/hooks/use-toast";

const Jobs = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>(JOB_CATEGORIES);

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
  } = useJobsData(initialJobs, JOB_SOURCES.map(source => source.name));

  // Set up technician data
  const technicianNames = initialTechnicians.map(tech => tech.name);
  const technicianOptions = initialTechnicians.map(tech => ({ id: tech.id, name: tech.name }));
  const jobSourceNames = JOB_SOURCES.map(source => source.name);

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

  return (
    <div className="space-y-6 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Jobs Management</h1>
        <JobHeaderActions 
          onCreateJob={() => setIsCreateModalOpen(true)}
          toggleJobSourceSidebar={jobSourceData.toggleJobSourceSidebar}
        />
      </div>
      <p className="text-muted-foreground">Create, schedule, and manage jobs and technicians</p>

      {/* Job Stats Cards */}
      <JobStats jobs={filteredJobs} date={date} />
      
      {/* Filters and Jobs Table Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </p>
          {hasActiveFilters && (
            <button 
              onClick={clearFilters} 
              className="text-sm text-blue-500 hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Jobs Tabs and Table */}
        <JobTabs 
          jobs={filteredJobs} 
          searchTerm={searchTerm}
          onCancelJob={handleCancelJob}
          onCompleteJob={handleCompleteJob}
          onRescheduleJob={handleRescheduleJob}
          onSearchChange={setSearchTerm}
          dateRangeComponent={null}
          filtersComponent={null}
          amountFilterComponent={null}
          paymentMethodComponent={null}
          jobSourceComponent={null}
          selectedJob={selectedJob}
          isStatusModalOpen={isStatusModalOpen}
          openStatusModal={openStatusModal}
          closeStatusModal={closeStatusModal}
        />
      </div>

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
        jobSources={JOB_SOURCES}
        allJobSources={jobSourceData.jobSources}
      />
    </div>
  );
};

export default Jobs;
