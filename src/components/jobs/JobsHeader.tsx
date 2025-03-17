
import React from "react";
import JobHeaderActions from "@/components/jobs/JobHeaderActions";
import { useJobsContext } from "./context/JobsContext";

const JobsHeader = () => {
  const { setIsCreateModalOpen, toggleJobSourceSidebar } = useJobsContext();

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Jobs Management</h1>
        <JobHeaderActions 
          onCreateJob={() => setIsCreateModalOpen(true)}
          toggleJobSourceSidebar={toggleJobSourceSidebar}
        />
      </div>
      <p className="text-muted-foreground">Create, schedule, and manage jobs and technicians</p>
    </>
  );
};

export default JobsHeader;
