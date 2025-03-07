
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { JobSource } from "@/types/jobSource";
import JobSourcesList from "@/components/jobSources/JobSourcesList";
import CreateJobSourceModal from "@/components/jobSources/CreateJobSourceModal";
import EditJobSourceModal from "@/components/jobSources/EditJobSourceModal";
import JobSourceStats from "@/components/jobSources/JobSourceStats";

const initialJobSources: JobSource[] = [
  {
    id: "1",
    name: "Google Ads",
    website: "https://ads.google.com",
    logoUrl: "https://source.unsplash.com/random/200x200/?google",
    paymentType: "percentage",
    paymentValue: 10,
    isActive: true,
    totalJobs: 24,
    totalRevenue: 12500,
    profit: 11250,
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "2",
    name: "Facebook Marketplace",
    website: "https://facebook.com/marketplace",
    logoUrl: "https://source.unsplash.com/random/200x200/?facebook",
    paymentType: "fixed",
    paymentValue: 50,
    isActive: true,
    totalJobs: 18,
    totalRevenue: 8200,
    profit: 7300,
    createdAt: new Date("2023-02-10"),
  },
  {
    id: "3",
    name: "Referral Program",
    paymentType: "percentage",
    paymentValue: 5,
    isActive: true,
    totalJobs: 32,
    totalRevenue: 15800,
    profit: 15010,
    createdAt: new Date("2023-03-05"),
  },
];

const JobSources = () => {
  const { toast } = useToast();
  const [jobSources, setJobSources] = useState<JobSource[]>(initialJobSources);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedJobSource, setSelectedJobSource] = useState<JobSource | null>(null);

  const handleAddJobSource = (newJobSource: JobSource) => {
    setJobSources((prev) => [newJobSource, ...prev]);
    toast({
      title: "Job Source Added",
      description: "New job source has been added successfully.",
    });
  };

  const handleEditJobSource = (jobSource: JobSource) => {
    setSelectedJobSource(jobSource);
    setShowEditModal(true);
  };

  const handleUpdateJobSource = (updatedJobSource: JobSource) => {
    setJobSources((prev) =>
      prev.map((source) =>
        source.id === updatedJobSource.id ? updatedJobSource : source
      )
    );
    toast({
      title: "Job Source Updated",
      description: "Job source has been updated successfully.",
    });
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
