
import { useState } from "react";
import { Job, JobStatus } from "@/components/jobs/JobTypes";
import { toast } from "@/hooks/use-toast";

export const useJobActions = (setJobs: React.Dispatch<React.SetStateAction<Job[]>>) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const handleCancelJob = (jobId: string, cancellationReason?: string) => {
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === jobId ? { ...job, status: "cancelled", cancellationReason } : job
      )
    );
    toast({
      title: "Job cancelled",
      description: "The job has been marked as cancelled.",
    });
  };

  const handleCompleteJob = (jobId: string, actualAmount: number) => {
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === jobId ? { ...job, status: "completed", actualAmount } : job
      )
    );
    toast({
      title: "Job completed",
      description: "The job has been marked as completed.",
    });
  };

  const handleRescheduleJob = (jobId: string, newDate: Date, isAllDay: boolean) => {
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === jobId 
          ? { 
              ...job, 
              scheduledDate: newDate,
              date: newDate, // Update both date fields
              isAllDay: isAllDay, 
              status: "scheduled"
            } 
          : job
      )
    );
    toast({
      title: "Job rescheduled",
      description: `The job has been rescheduled to ${newDate.toLocaleDateString()}.`,
    });
  };

  const updateJobStatus = (jobId: string, status: JobStatus) => {
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === jobId ? { ...job, status } : job
      )
    );
    toast({
      title: "Job status updated",
      description: `The job has been marked as ${status.replace('_', ' ')}.`,
    });
  };

  const openStatusModal = (job: Job) => {
    setSelectedJob(job);
    setIsStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    setSelectedJob(null);
    setIsStatusModalOpen(false);
  };

  return {
    selectedJob,
    isStatusModalOpen,
    handleCancelJob,
    handleCompleteJob,
    handleRescheduleJob,
    updateJobStatus,
    openStatusModal,
    closeStatusModal
  };
};
