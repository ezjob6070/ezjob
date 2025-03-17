
import React from 'react';
import { Button } from "@/components/ui/button";
import { FolderIcon } from "lucide-react";
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
  );
};

export default JobHeaderActions;
