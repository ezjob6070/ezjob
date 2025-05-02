
import React from "react";
import JobsFilterBar from "./JobsFilterBar";
import JobsFilterPopovers from "./JobsFilterPopovers";
import JobTabs from "./JobTabs";
import { useJobsContext } from "./context/JobsContext";

const JobsContainer = ({ technicianNames, jobSourceNames }: { 
  technicianNames: string[];
  jobSourceNames: string[];
}) => {
  const {
    filteredJobs,
    searchTerm,
    setSearchTerm,
    handleCancelJob,
    handleCompleteJob,
    handleRescheduleJob,
    selectedJob,
    isStatusModalOpen,
    openStatusModal,
    closeStatusModal,
    setDatePopoverOpen,
    setTechPopoverOpen,
    setSourcePopoverOpen,
    setAmountPopoverOpen,
    setPaymentPopoverOpen
  } = useJobsContext();

  // Create a wrapper function to convert string to Date for the handleRescheduleJob
  const handleRescheduleJobWrapper = (jobId: string, newDateStr: string, isAllDay: boolean) => {
    // Convert the string to a Date object before passing it to handleRescheduleJob
    const newDate = new Date(newDateStr);
    handleRescheduleJob(jobId, newDate, isAllDay);
  };

  return (
    <div className="space-y-4">
      <JobsFilterBar />
      
      {/* Jobs Tabs and Table */}
      <JobsFilterPopovers 
        categories={["All Categories", "Plumbing", "Electrical", "HVAC", "Cleaning"]}
        selectedCategories={["All Categories"]}
        toggleCategory={() => {}}
        selectAllCategories={() => {}}
        deselectAllCategories={() => {}}
        serviceTypes={["All Services", "Installation", "Repair", "Maintenance"]}
        selectedServiceTypes={["All Services"]}
        toggleServiceType={() => {}}
        selectAllServiceTypes={() => {}}
        deselectAllServiceTypes={() => {}}
        jobSources={jobSourceNames}
        selectedSources={[]}
        toggleSource={() => {}}
        selectAllSources={() => {}}
        deselectAllSources={() => {}}
        date={undefined}
        setDate={() => {}}
      />
      
      <JobTabs 
        jobs={filteredJobs} 
        searchTerm={searchTerm}
        onCancelJob={handleCancelJob}
        onCompleteJob={handleCompleteJob}
        onRescheduleJob={handleRescheduleJobWrapper}
        onSearchChange={setSearchTerm}
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
  );
};

export default JobsContainer;
