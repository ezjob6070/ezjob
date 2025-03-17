
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
import TechnicianFilter from "@/components/jobs/filters/TechnicianFilter";
import JobsDateFilter from "@/components/jobs/filters/JobsDateFilter";
import JobSourceFilter from "@/components/jobs/JobSourceFilter";
import AmountFilter from "@/components/jobs/AmountFilter";
import PaymentMethodFilter from "@/components/jobs/PaymentMethodFilter";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

  // Create filter components
  const dateFilterComponent = (
    <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
      <PopoverContent className="w-auto p-4" align="start">
        <JobsDateFilter date={date} setDate={setDate} />
      </PopoverContent>
    </Popover>
  );

  const technicianFilterComponent = (
    <Popover open={techPopoverOpen} onOpenChange={setTechPopoverOpen}>
      <PopoverContent className="w-auto p-4" align="start">
        <TechnicianFilter
          technicians={technicianNames}
          selectedNames={selectedTechnicians}
          onToggle={toggleTechnician}
          onSelectAll={selectAllTechnicians}
          onDeselectAll={deselectAllTechnicians}
        />
      </PopoverContent>
    </Popover>
  );

  const jobSourceFilterComponent = (
    <Popover open={sourcePopoverOpen} onOpenChange={setSourcePopoverOpen}>
      <PopoverContent className="w-auto p-4" align="start">
        <JobSourceFilter
          jobSourceNames={jobSourceNames}
          selectedJobSources={selectedJobSources}
          toggleJobSource={toggleJobSource}
          selectAllJobSources={selectAllJobSources}
          deselectAllJobSources={deselectAllJobSources}
        />
      </PopoverContent>
    </Popover>
  );

  const amountFilterComponent = (
    <Popover open={amountPopoverOpen} onOpenChange={setAmountPopoverOpen}>
      <PopoverContent className="w-auto p-4" align="start">
        <AmountFilter value={amountRange} onChange={setAmountRange} />
      </PopoverContent>
    </Popover>
  );

  const paymentMethodComponent = (
    <Popover open={paymentPopoverOpen} onOpenChange={setPaymentPopoverOpen}>
      <PopoverContent className="w-auto p-4" align="start">
        <PaymentMethodFilter value={paymentMethod} onChange={setPaymentMethod} />
      </PopoverContent>
    </Popover>
  );

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
          dateRangeComponent={dateFilterComponent}
          filtersComponent={technicianFilterComponent}
          amountFilterComponent={amountFilterComponent}
          paymentMethodComponent={paymentMethodComponent}
          jobSourceComponent={jobSourceFilterComponent}
          selectedJob={selectedJob}
          isStatusModalOpen={isStatusModalOpen}
          openStatusModal={openStatusModal}
          closeStatusModal={closeStatusModal}
          setDatePopoverOpen={setDatePopoverOpen}
          setTechPopoverOpen={setTechPopoverOpen}
          setSourcePopoverOpen={setSourcePopoverOpen}
          setAmountPopoverOpen={setAmountPopoverOpen}
          setPaymentPopoverOpen={setPaymentPopoverOpen}
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
