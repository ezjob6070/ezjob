
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { JobSource } from "@/types/jobSource";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";
import JobSourcesList from "@/components/jobSources/JobSourcesList";
import CreateJobSourceModal from "@/components/jobSources/CreateJobSourceModal";
import EditJobSourceModal from "@/components/jobSources/EditJobSourceModal";
import JobSourceStats from "@/components/jobSources/JobSourceStats";

const JobSources = () => {
  const { toast } = useToast();
  const { jobSources, addJobSource, updateJobSource } = useGlobalState();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedJobSource, setSelectedJobSource] = useState<JobSource | null>(null);

  const handleAddJobSource = (newJobSource: JobSource) => {
    addJobSource(newJobSource);
  };

  const handleEditJobSource = (jobSource: JobSource) => {
    setSelectedJobSource(jobSource);
    setShowEditModal(true);
  };

  const handleUpdateJobSource = (updatedJobSource: JobSource) => {
    updateJobSource(updatedJobSource);
  };

  return (
    <div className="space-y-8 py-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold leading-tight tracking-tighter">
            Job Sources
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your job sources and track their performance
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-900"
        >
          <PlusIcon className="mr-2 h-4 w-4" /> Add Job Source
        </Button>
      </div>

      <JobSourceStats jobSources={jobSources} />
      
      <JobSourcesList 
        jobSources={jobSources} 
        onEditJobSource={handleEditJobSource}
      />
      
      <CreateJobSourceModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onAddJobSource={handleAddJobSource}
      />

      <EditJobSourceModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onUpdateJobSource={handleUpdateJobSource}
        jobSource={selectedJobSource}
      />
    </div>
  );
};

export default JobSources;
