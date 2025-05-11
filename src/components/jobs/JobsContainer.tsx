
import React from "react";
import JobsFilterBar from "./JobsFilterBar";
import JobsFilterPopovers from "./JobsFilterPopovers";
import JobTabs from "./JobTabs";
import { useJobsContext } from "./context/JobsContext";
import { Job } from "./JobTypes"; // Ensure we're using the local Job type

const JobsContainer = ({ 
  technicianNames, 
  jobSourceNames,
  contractorNames
}: { 
  technicianNames: string[];
  jobSourceNames: string[];
  contractorNames: string[];
}) => {
  const {
    filteredJobs,
    searchTerm,
    setSearchTerm,
    handleCancelJob,
    handleCompleteJob,
    handleRescheduleJob,
    handleSendToEstimate,
    selectedJob,
    isStatusModalOpen,
    openStatusModal,
    closeStatusModal,
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
    setPaymentPopoverOpen,
    // Additional properties needed for JobsFilterPopovers
    date,
    setDate,
    selectedServiceTypes,
    toggleServiceType,
    selectAllServiceTypes,
    deselectAllServiceTypes,
    selectedJobSources,
    toggleJobSource,
    selectAllJobSources,
    deselectAllJobSources,
    selectedContractors,
    toggleContractor,
    selectAllContractors,
    deselectAllContractors,
    selectedTechnicians,
    toggleTechnician,
    selectAllTechnicians,
    deselectAllTechnicians
  } = useJobsContext();

  // Create a wrapper function to properly handle Date objects for handleRescheduleJob
  const handleRescheduleJobWrapper = (jobId: string, newDate: Date, isAllDay: boolean) => {
    // Directly pass the Date object to handleRescheduleJob
    handleRescheduleJob(jobId, newDate, isAllDay);
  };

  // Convert jobs to ensure type compatibility if needed
  const convertedJobs = filteredJobs as Job[]; // Since we're now using the local Job type

  return (
    <div className="space-y-4">
      <JobsFilterBar />
      
      {/* Jobs Tabs and Table */}
      <JobTabs 
        jobs={convertedJobs}
        searchTerm={searchTerm}
        onCancelJob={handleCancelJob}
        onCompleteJob={handleCompleteJob}
        onRescheduleJob={handleRescheduleJobWrapper}
        onSendToEstimate={handleSendToEstimate}
        onSearchChange={setSearchTerm}
        selectedJob={selectedJob}
        isStatusModalOpen={isStatusModalOpen}
        openStatusModal={openStatusModal}
        closeStatusModal={closeStatusModal}
        setDatePopoverOpen={setDatePopoverOpen}
        setTechPopoverOpen={setTechPopoverOpen}
        setContractorPopoverOpen={setContractorPopoverOpen}
        setSourcePopoverOpen={setSourcePopoverOpen}
        setAmountPopoverOpen={setAmountPopoverOpen}
        setPaymentPopoverOpen={setPaymentPopoverOpen}
      />
    </div>
  );
};

export default JobsContainer;
