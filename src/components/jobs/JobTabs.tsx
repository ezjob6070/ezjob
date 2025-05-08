
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobsTable from "./JobsTable";
import { Job, JobTab } from "./JobTypes";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import UpdateJobStatusModal from "./UpdateJobStatusModal";

interface JobTabsProps {
  jobs: Job[];
  searchTerm: string;
  onCancelJob: (jobId: string, cancellationReason?: string) => void;
  onCompleteJob: (jobId: string, actualAmount: number) => void;
  onRescheduleJob: (jobId: string, newDate: Date, isAllDay: boolean) => void;
  onSendToEstimate: (job: Job) => void;
  onSearchChange: (value: string) => void;
  selectedJob: Job | null;
  isStatusModalOpen: boolean;
  openStatusModal: (job: Job) => void;
  closeStatusModal: () => void;
  setDatePopoverOpen: (open: boolean) => void;
  setTechPopoverOpen: (open: boolean) => void;
  setSourcePopoverOpen: (open: boolean) => void;
  setAmountPopoverOpen: (open: boolean) => void;
  setPaymentPopoverOpen: (open: boolean) => void;
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
  setPaymentPopoverOpen
}) => {
  const [activeTab, setActiveTab] = useState("all");
  
  // Create job tabs
  const jobTabs: JobTab[] = [
    { id: "all", label: "All", status: "all", count: jobs.length },
    { id: "scheduled", label: "Scheduled", status: "scheduled", count: jobs.filter(job => job.status === "scheduled").length },
    { id: "in_progress", label: "In Progress", status: "in_progress", count: jobs.filter(job => job.status === "in_progress").length },
    { id: "completed", label: "Completed", status: "completed", count: jobs.filter(job => job.status === "completed").length },
    { id: "cancelled", label: "Cancelled", status: "cancelled", count: jobs.filter(job => job.status === "cancelled").length },
  ];
  
  // Filter jobs based on active tab
  const getFilteredJobs = () => {
    if (activeTab === "all") {
      return jobs;
    }
    
    return jobs.filter(job => job.status === activeTab);
  };
  
  const filteredJobs = getFilteredJobs();
  
  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search jobs..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5">
          {jobTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex gap-2">
              <span>{tab.label}</span>
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs">
                {tab.count}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {/* Tab content */}
        <TabsContent value={activeTab} className="mt-6">
          <JobsTable
            jobs={filteredJobs}
            onUpdateStatus={openStatusModal}
            onSendToEstimate={onSendToEstimate}
            searchTerm={searchTerm}
          />
        </TabsContent>
      </Tabs>
      
      {/* Job status modal */}
      <UpdateJobStatusModal
        open={isStatusModalOpen}
        onOpenChange={closeStatusModal}
        job={selectedJob}
        onCancel={onCancelJob}
        onComplete={onCompleteJob}
        onReschedule={onRescheduleJob}
        onSendToEstimate={onSendToEstimate}
      />
    </div>
  );
};

export default JobTabs;
