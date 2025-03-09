
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobsTable from "./JobsTable";
import { Job } from "./JobTypes";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export interface JobTabsProps {
  jobs: Job[];
  searchTerm: string;
  onCancelJob: (jobId: string) => void;
  onSearchChange?: (term: string) => void;
}

const JobTabs = ({ jobs, searchTerm, onCancelJob, onSearchChange }: JobTabsProps) => {
  const [activeTab, setActiveTab] = useState("all");

  const filteredJobs = (status: string) => {
    if (status === "all") {
      return jobs;
    }
    return jobs.filter(job => job.status === status);
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
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
    </div>
  );
};

export default JobTabs;
