
import React from 'react';
import { Button } from "@/components/ui/button";
import JobHeader from "./JobHeader";

interface JobHeaderActionsProps {
  onCreateJob: () => void;
  toggleJobSourceSidebar: () => void;
}

const JobHeaderActions: React.FC<JobHeaderActionsProps> = ({ 
  onCreateJob, 
  toggleJobSourceSidebar 
}) => {
  return (
    <JobHeader 
      onCreateJob={onCreateJob} 
      extraActions={null}
    />
  );
};

export default JobHeaderActions;
