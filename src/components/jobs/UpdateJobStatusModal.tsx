
import React, { useState, useEffect } from "react";
import { Job, JobStatus } from "./JobTypes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import JobDetailsSection from "./modal/JobDetailsSection";
import StatusSelection from "./modal/StatusSelection";
import CompletionForm from "./modal/CompletionForm";
import CancellationForm from "./modal/CancellationForm";
import RescheduleForm from "./modal/RescheduleForm";

interface UpdateJobStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
  onCancel: (jobId: string, cancellationReason?: string) => void;
  onComplete: (jobId: string, actualAmount: number) => void;
  onReschedule?: (jobId: string, newDate: Date, isAllDay: boolean) => void;
  onSendToEstimate?: (job: Job) => void;
}

// Define the possible status types to match the state
type JobStatusType = "completed" | "cancelled" | "reschedule" | "in_progress" | "scheduled" | "estimate";

const UpdateJobStatusModal: React.FC<UpdateJobStatusModalProps> = ({
  open,
  onOpenChange,
  job,
  onCancel,
  onComplete,
  onReschedule,
  onSendToEstimate,
}) => {
  const [status, setStatus] = useState<JobStatusType>("completed");
  const [actualAmount, setActualAmount] = useState<number>(job?.amount || 0);
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>(
    job?.scheduledDate ? new Date(job.scheduledDate as string) : new Date()
  );
  const [timeSelection, setTimeSelection] = useState<"preset" | "custom" | "allDay">("preset");
  const [presetTime, setPresetTime] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("10:00");
  const [parts, setParts] = useState<string>("");
  const [cancellationReason, setCancellationReason] = useState<string>("");
  
  useEffect(() => {
    // Set initial status based on current job status
    if (job) {
      // Convert potential "canceled" to "cancelled" to match our type
      const normalizedStatus = job.status === "canceled" ? "cancelled" : 
                             job.status === "in_progress" ? "completed" : 
                             job.status === "rescheduled" ? "reschedule" : 
                             (job.status as JobStatusType);

      setStatus(normalizedStatus);
      setActualAmount(job.amount || 0);
      setParts(job.parts ? job.parts.join(", ") : "");
      setCancellationReason(job.cancellationReason || "");
      setRescheduleDate(job.scheduledDate ? new Date(job.scheduledDate as string) : new Date());
    }
  }, [job]);
  
  if (!job) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (status === "completed") {
      onComplete(job.id, actualAmount);
    } else if (status === "cancelled") {
      onCancel(job.id, cancellationReason);
    } else if (status === "reschedule" && rescheduleDate && onReschedule) {
      // Create date with time if not all day
      let scheduledDate = new Date(rescheduleDate);
      const isAllDay = timeSelection === "allDay";
      
      if (!isAllDay) {
        let timeString = "";
        
        if (timeSelection === "preset" && presetTime) {
          timeString = presetTime;
        } else if (timeSelection === "custom" && startTime) {
          timeString = startTime;
        }
        
        if (timeString) {
          const isPM = timeString.includes("PM");
          let hours = parseInt(timeString.split(":")[0]);
          const minutes = parseInt(timeString.split(":")[1]?.split(" ")[0] || "0");
          
          // Convert 12-hour format to 24-hour if needed
          if (isPM && hours !== 12) hours += 12;
          if (!isPM && hours === 12) hours = 0;
          
          scheduledDate.setHours(hours, minutes, 0, 0);
        } else {
          // Default to 9 AM if no time is specified
          scheduledDate.setHours(9, 0, 0, 0);
        }
      } else {
        // For all-day events, set to start of day
        scheduledDate.setHours(0, 0, 0, 0);
      }
      
      onReschedule(job.id, scheduledDate, isAllDay);
    } else if (status === "estimate" && onSendToEstimate) {
      // Handle sending job to estimate
      onSendToEstimate(job);
    }
    
    // Close the modal after action is taken
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Update Job Status</DialogTitle>
            <DialogDescription>
              Mark this job as completed, cancelled, reschedule it, or convert to estimate.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <JobDetailsSection job={job} />

            <StatusSelection 
              status={status} 
              onStatusChange={(value) => setStatus(value as JobStatusType)}
              job={job}
            />

            {status === "completed" && (
              <CompletionForm
                actualAmount={actualAmount}
                setActualAmount={setActualAmount}
                parts={parts}
                setParts={setParts}
              />
            )}

            {status === "cancelled" && (
              <CancellationForm
                cancellationReason={cancellationReason}
                setCancellationReason={setCancellationReason}
              />
            )}

            {status === "reschedule" && (
              <RescheduleForm
                rescheduleDate={rescheduleDate}
                setRescheduleDate={setRescheduleDate}
                timeSelection={timeSelection}
                setTimeSelection={setTimeSelection}
                presetTime={presetTime}
                setPresetTime={setPresetTime}
                startTime={startTime}
                setStartTime={setStartTime}
                endTime={endTime}
                setEndTime={setEndTime}
              />
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Status</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateJobStatusModal;
