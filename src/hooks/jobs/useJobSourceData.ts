
import { useState } from "react";
import { JobSource } from "@/types/jobSource";

export const JOB_SOURCES: { id: string; name: string }[] = [];

export function useJobSourceData() {
  const [jobSources, setJobSources] = useState<JobSource[]>([]);
  const [isJobSourceSidebarOpen, setIsJobSourceSidebarOpen] = useState(false);
  const [isCreateJobSourceModalOpen, setIsCreateJobSourceModalOpen] = useState(false);
  const [selectedJobSourceForEdit, setSelectedJobSourceForEdit] = useState<JobSource | null>(null);

  const handleAddJobSource = () => {
    setIsCreateJobSourceModalOpen(true);
  };

  const handleEditJobSource = (jobSource: JobSource) => {
    setSelectedJobSourceForEdit(jobSource);
    setIsCreateJobSourceModalOpen(true);
  };

  const toggleJobSourceSidebar = () => {
    setIsJobSourceSidebarOpen(!isJobSourceSidebarOpen);
  };

  return {
    jobSources,
    setJobSources,
    isJobSourceSidebarOpen,
    setIsJobSourceSidebarOpen,
    isCreateJobSourceModalOpen,
    setIsCreateJobSourceModalOpen,
    selectedJobSourceForEdit,
    handleAddJobSource,
    handleEditJobSource,
    toggleJobSourceSidebar
  };
}
