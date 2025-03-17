
import { useState } from "react";
import { initialJobs } from "@/data/jobs";
import { initialTechnicians } from "@/data/technicians";
import { useJobsData } from "@/hooks/useJobsData";
import JobTabs from "@/components/jobs/JobTabs";
import JobStats from "@/components/jobs/JobStats";
import JobFiltersSection from "@/components/jobs/JobFiltersSection";
import JobFilterInfoBar from "@/components/jobs/JobFilterInfoBar";
import JobsPageHeader from "@/components/jobs/JobsPageHeader";
import JobHeader from "@/components/jobs/JobHeader";
import CreateJobModal from "@/components/jobs/CreateJobModal";
import { Job } from "@/components/jobs/JobTypes";
import { toast } from "@/hooks/use-toast";

// Mock job sources data - in a real app, this would come from an API or store
const JOB_SOURCES = [
  { id: "js1", name: "Website" },
  { id: "js2", name: "Referral" },
  { id: "js3", name: "Google" },
  { id: "js4", name: "Facebook" },
  { id: "js5", name: "HomeAdvisor" },
  { id: "js6", name: "Angi" },
];

const JOB_CATEGORIES = [
  "Plumbing",
  "HVAC",
  "Electrical", 
  "General Maintenance",
];

const Jobs = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const {
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
    selectedJob,
    isStatusModalOpen,
    toggleTechnician,
    toggleCategory,
    setDate,
    setAmountRange,
    setPaymentMethod,
    selectAllTechnicians,
    deselectAllTechnicians,
    clearFilters,
    applyFilters,
    handleCancelJob,
    handleCompleteJob,
    openStatusModal,
    closeStatusModal
  } = useJobsData(initialJobs);

  const [categories, setCategories] = useState<string[]>(JOB_CATEGORIES);
  const technicianNames = initialTechnicians.map(tech => tech.name);
  const technicianOptions = initialTechnicians.map(tech => ({ id: tech.id, name: tech.name }));

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

  const filterComponents = JobFiltersSection({
    technicianNames,
    selectedTechnicians,
    selectedCategories,
    date,
    amountRange,
    paymentMethod,
    categories,
    appliedFilters,
    toggleTechnician,
    toggleCategory,
    setDate,
    setAmountRange,
    setPaymentMethod,
    addCategory,
    selectAllTechnicians,
    deselectAllTechnicians,
    clearFilters,
    applyFilters
  });

  return (
    <div className="space-y-6 py-8">
      <JobHeader onCreateJob={() => setIsCreateModalOpen(true)} />

      <JobStats jobs={filteredJobs} date={date} />
      
      <JobFilterInfoBar 
        filteredCount={filteredJobs.length}
        totalCount={initialJobs.length}
        hasActiveFilters={Boolean(hasActiveFilters)}
        clearFilters={clearFilters}
      />
      
      <JobTabs 
        jobs={filteredJobs} 
        searchTerm={searchTerm}
        onCancelJob={handleCancelJob}
        onCompleteJob={handleCompleteJob}
        onSearchChange={setSearchTerm}
        filtersComponent={filterComponents.filtersComponent}
        dateRangeComponent={filterComponents.dateRangeComponent}
        amountFilterComponent={filterComponents.amountFilterComponent}
        paymentMethodComponent={filterComponents.paymentMethodComponent}
        selectedJob={selectedJob}
        isStatusModalOpen={isStatusModalOpen}
        openStatusModal={openStatusModal}
        closeStatusModal={closeStatusModal}
      />

      <CreateJobModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onAddJob={handleAddJob}
        technicians={technicianOptions}
        jobSources={JOB_SOURCES}
      />
    </div>
  );
};

export default Jobs;
