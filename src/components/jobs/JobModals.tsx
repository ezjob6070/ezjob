
import React from 'react';
import { Job } from "./JobTypes";
import { JobSource } from "@/types/jobSource";
import CreateJobModal from "./CreateJobModal";
import JobSourceSidebar from "./JobSourceSidebar";

interface JobModalsProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isJobSourceSidebarOpen: boolean;
  setIsJobSourceSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAddJob: (job: Job) => void;
  onAddJobSource: () => void;
  onEditJobSource: (jobSource: JobSource) => void;
  technicianOptions: { id: string; name: string }[];
  jobSources: { id: string; name: string }[];
  allJobSources: JobSource[];
}

const JobModals: React.FC<JobModalsProps> = ({
  isCreateModalOpen,
  setIsCreateModalOpen,
  isJobSourceSidebarOpen,
  setIsJobSourceSidebarOpen,
  onAddJob,
  onAddJobSource,
  onEditJobSource,
  technicianOptions,
  jobSources,
  allJobSources
}) => {
  return (
    <>
      <CreateJobModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onAddJob={onAddJob}
        technicians={technicianOptions}
        jobSources={jobSources}
      />

      <JobSourceSidebar 
        jobSources={allJobSources}
        isOpen={isJobSourceSidebarOpen}
        onClose={() => setIsJobSourceSidebarOpen(false)}
        onAddJobSource={onAddJobSource}
        onEditJobSource={onEditJobSource}
      />
    </>
  );
};

export default JobModals;
