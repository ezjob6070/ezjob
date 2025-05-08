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

  // Function to create a new job source with all required fields
  const handleAddJobSource = (newJobSource: Partial<JobSource>) => {
    const completeJobSource: JobSource = {
      ...newJobSource,
      id: newJobSource.id || crypto.randomUUID(),
      type: newJobSource.type || 'general',
      paymentType: (newJobSource.paymentType as "fixed" | "percentage") || 'percentage',
      paymentValue: newJobSource.paymentValue || 0,
      isActive: newJobSource.isActive !== false,
      totalJobs: newJobSource.totalJobs || 0,
      totalRevenue: newJobSource.totalRevenue || 0,
      profit: newJobSource.profit || 0,
      createdAt: newJobSource.createdAt || new Date().toISOString(), // Convert Date to string
      name: newJobSource.name || 'New Job Source'
    };
    
    addJobSource(completeJobSource);
    toast({
      title: "Job Source Created",
      description: "New job source has been added successfully."
    });
  };

  const handleEditJobSource = (jobSource: JobSource) => {
    setSelectedJobSource(jobSource);
    setShowEditModal(true);
  };

  const handleUpdateJobSource = (updatedJobSource: JobSource) => {
    // Ensure createdAt is a string
    const formattedJobSource: JobSource = {
      ...updatedJobSource,
      createdAt: typeof updatedJobSource.createdAt === 'string' 
        ? updatedJobSource.createdAt 
        : updatedJobSource.createdAt.toISOString()
    };
    
    updateJobSource(formattedJobSource.id, formattedJobSource);
    toast({
      title: "Job Source Updated",
      description: "Job source has been updated successfully."
    });
  };

  // Ensure jobSources have all required fields for display
  const completeJobSources: JobSource[] = jobSources.map(source => ({
    ...source,
    type: source.type || 'general',
    paymentType: (source.paymentType as "fixed" | "percentage") || 'percentage',
    paymentValue: source.paymentValue || 0,
    isActive: source.isActive !== false,
    totalJobs: source.totalJobs || 0,
    totalRevenue: source.totalRevenue || 0,
    profit: source.profit || 0,
    createdAt: typeof source.createdAt === 'string' ? source.createdAt : (source.createdAt || new Date()).toISOString()
  }));

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

      <JobSourceStats jobSources={completeJobSources} />
      
      <JobSourcesList 
        jobSources={completeJobSources} 
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
