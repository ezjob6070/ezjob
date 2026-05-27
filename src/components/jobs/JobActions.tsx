import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  CheckCircle2,
  CalendarClock,
  XCircle,
  ClipboardList,
  RotateCcw,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Job } from "./JobTypes";

export type StatusAction =
  | "completed"
  | "cancelled"
  | "reschedule"
  | "estimate"
  | "in_progress"
  | "scheduled";

type JobActionsProps = {
  job: Job;
  onUpdateStatus: (job: Job, initialStatus?: StatusAction) => void;
  onSendToEstimate?: (job: Job) => void;
};

const JobActions = ({ job, onUpdateStatus, onSendToEstimate }: JobActionsProps) => {
  const isCompleted = job.status === "completed";
  const isCancelled = job.status === "cancelled";
  const isActive = !isCompleted && !isCancelled;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => onUpdateStatus(job)}>
          <Eye className="h-4 w-4 mr-2" />
          View / Update
        </DropdownMenuItem>

        {isActive && (
          <>
            <DropdownMenuItem
              className="text-emerald-600 focus:text-emerald-700"
              onClick={() => onUpdateStatus(job, "completed")}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark Complete
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdateStatus(job, "reschedule")}>
              <CalendarClock className="h-4 w-4 mr-2" />
              Reschedule
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                onSendToEstimate ? onSendToEstimate(job) : onUpdateStatus(job, "estimate")
              }
            >
              <ClipboardList className="h-4 w-4 mr-2" />
              Send to Estimate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-700"
              onClick={() => onUpdateStatus(job, "cancelled")}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel Job
            </DropdownMenuItem>
          </>
        )}

        {isCompleted && (
          <>
            <DropdownMenuItem onClick={() => onUpdateStatus(job, "completed")}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Edit Amount
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-blue-600 focus:text-blue-700"
              onClick={() => onUpdateStatus(job, "in_progress")}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reopen Job
            </DropdownMenuItem>
          </>
        )}

        {isCancelled && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-blue-600 focus:text-blue-700"
              onClick={() => onUpdateStatus(job, "scheduled")}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reopen Job
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default JobActions;
