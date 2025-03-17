
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobsTable from "./JobsTable";
import { Job } from "./JobTypes";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import UpdateJobStatusModal from "./UpdateJobStatusModal";

export interface JobTabsProps {
  jobs: Job[];
  searchTerm: string;
  onCancelJob: (jobId: string, cancellationReason?: string) => void;
  onCompleteJob: (jobId: string, actualAmount: number) => void;
  onRescheduleJob?: (jobId: string, newDate: Date, isAllDay: boolean) => void;
  onSearchChange?: (term: string) => void;
  dateRangeComponent?: React.ReactNode;
  filtersComponent?: React.ReactNode;
  amountFilterComponent?: React.ReactNode;
  paymentMethodComponent?: React.ReactNode;
  jobSourceComponent?: React.ReactNode;
  selectedJob: Job | null;
  isStatusModalOpen: boolean;
  openStatusModal: (job: Job) => void;
  closeStatusModal: () => void;
}

const JobTabs = ({ 
  jobs, 
  searchTerm, 
  onCancelJob,
  onCompleteJob,
  onRescheduleJob,
  onSearchChange,
  dateRangeComponent,
  filtersComponent,
  amountFilterComponent,
  paymentMethodComponent,
  jobSourceComponent,
  selectedJob,
  isStatusModalOpen,
  openStatusModal,
  closeStatusModal
}: JobTabsProps) => {
  const [activeTab, setActiveTab] = useState("all");

  const getJobsByStatus = (status: string) => {
    if (status === "all") {
      return jobs;
    }
    return jobs.filter(job => job.status === status);
  };

  // Count jobs by status
  const scheduledJobsCount = jobs.filter(job => job.status === "scheduled").length;
  const inProgressJobsCount = jobs.filter(job => job.status === "in_progress").length;
  const completedJobsCount = jobs.filter(job => job.status === "completed").length;
  const cancelledJobsCount = jobs.filter(job => job.status === "cancelled").length;
  const allJobsCount = jobs.length;

  const getTabTriggerClass = (value: string) => {
    switch (value) {
      case "all":
        return "data-[state=active]:bg-blue-500 data-[state=active]:text-white";
      case "scheduled":
        return "data-[state=active]:bg-yellow-500 data-[state=active]:text-white";
      case "in_progress":
        return "data-[state=active]:bg-black data-[state=active]:text-white";
      case "completed":
        return "data-[state=active]:bg-green-500 data-[state=active]:text-white";
      case "cancelled":
        return "data-[state=active]:bg-red-500 data-[state=active]:text-white";
      default:
        return "data-[state=active]:bg-primary";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-start gap-2 mb-4">
        {dateRangeComponent}
        {filtersComponent}
        {jobSourceComponent}
        {amountFilterComponent}
        {paymentMethodComponent}
      </div>
      
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger 
            value="all"
            className={getTabTriggerClass("all")}
          >
            All
            <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-gray-200 text-gray-800 rounded-full font-medium">
              {allJobsCount}
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="scheduled"
            className={getTabTriggerClass("scheduled")}
          >
            Scheduled
            <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full font-medium">
              {scheduledJobsCount}
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="in_progress"
            className={getTabTriggerClass("in_progress")}
          >
            In Progress
            <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
              {inProgressJobsCount}
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="completed"
            className={getTabTriggerClass("completed")}
          >
            Completed
            <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded-full font-medium">
              {completedJobsCount}
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="cancelled"
            className={getTabTriggerClass("cancelled")}
          >
            Cancelled
            <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-red-100 text-red-800 rounded-full font-medium">
              {cancelledJobsCount}
            </span>
          </TabsTrigger>
        </TabsList>
        
        <div className="relative mb-4">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
        </div>
        
        <TabsContent value="all">
          <JobsTable 
            jobs={getJobsByStatus("all")} 
            searchTerm={searchTerm}
            onOpenStatusModal={openStatusModal}
          />
        </TabsContent>
        
        <TabsContent value="scheduled">
          <JobsTable 
            jobs={getJobsByStatus("scheduled")} 
            searchTerm={searchTerm}
            onOpenStatusModal={openStatusModal}
          />
        </TabsContent>
        
        <TabsContent value="in_progress">
          <JobsTable 
            jobs={getJobsByStatus("in_progress")} 
            searchTerm={searchTerm}
            onOpenStatusModal={openStatusModal}
          />
        </TabsContent>
        
        <TabsContent value="completed">
          <JobsTable 
            jobs={getJobsByStatus("completed")} 
            searchTerm={searchTerm}
            onOpenStatusModal={openStatusModal}
          />
        </TabsContent>
        
        <TabsContent value="cancelled">
          <JobsTable 
            jobs={getJobsByStatus("cancelled")} 
            searchTerm={searchTerm}
            onOpenStatusModal={openStatusModal}
          />
        </TabsContent>
      </Tabs>

      <UpdateJobStatusModal
        open={isStatusModalOpen}
        onOpenChange={closeStatusModal}
        job={selectedJob}
        onCancel={onCancelJob}
        onComplete={onCompleteJob}
        onReschedule={onRescheduleJob}
      />
    </div>
  );
};

export default JobTabs;
