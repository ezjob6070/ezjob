import { useState } from "react";
import { initialJobs } from "@/data/jobs";
import { initialTechnicians } from "@/data/technicians";
import { useJobsData, useJobSources } from "@/hooks/useJobsData";
import JobTabs from "@/components/jobs/JobTabs";
import JobStats from "@/components/jobs/JobStats";
import JobFiltersSection from "@/components/jobs/JobFiltersSection";
import JobFilterInfoBar from "@/components/jobs/JobFilterInfoBar";
import JobsPageHeader from "@/components/jobs/JobsPageHeader";
import JobHeader from "@/components/jobs/JobHeader";
import CreateJobModal from "@/components/jobs/CreateJobModal";
import JobSourceSidebar from "@/components/jobs/JobSourceSidebar";
import { Job } from "@/components/jobs/JobTypes";
import { toast } from "@/hooks/use-toast";
import { JobSource } from "@/types/jobSource";
import { FolderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const SAMPLE_JOB_SOURCES: JobSource[] = [
  { 
    id: "js1", 
    name: "Website", 
    isActive: true, 
    paymentType: "percentage", 
    paymentValue: 10, 
    totalJobs: 120, 
    totalRevenue: 55000, 
    profit: 23000,
    createdAt: new Date(),
    email: "website@example.com",
    phone: "(555) 123-4567",
    notes: "Our company website leads"
  },
  { 
    id: "js2", 
    name: "Referral", 
    isActive: true, 
    paymentType: "fixed", 
    paymentValue: 50, 
    totalJobs: 80, 
    totalRevenue: 40000, 
    profit: 18000,
    createdAt: new Date(),
    notes: "Customer referrals program"
  },
  { 
    id: "js3", 
    name: "Google", 
    isActive: true, 
    paymentType: "percentage", 
    paymentValue: 15, 
    totalJobs: 150, 
    totalRevenue: 70000,
    profit: 30000,
    createdAt: new Date(),
    website: "https://google.com",
    email: "adsales@google.com",
    phone: "(555) 987-6543"
  },
  { 
    id: "js4", 
    name: "Facebook", 
    isActive: false, 
    paymentType: "fixed", 
    paymentValue: 75, 
    totalJobs: 65, 
    totalRevenue: 32000, 
    profit: 12000,
    createdAt: new Date(),
    website: "https://facebook.com",
    email: "marketing@facebook.com"
  },
  { 
    id: "js5", 
    name: "HomeAdvisor", 
    isActive: true, 
    paymentType: "percentage", 
    paymentValue: 20, 
    totalJobs: 95, 
    totalRevenue: 48000, 
    profit: 22000,
    createdAt: new Date(),
    website: "https://homeadvisor.com",
    phone: "(555) 765-4321",
    notes: "Contractor platform for service leads"
  },
  { 
    id: "js6", 
    name: "Angi", 
    isActive: true, 
    paymentType: "fixed", 
    paymentValue: 100, 
    totalJobs: 45, 
    totalRevenue: 25000, 
    profit: 10000,
    createdAt: new Date(),
    website: "https://angi.com",
    email: "partners@angi.com",
    phone: "(555) 234-5678",
    notes: "Home services marketplace"
  },
];

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
  const [isJobSourceSidebarOpen, setIsJobSourceSidebarOpen] = useState(false);
  const [isCreateJobSourceModalOpen, setIsCreateJobSourceModalOpen] = useState(false);
  const [selectedJobSourceForEdit, setSelectedJobSourceForEdit] = useState<JobSource | null>(null);
  const [jobSources, setJobSources] = useState<JobSource[]>(SAMPLE_JOB_SOURCES);
  
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

  const [categories, setCategories] = useState<string[]>(JOB_CATEGORIES);
  const technicianNames = initialTechnicians.map(tech => tech.name);
  const technicianOptions = initialTechnicians.map(tech => ({ id: tech.id, name: tech.name }));
  const jobSourceNames = JOB_SOURCES.map(source => source.name);

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

  const handleAddJobSource = () => {
    setIsCreateJobSourceModalOpen(true);
  };

  const handleEditJobSource = (jobSource: JobSource) => {
    setSelectedJobSourceForEdit(jobSource);
    setIsCreateJobSourceModalOpen(true);
  };

  const toggleJobSourceSidebar = () => {
    setIsJobSourceSidebarOpen(!isJobSourceSidebarOpen);
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
    applyFilters,
    jobSourceNames,
    selectedJobSources,
    toggleJobSource,
    selectAllJobSources,
    deselectAllJobSources
  });

  return (
    <div className="space-y-6 py-8">
      <JobHeader 
        onCreateJob={() => setIsCreateModalOpen(true)} 
        extraActions={
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleJobSourceSidebar}
            className="flex items-center gap-2"
          >
            <FolderIcon className="h-4 w-4" />
            Job Sources
          </Button>
        }
      />

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
        onRescheduleJob={handleRescheduleJob}
        onSearchChange={setSearchTerm}
        filtersComponent={filterComponents.filtersComponent}
        dateRangeComponent={filterComponents.dateRangeComponent}
        amountFilterComponent={filterComponents.amountFilterComponent}
        paymentMethodComponent={filterComponents.paymentMethodComponent}
        jobSourceComponent={filterComponents.jobSourceComponent}
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

      <JobSourceSidebar 
        jobSources={jobSources}
        isOpen={isJobSourceSidebarOpen}
        onClose={() => setIsJobSourceSidebarOpen(false)}
        onAddJobSource={handleAddJobSource}
        onEditJobSource={handleEditJobSource}
      />
    </div>
  );
};

export default Jobs;
