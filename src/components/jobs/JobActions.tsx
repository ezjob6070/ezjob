
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon, PenLine, ClipboardList } from "lucide-react";
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
  onUpdateStatus?: (job: Job) => void;
  onSendToEstimate?: (job: Job) => void;
};

const JobActions = ({ job, onCancelJob, onUpdateStatus, onSendToEstimate }: JobActionsProps) => {
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
        <DropdownMenuItem onClick={() => onUpdateStatus && onUpdateStatus(job)}>
          <PenLine className="h-4 w-4 mr-2" />
          Update Status
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSendToEstimate && onSendToEstimate(job)}>
          <ClipboardList className="h-4 w-4 mr-2" />
          Send to Estimate
        </DropdownMenuItem>
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
