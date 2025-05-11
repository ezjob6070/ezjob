
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Job, JobStatus } from "./JobTypes";
import JobsTable from "./JobsTable";

interface JobTabsProps {
  jobs: Job[];
  searchTerm?: string;
  onCancelJob: (jobId: string) => void;
  onCompleteJob: (jobId: string) => void;
  onRescheduleJob: (jobId: string, newDate: Date, isAllDay: boolean) => void;
  onSendToEstimate?: (job: Job) => void;
  onSearchChange?: (term: string) => void;
  selectedJob?: Job | null;
  isStatusModalOpen?: boolean;
  openStatusModal?: (job: Job) => void;
  closeStatusModal?: () => void;
  setDatePopoverOpen?: (open: boolean) => void;
  setTechPopoverOpen?: (open: boolean) => void;
  setContractorPopoverOpen?: (open: boolean) => void;
  setSourcePopoverOpen?: (open: boolean) => void;
  setAmountPopoverOpen?: (open: boolean) => void;
  setPaymentPopoverOpen?: (open: boolean) => void;
}

const JobTabs: React.FC<JobTabsProps> = ({
  jobs,
  searchTerm = '',
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
  setContractorPopoverOpen,
  setSourcePopoverOpen,
  setAmountPopoverOpen,
  setPaymentPopoverOpen
}) => {
  const [activeTab, setActiveTab] = useState("all");

  // Fix for onTabChange issue - define a handler that works with string values
  const handleChangeTab = (value: string) => {
    setActiveTab(value);
  };

  const getFilteredJobs = (status?: JobStatus | 'all') => {
    if (!status || status === 'all') return jobs;

    return jobs.filter(job => {
      // Handle the 'in-progress' tab separately due to different status formats in the data
      if (status === 'in-progress') {
        return job.status === 'in-progress' || job.status === 'in_progress';
      }
      
      // For canceled/cancelled
      if (status === 'canceled') {
        return job.status === 'canceled' || job.status === 'cancelled';
      }
      
      return job.status === status;
    });
  };

  const updateStatus = (job: Job) => {
    if (openStatusModal) {
      openStatusModal(job);
    }
  };

  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={handleChangeTab}>
      <TabsList>
        <TabsTrigger value="all">All Jobs ({jobs.length})</TabsTrigger>
        <TabsTrigger value="scheduled">
          Scheduled ({getFilteredJobs('scheduled').length})
        </TabsTrigger>
        <TabsTrigger value="in-progress">
          In Progress ({getFilteredJobs('in-progress').length})
        </TabsTrigger>
        <TabsTrigger value="completed">
          Completed ({getFilteredJobs('completed').length})
        </TabsTrigger>
        <TabsTrigger value="canceled">
          Cancelled ({getFilteredJobs('canceled').length})
        </TabsTrigger>
      </TabsList>

      <div className="mt-4">
        {/* All Jobs */}
        <TabsContent value="all">
          <JobsTable 
            jobs={jobs} 
            onUpdateStatus={updateStatus}
            onSendToEstimate={onSendToEstimate} 
            searchTerm={searchTerm}
          />
        </TabsContent>

        {/* Scheduled Jobs */}
        <TabsContent value="scheduled">
          <JobsTable 
            jobs={getFilteredJobs('scheduled')} 
            onUpdateStatus={updateStatus}
            onSendToEstimate={onSendToEstimate}
            searchTerm={searchTerm}
          />
        </TabsContent>

        {/* In Progress Jobs */}
        <TabsContent value="in-progress">
          <JobsTable 
            jobs={getFilteredJobs('in-progress')} 
            onUpdateStatus={updateStatus} 
            onSendToEstimate={onSendToEstimate}
            searchTerm={searchTerm}
          />
        </TabsContent>

        {/* Completed Jobs */}
        <TabsContent value="completed">
          <JobsTable 
            jobs={getFilteredJobs('completed')} 
            onUpdateStatus={updateStatus} 
            onSendToEstimate={onSendToEstimate}
            searchTerm={searchTerm}
          />
        </TabsContent>

        {/* Cancelled Jobs */}
        <TabsContent value="canceled">
          <JobsTable 
            jobs={getFilteredJobs('canceled')} 
            onUpdateStatus={updateStatus} 
            onSendToEstimate={onSendToEstimate}
            searchTerm={searchTerm}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default JobTabs;
