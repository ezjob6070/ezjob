
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Job } from '@/types/job';
import { JobTab } from '@/types/job';

interface JobTabsProps {
  jobs: Job[];
  activeTab: JobTab;
  onTabChange: (tab: JobTab) => void;
}

const JobTabs: React.FC<JobTabsProps> = ({ jobs, activeTab, onTabChange }) => {
  // Count jobs for each status
  const counts = jobs.reduce(
    (acc, job) => {
      const status = job.status.toLowerCase();
      if (status === 'scheduled') {
        acc.scheduled++;
      } else if (status === 'in-progress' || status === 'in_progress') {
        acc.inProgress++;
      } else if (status === 'completed') {
        acc.completed++;
      } else if (status === 'canceled' || status === 'cancelled') {
        acc.canceled++;
      }
      acc.all++;
      return acc;
    },
    { all: 0, scheduled: 0, inProgress: 0, completed: 0, canceled: 0 }
  );

  const handleChangeTab = (value: string) => {
    onTabChange(value as JobTab);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleChangeTab} className="w-full">
      <TabsList className="grid grid-cols-5 w-full max-w-2xl">
        <TabsTrigger value="all">
          All Jobs
          <Badge variant="outline" className="ml-2">{counts.all}</Badge>
        </TabsTrigger>
        <TabsTrigger value="scheduled">
          Scheduled
          <Badge variant="outline" className="ml-2">{counts.scheduled}</Badge>
        </TabsTrigger>
        <TabsTrigger value="in-progress">
          In Progress
          <Badge variant="outline" className="ml-2">{counts.inProgress}</Badge>
        </TabsTrigger>
        <TabsTrigger value="completed">
          Completed
          <Badge variant="outline" className="ml-2">{counts.completed}</Badge>
        </TabsTrigger>
        <TabsTrigger value="canceled">
          Canceled
          <Badge variant="outline" className="ml-2">{counts.canceled}</Badge>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default JobTabs;
