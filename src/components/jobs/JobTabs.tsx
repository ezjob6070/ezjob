
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobsTable from "./JobsTable";
import { Job } from "./JobTypes";
import CancelJobDialog from "./CancelJobDialog";
import UpdateJobStatusModal from "./UpdateJobStatusModal";

interface JobTabsProps {
  jobs: Job[];
  searchTerm: string;
  onCancelJob: (jobId: string, cancellationReason?: string) => void;
  onCompleteJob: (jobId: string, actualAmount?: number) => void;
  onRescheduleJob: (jobId: string, newDate: Date, isAllDay: boolean) => void;
  onSendToEstimate: (job: Job) => void;
  onSearchChange: (term: string) => void;
  selectedJob: Job | null;
  isStatusModalOpen: boolean;
  openStatusModal: (job: Job) => void;
  closeStatusModal: () => void;
  setDatePopoverOpen: (open: boolean) => void;
  setTechPopoverOpen: (open: boolean) => void;
  setSourcePopoverOpen: (open: boolean) => void;
  setAmountPopoverOpen: (open: boolean) => void;
  setPaymentPopoverOpen: (open: boolean) => void;
  setContractorPopoverOpen: (open: boolean) => void;
}

const JobTabs: React.FC<JobTabsProps> = ({
  jobs,
  searchTerm,
  onCancelJob,
  onCompleteJob,
  onRescheduleJob,
  onSendToEstimate,
  onSearchChange,
  selectedJob,
  isStatusModalOpen,
  openStatusModal,
  closeStatusModal,
  setDatePopoverOpen,
  setTechPopoverOpen,
  setSourcePopoverOpen,
  setAmountPopoverOpen,
  setPaymentPopoverOpen,
  setContractorPopoverOpen
}) => {
  const [activeTab, setActiveTab] = useState("all");
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [jobToCancel, setJobToCancel] = useState<Job | null>(null);

  const handleCancelJob = (job: Job) => {
    setJobToCancel(job);
    setIsCancelDialogOpen(true);
  };

  const confirmCancelJob = (cancellationReason?: string) => {
    if (jobToCancel) {
      onCancelJob(jobToCancel.id, cancellationReason);
      setIsCancelDialogOpen(false);
      setJobToCancel(null);
    }
  };

  // Filter jobs based on tab
  const getFilteredJobs = (tab: string) => {
    if (tab === "all") return jobs;
    if (tab === "scheduled") return jobs.filter(job => job.status === "scheduled");
    if (tab === "completed") return jobs.filter(job => job.status === "completed");
    if (tab === "cancelled") return jobs.filter(job => job.status === "cancelled");
    if (tab === "estimates") return jobs.filter(job => job.status === "estimate");
    return jobs;
  };

  // Count jobs by status
  const scheduledCount = jobs.filter(job => job.status === "scheduled").length;
  const completedCount = jobs.filter(job => job.status === "completed").length;
  const cancelledCount = jobs.filter(job => job.status === "cancelled").length;
  const estimatesCount = jobs.filter(job => job.status === "estimate").length;

  return (
    <div className="bg-white border rounded-md shadow-sm">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b p-3">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="all">All Jobs ({jobs.length})</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled ({scheduledCount})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedCount})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({cancelledCount})</TabsTrigger>
            <TabsTrigger value="estimates">Estimates ({estimatesCount})</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="p-2">
          <JobsTable
            jobs={getFilteredJobs("all")}
            searchTerm={searchTerm}
            onCancel={handleCancelJob}
            onComplete={onCompleteJob}
            onReschedule={onRescheduleJob}
            onSendToEstimate={onSendToEstimate}
            onSearchChange={onSearchChange}
            onStatusChange={openStatusModal}
          />
        </TabsContent>

        <TabsContent value="scheduled" className="p-2">
          <JobsTable
            jobs={getFilteredJobs("scheduled")}
            searchTerm={searchTerm}
            onCancel={handleCancelJob}
            onComplete={onCompleteJob}
            onReschedule={onRescheduleJob}
            onSendToEstimate={onSendToEstimate}
            onSearchChange={onSearchChange}
            onStatusChange={openStatusModal}
          />
        </TabsContent>

        <TabsContent value="completed" className="p-2">
          <JobsTable
            jobs={getFilteredJobs("completed")}
            searchTerm={searchTerm}
            onCancel={handleCancelJob}
            onComplete={onCompleteJob}
            onReschedule={onRescheduleJob}
            onSendToEstimate={onSendToEstimate}
            onSearchChange={onSearchChange}
            onStatusChange={openStatusModal}
          />
        </TabsContent>

        <TabsContent value="cancelled" className="p-2">
          <JobsTable
            jobs={getFilteredJobs("cancelled")}
            searchTerm={searchTerm}
            onCancel={handleCancelJob}
            onComplete={onCompleteJob}
            onReschedule={onRescheduleJob}
            onSendToEstimate={onSendToEstimate}
            onSearchChange={onSearchChange}
            onStatusChange={openStatusModal}
          />
        </TabsContent>

        <TabsContent value="estimates" className="p-2">
          <JobsTable
            jobs={getFilteredJobs("estimates")}
            searchTerm={searchTerm}
            onCancel={handleCancelJob}
            onComplete={onCompleteJob}
            onReschedule={onRescheduleJob}
            onSendToEstimate={onSendToEstimate}
            onSearchChange={onSearchChange}
            onStatusChange={openStatusModal}
          />
        </TabsContent>
      </Tabs>

      {/* Cancel Job Dialog */}
      <CancelJobDialog 
        open={isCancelDialogOpen} 
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={confirmCancelJob}
        job={jobToCancel}
      />

      {/* Update Status Modal */}
      {selectedJob && (
        <UpdateJobStatusModal
          open={isStatusModalOpen}
          onClose={closeStatusModal}
          job={selectedJob}
          onComplete={onCompleteJob}
          onCancel={handleCancelJob}
          onReschedule={onRescheduleJob}
          onSendToEstimate={onSendToEstimate}
        />
      )}
    </div>
  );
};

export default JobTabs;
