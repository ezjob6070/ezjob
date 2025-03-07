
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

interface JobHeaderProps {
  onCreateJob: () => void;
}

const JobHeader = ({ onCreateJob }: JobHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold leading-tight tracking-tighter">
          Jobs Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Create, schedule, and manage jobs and technicians
        </p>
      </div>
      <Button 
        onClick={onCreateJob}
        className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-900"
      >
        <PlusIcon className="mr-2 h-4 w-4" /> Create Job
      </Button>
    </div>
  );
};

export default JobHeader;
