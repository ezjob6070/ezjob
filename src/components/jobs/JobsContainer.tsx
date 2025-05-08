
import React from "react";
import JobsFilterBar from "./JobsFilterBar";
import JobsFilterPopovers from "./JobsFilterPopovers";
import JobTabs from "./JobTabs";
import { useJobsContext } from "./context/JobsContext";

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
    setDatePopoverOpen,
    setTechPopoverOpen,
    setContractorPopoverOpen,
    setSourcePopoverOpen,
    setAmountPopoverOpen,
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

  return (
    <div className="space-y-4">
      <JobsFilterBar />
      
      {/* Jobs Tabs and Table */}
      <JobsFilterPopovers 
        categories={[]}
        selectedCategories={[]}
        toggleCategory={() => {}}
        selectAllCategories={() => {}}
        deselectAllCategories={() => {}}
        serviceTypes={["All Services", "Installation", "Repair", "Maintenance"]}
        selectedServiceTypes={selectedServiceTypes}
        toggleServiceType={toggleServiceType}
        selectAllServiceTypes={selectAllServiceTypes}
        deselectAllServiceTypes={deselectAllServiceTypes}
        jobSources={jobSourceNames}
        selectedSources={selectedJobSources}
        toggleSource={toggleJobSource}
        selectAllSources={selectAllJobSources}
        deselectAllSources={deselectAllJobSources}
        contractorNames={contractorNames}
        selectedContractors={selectedContractors}
        toggleContractor={toggleContractor}
        selectAllContractors={selectAllContractors}
        deselectAllContractors={deselectAllContractors}
        date={date}
        setDate={setDate}
      />
      
      <JobTabs 
        jobs={filteredJobs} 
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
