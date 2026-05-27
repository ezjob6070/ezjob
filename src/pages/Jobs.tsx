import { useState, useEffect } from "react";
import { useJobsData } from "@/hooks/useJobsData";
import { useJobSourceData } from "@/hooks/jobs/useJobSourceData";
import { JOB_CATEGORIES, SERVICE_TYPES } from "@/components/jobs/constants";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";
import JobStats from "@/components/jobs/JobStats";
import JobModals from "@/components/jobs/JobModals";
import { Job, AmountRange } from "@/components/jobs/JobTypes";
import { toast } from "@/hooks/use-toast";
import JobsHeader from "@/components/jobs/JobsHeader";
import JobsContainer from "@/components/jobs/JobsContainer";
import { JobsProvider } from "@/components/jobs/context/JobsContext";
import { DateRange } from "react-day-picker";
import { useNavigate } from "react-router-dom";
import { JobSource } from "@/types/jobSource";
import { Technician } from "@/types/technician";

const Jobs = () => {
  const navigate = useNavigate();
  const { jobs: globalJobs, technicians: globalTechnicians, jobSources: globalJobSources, addJob, completeJob, cancelJob } = useGlobalState();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>(JOB_CATEGORIES);
  const [serviceTypes, setServiceTypes] = useState<string[]>(SERVICE_TYPES);
  const [localJobs, setLocalJobs] = useState<Job[]>([]);
  
  // Sync with global jobs
  useEffect(() => {
    // Ensure all jobs have the required date field
    const completeJobs: Job[] = globalJobs.map(job => ({
      ...job,
      date: job.date || job.scheduledDate || new Date().toISOString(),
      status: job.status === "canceled" ? "cancelled" as const : job.status as any // Fix "canceled" -> "cancelled"
    }));
    setLocalJobs(completeJobs);
  }, [globalJobs]);
  
  // Control state for filter popovers
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [techPopoverOpen, setTechPopoverOpen] = useState(false);
  const [contractorPopoverOpen, setContractorPopoverOpen] = useState(false);
  const [sourcePopoverOpen, setSourcePopoverOpen] = useState(false);
  const [amountPopoverOpen, setAmountPopoverOpen] = useState(false);
  const [paymentPopoverOpen, setPaymentPopoverOpen] = useState(false);

  // Get job source related data and functions
  const jobSourceData = useJobSourceData();
  
  // Map job source names from global state
  const jobSourceNames = globalJobSources.map(source => source.name);
  
  // Extract contractors from technicians
  const contractorTechnicians = globalTechnicians.filter(tech => tech.role === "contractor");
  const contractorNames = contractorTechnicians.map(tech => tech.name);
  
  // Get jobs data and filter functionality
  const {
    filteredJobs,
    searchTerm,
    setSearchTerm,
    selectedTechnicians,
    selectedContractors,
    selectedJobSources,
    selectedServiceTypes,
    date,
    amountRange,
    paymentMethod,
    appliedFilters,
    hasActiveFilters,
    selectedJob,
    isStatusModalOpen,
    toggleTechnician,
    toggleContractor,
    toggleJobSource,
    toggleServiceType,
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
    sortBy,
    setSortBy
  } = useJobsData(localJobs, jobSourceNames);

  // Set up technician data
  const technicianNames = globalTechnicians.map(tech => tech.name);
  const technicianOptions = globalTechnicians.map(tech => ({ id: tech.id, name: tech.name }));
  
  // Set up contractor data
  const contractorOptions = contractorTechnicians.map(tech => ({ id: tech.id, name: tech.name }));

  // Handler functions
  const addCategory = (category: string) => {
    setCategories(prev => [...prev, category]);
  };

  const addServiceType = (serviceType: string) => {
    setServiceTypes(prev => [...prev, serviceType]);
  };

  const handleAddJob = (job: Job) => {
    addJob(job);
    setIsCreateModalOpen(false); // Close modal after adding
    
    toast({
      title: "Job Created",
      description: `New job for ${job.clientName} has been added successfully.`,
    });
  };

  const handleCancelJob = (jobId: string, reason?: string) => {
    cancelJob(jobId);
    
    setLocalJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === jobId 
          ? { ...job, status: "cancelled" as const, cancellationReason: reason || "No reason provided" }
          : job
      )
    );
  };

  const handleCompleteJob = (jobId: string) => {
    completeJob(jobId);
    
    setLocalJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === jobId 
          ? { ...job, status: "completed" as const }
          : job
      )
    );
  };
  
  // Handle job rescheduling locally
  const handleLocalRescheduleJob = (jobId: string, newDate: Date, isAllDay: boolean) => {
    // Call the handleRescheduleJob function from useJobsData
    handleRescheduleJob(jobId, newDate);
    
    // Update local jobs state
    setLocalJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === jobId 
          ? { 
              ...job, 
              date: newDate, 
              scheduledDate: newDate,
              isAllDay: isAllDay, 
              status: "scheduled" as const
            }
          : job
      )
    );
  };

  // Handle sending job to estimate
  const handleSendToEstimate = (job: Job) => {
    // In a real app, you would convert the job to an estimate and save it
    console.log("Job sent to estimate:", job);
    
    toast({
      title: "Job Converted to Estimate",
      description: `Job for ${job.clientName} has been sent to estimates.`,
    });
    
    // Navigate to estimates page
    setTimeout(() => {
      navigate("/estimates");
    }, 1500);
  };
  
  // Create DateRange object from string date if needed
  const getDateRangeFromString = (dateStr: string | null): DateRange | undefined => {
    if (!dateStr) return undefined;
    try {
      const parsedDate = new Date(dateStr);
      if (isNaN(parsedDate.getTime())) {
        console.error("Invalid date string:", dateStr);
        return undefined;
      }
      return {
        from: parsedDate,
        to: parsedDate
      };
    } catch (error) {
      console.error("Error parsing date:", error);
      return undefined;
    }
  };
  
  // Convert date from string to DateRange if needed
  const dateRangeValue = typeof date === 'string' ? getDateRangeFromString(date) : date;

  // Fixed setDate wrapper function to ensure correct type
  const handleSetDate = (newDate: DateRange | undefined) => {
    if (setDate && typeof setDate === 'function') {
      setDate(newDate);
    }
  };
  
  // Create context value
  const contextValue = {
    // Modals state
    isCreateModalOpen,
    setIsCreateModalOpen,
    
    // Filter popovers state
    datePopoverOpen, setDatePopoverOpen,
    techPopoverOpen, setTechPopoverOpen,
    contractorPopoverOpen, setContractorPopoverOpen,
    sourcePopoverOpen, setSourcePopoverOpen,
    amountPopoverOpen, setAmountPopoverOpen,
    paymentPopoverOpen, setPaymentPopoverOpen,
    
    // Jobs data 
    jobs: localJobs,
    filteredJobs,
    searchTerm,
    setSearchTerm,
    
    // Filters
    selectedTechnicians,
    selectedContractors,
    selectedJobSources,
    selectedServiceTypes,
    date: dateRangeValue, // Use the properly typed date value
    amountRange: amountRange as AmountRange | null,
    paymentMethod,
    hasActiveFilters,
    
    // Sort options
    sortBy,
    setSortBy,
    
    // Filter operations
    toggleTechnician,
    toggleContractor,
    toggleJobSource,
    toggleServiceType,
    setDate: handleSetDate, // Use the wrapper function
    setAmountRange,
    setPaymentMethod,
    selectAllTechnicians,
    deselectAllTechnicians,
    selectAllContractors,
    deselectAllContractors,
    selectAllJobSources,
    deselectAllJobSources,
    clearFilters,
    
    // Job operations
    handleAddJob,
    handleCancelJob,
    handleCompleteJob,
    handleRescheduleJob: handleLocalRescheduleJob,
    handleSendToEstimate,
    
    // Job status modal
    selectedJob,
    isStatusModalOpen,
    openStatusModal,
    closeStatusModal,
    
    // Job source operations
    toggleJobSourceSidebar: jobSourceData.toggleJobSourceSidebar
  };

  // Transform job sources for the JobModals component
  const jobSourcesForModal: JobSource[] = globalJobSources.map(source => ({
    id: source.id,
    name: source.name,
    type: source.type || "general",
    paymentType: (source.paymentType as "fixed" | "percentage") || "percentage",
    paymentValue: source.paymentValue || 0, 
    isActive: source.isActive !== false,
    profit: source.profit || 0,
    createdAt: typeof source.createdAt === 'string' ? source.createdAt : new Date().toISOString(),
    totalJobs: source.totalJobs || 0,
    totalRevenue: source.totalRevenue || 0,
    website: source.website || '',
    phone: source.phone || '',
    email: source.email || '',
    logoUrl: source.logoUrl || '',
    notes: source.notes || ''
  }));

  return (
    <JobsProvider value={contextValue}>
      <div className="space-y-6 py-8">
        {/* Header Section */}
        <JobsHeader />

        {/* Job Stats Cards */}
        <JobStats jobs={filteredJobs} />
        
        {/* Jobs Container (Filter and Table) */}
        <JobsContainer 
          technicianNames={technicianNames}
          jobSourceNames={jobSourceNames}
          contractorNames={contractorNames}
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
          contractors={contractorOptions}
          jobSources={jobSourceNames.map((name, index) => ({ id: `source-${index}`, name }))}
          allJobSources={jobSourcesForModal}
        />
      </div>
    </JobsProvider>
  );
};

export default Jobs;
