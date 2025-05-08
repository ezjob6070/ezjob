
import React from "react";
import JobsTable from "./JobsTable";
import JobFilterBar from "./JobFilterBar";
import { useJobsContext } from "./context/JobsContext";
import { Job } from "./JobTypes";

interface JobsContainerProps {
  technicianNames: string[];
  jobSourceNames: string[];
  onSendToEstimate?: (job: Job) => void;
}

const JobsContainer: React.FC<JobsContainerProps> = ({ 
  technicianNames, 
  jobSourceNames,
  onSendToEstimate
}) => {
  const {
    filteredJobs,
    searchTerm,
    setSearchTerm,
    openStatusModal,
  } = useJobsContext();

  return (
    <div className="space-y-4">
      <JobFilterBar
        technicianNames={technicianNames}
        jobSourceNames={jobSourceNames}
      />
      
      <JobsTable 
        jobs={filteredJobs} 
        searchTerm={searchTerm}
        onOpenStatusModal={openStatusModal} 
        onSendToEstimate={onSendToEstimate}
      />
    </div>
  );
};

export default JobsContainer;
