
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Job } from "@/pages/Jobs";
import JobsTable from "@/components/jobs/JobsTable";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";

interface JobTabsProps {
  jobs: Job[];
  technicians: { id: string; name: string }[];
  onCancelJob: (jobId: string) => void;
}

const JobTabs = ({ jobs, technicians, onCancelJob }: JobTabsProps) => {
  // Stats for tabs
  const scheduledJobs = jobs.filter(job => job.status === "scheduled").length;
  const inProgressJobs = jobs.filter(job => job.status === "in-progress").length;
  const completedJobs = jobs.filter(job => job.status === "completed").length;
  const cancelledJobs = jobs.filter(job => job.status === "cancelled").length;

  return (
    <Tabs defaultValue="all-jobs">
      <TabsList className="grid grid-cols-5 max-w-xl">
        <TabsTrigger value="all-jobs">All Jobs</TabsTrigger>
        <TabsTrigger value="scheduled">Scheduled ({scheduledJobs})</TabsTrigger>
        <TabsTrigger value="in-progress">In Progress ({inProgressJobs})</TabsTrigger>
        <TabsTrigger value="completed">Completed ({completedJobs})</TabsTrigger>
        <TabsTrigger value="cancelled">Cancelled ({cancelledJobs})</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all-jobs" className="mt-6">
        <JobsTable 
          jobs={jobs} 
          formatCurrency={formatCurrency} 
          technicians={technicians}
          onCancelJob={onCancelJob}
        />
      </TabsContent>
      
      <TabsContent value="scheduled" className="mt-6">
        <JobsTable 
          jobs={jobs.filter(job => job.status === "scheduled")} 
          formatCurrency={formatCurrency} 
          technicians={technicians}
          onCancelJob={onCancelJob}
        />
      </TabsContent>
      
      <TabsContent value="in-progress" className="mt-6">
        <JobsTable 
          jobs={jobs.filter(job => job.status === "in-progress")} 
          formatCurrency={formatCurrency} 
          technicians={technicians}
          onCancelJob={onCancelJob}
        />
      </TabsContent>
      
      <TabsContent value="completed" className="mt-6">
        <JobsTable 
          jobs={jobs.filter(job => job.status === "completed")} 
          formatCurrency={formatCurrency} 
          technicians={technicians}
          onCancelJob={onCancelJob}
        />
      </TabsContent>
      
      <TabsContent value="cancelled" className="mt-6">
        <JobsTable 
          jobs={jobs.filter(job => job.status === "cancelled")} 
          formatCurrency={formatCurrency} 
          technicians={technicians}
          onCancelJob={onCancelJob}
        />
      </TabsContent>
    </Tabs>
  );
};

export default JobTabs;
