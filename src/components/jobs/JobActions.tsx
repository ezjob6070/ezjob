
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Job } from "./JobTypes";

type JobActionsProps = {
  job: Job;
  onCancelJob: (jobId: string) => void;
};

const JobActions = ({ job, onCancelJob }: JobActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>View Details</DropdownMenuItem>
        <DropdownMenuItem>Edit Job</DropdownMenuItem>
        <DropdownMenuItem>Update Status</DropdownMenuItem>
        <DropdownMenuSeparator />
        {job.status !== "cancelled" && (
          <DropdownMenuItem 
            className="text-red-600" 
            onClick={() => onCancelJob(job.id)}
          >
            Cancel Job
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default JobActions;
