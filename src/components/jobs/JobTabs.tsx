
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobsTable from "./JobsTable";
import { Job } from "./JobTypes";

export interface JobTabsProps {
  jobs: Job[];
  searchTerm: string;
  onCancelJob: (jobId: string) => void;
}

const JobTabs = ({ jobs, searchTerm, onCancelJob }: JobTabsProps) => {
  const [activeTab, setActiveTab] = useState("all");

  const filteredJobs = (status: string) => {
    if (status === "all") {
      return jobs;
    }
    return jobs.filter(job => job.status === status);
  };

  return (
    <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-5 mb-4">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        <TabsTrigger value="in_progress">In Progress</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
        <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <JobsTable jobs={filteredJobs("all")} searchTerm={searchTerm} />
      </TabsContent>
      
      <TabsContent value="scheduled">
        <JobsTable jobs={filteredJobs("scheduled")} searchTerm={searchTerm} />
      </TabsContent>
      
      <TabsContent value="in_progress">
        <JobsTable jobs={filteredJobs("in_progress")} searchTerm={searchTerm} />
      </TabsContent>
      
      <TabsContent value="completed">
        <JobsTable jobs={filteredJobs("completed")} searchTerm={searchTerm} />
      </TabsContent>
      
      <TabsContent value="cancelled">
        <JobsTable jobs={filteredJobs("cancelled")} searchTerm={searchTerm} />
      </TabsContent>
    </Tabs>
  );
};

export default JobTabs;
