
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface JobHeaderProps {
  onCreateJob: () => void;
  extraActions?: ReactNode;
}

const JobHeader = ({ onCreateJob, extraActions }: JobHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold tracking-tight">Jobs Management</h1>
      <div className="flex gap-2">
        {extraActions}
        <Button onClick={onCreateJob} variant="default" className="bg-blue-500 hover:bg-blue-600">
          <PlusIcon className="h-4 w-4 mr-2" />
          New Job
        </Button>
      </div>
    </div>
  );
};

export default JobHeader;
