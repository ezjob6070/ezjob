
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

interface JobHeaderActionsProps {
  onCreateJob: () => void;
  toggleJobSourceSidebar: () => void;
}

const JobHeaderActions: React.FC<JobHeaderActionsProps> = ({ 
  onCreateJob, 
  toggleJobSourceSidebar 
}) => {
  return (
    <div className="flex justify-between items-center w-full">
      <h1 className="text-2xl font-bold tracking-tight">Jobs Management</h1>
      <Button 
        onClick={onCreateJob} 
        variant="default" 
        className="bg-blue-500 hover:bg-blue-600"
      >
        <PlusIcon className="h-4 w-4 mr-2" />
        New Job
      </Button>
    </div>
  );
};

export default JobHeaderActions;
