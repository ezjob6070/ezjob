
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobsTable from "./JobsTable";

// Using a local job interface instead of importing from Jobs page
type JobStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

interface Job {
  id: string;
  clientName: string;
  title: string;
  status: JobStatus;
  date: Date;
  technicianName?: string;
  address: string;
  amount: number;
  description?: string;
  notes?: string;
}

interface JobTabsProps {
  jobs: Job[];
  searchTerm: string;
}

const JobTabs = ({ jobs, searchTerm }: JobTabsProps) => {
  // Filter jobs by status
  const scheduledJobs = jobs.filter(job => job.status === "scheduled");
  const inProgressJobs = jobs.filter(job => job.status === "in_progress");
  const completedJobs = jobs.filter(job => job.status === "completed");
  const cancelledJobs = jobs.filter(job => job.status === "cancelled");
  
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="all">
          All
          <span className="ml-1 text-xs rounded-full bg-muted px-2 py-0.5">
            {jobs.length}
          </span>
        </TabsTrigger>
        <TabsTrigger value="scheduled">
          Scheduled
          <span className="ml-1 text-xs rounded-full bg-muted px-2 py-0.5">
            {scheduledJobs.length}
          </span>
        </TabsTrigger>
        <TabsTrigger value="inProgress">
          In Progress
          <span className="ml-1 text-xs rounded-full bg-muted px-2 py-0.5">
            {inProgressJobs.length}
          </span>
        </TabsTrigger>
        <TabsTrigger value="completed">
          Completed
          <span className="ml-1 text-xs rounded-full bg-muted px-2 py-0.5">
            {completedJobs.length}
          </span>
        </TabsTrigger>
        <TabsTrigger value="cancelled">
          Cancelled
          <span className="ml-1 text-xs rounded-full bg-muted px-2 py-0.5">
            {cancelledJobs.length}
          </span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <JobsTable jobs={jobs} searchTerm={searchTerm} />
      </TabsContent>
      
      <TabsContent value="scheduled">
        <JobsTable jobs={scheduledJobs} searchTerm={searchTerm} />
      </TabsContent>
      
      <TabsContent value="inProgress">
        <JobsTable jobs={inProgressJobs} searchTerm={searchTerm} />
      </TabsContent>
      
      <TabsContent value="completed">
        <JobsTable jobs={completedJobs} searchTerm={searchTerm} />
      </TabsContent>
      
      <TabsContent value="cancelled">
        <JobsTable jobs={cancelledJobs} searchTerm={searchTerm} />
      </TabsContent>
    </Tabs>
  );
};

export default JobTabs;
