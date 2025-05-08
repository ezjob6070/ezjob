
import React from "react";
import { useJobsContext } from "./context/JobsContext";

const JobsFilterBar = () => {
  const { filteredJobs, jobs, hasActiveFilters, clearFilters } = useJobsContext();

  return (
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
  );
};

export default JobsFilterBar;
