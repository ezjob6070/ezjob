
import { Button } from "@/components/ui/button";
import { FileText, MoreHorizontalIcon, PenLine, Send } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Job } from "./JobTypes";
import { useToast } from "@/components/ui/use-toast";
import { useCallback } from "react";

type JobActionsProps = {
  job: Job;
  onCancelJob: (jobId: string) => void;
  onUpdateStatus?: (job: Job) => void;
  onSendToEstimate?: (job: Job) => void;
};

const JobActions = ({ 
  job, 
  onCancelJob, 
  onUpdateStatus,
  onSendToEstimate
}: JobActionsProps) => {
  const { toast } = useToast();

  const handleSendToEstimate = useCallback(() => {
    if (onSendToEstimate) {
      onSendToEstimate(job);
      toast({
        title: "Job sent to estimate",
        description: `Job for ${job.clientName} has been sent to estimates.`,
      });
    } else {
      // Fallback if the handler isn't provided
      toast({
        title: "Feature in development",
        description: "Send to Estimate functionality is being implemented.",
      });
    }
  }, [job, onSendToEstimate, toast]);

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
        <DropdownMenuItem onClick={handleSendToEstimate}>
          <FileText className="h-4 w-4 mr-2" />
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
