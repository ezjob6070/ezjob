
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import JobHeader from "@/components/jobs/JobHeader";
import JobStats from "@/components/jobs/JobStats";
import JobTabs from "@/components/jobs/JobTabs";
import CreateJobModal from "@/components/jobs/CreateJobModal";
import { initialTechnicians } from "@/data/technicians";
import { Job, JobStatus } from "@/components/jobs/JobTypes";

const Jobs = () => {
  const { toast } = useToast();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: "job1",
      title: "HVAC Installation",
      clientName: "Acme Corp",
      clientId: "client1",
      technicianName: "John Smith",
      technicianId: "tech1",
      scheduledDate: new Date("2023-10-15"),
      status: "scheduled",
      amount: 1250,
      description: "Install new HVAC system in office building",
      createdAt: new Date("2023-09-10"),
    },
    {
      id: "job2",
      title: "Network Setup",
      clientName: "Tech Solutions Inc.",
      clientId: "client2",
      technicianName: "Sarah Johnson",
      technicianId: "tech2",
      scheduledDate: new Date("2023-10-10"),
      status: "in-progress",
      amount: 750,
      description: "Setup enterprise network infrastructure",
      createdAt: new Date("2023-09-08"),
    },
    {
      id: "job3",
      title: "Security System Install",
      clientName: "Global Industries",
      clientId: "client3",
      technicianName: "Michael Brown",
      technicianId: "tech3",
      scheduledDate: new Date("2023-09-30"),
      status: "completed",
      amount: 500,
      description: "Install security cameras and alarm system",
      createdAt: new Date("2023-09-05"),
    },
    {
      id: "job4",
      title: "Plumbing Repair",
      clientName: "City Hospital",
      clientId: "client4",
      technicianName: "Michael Brown",
      technicianId: "tech3",
      scheduledDate: new Date("2023-10-05"),
      status: "cancelled",
      amount: 350,
      description: "Fix leaking pipes in the basement",
      createdAt: new Date("2023-09-12"),
    },
  ]);

  const handleAddJob = (newJob: Job) => {
    setJobs((prevJobs) => [newJob, ...prevJobs]);
    toast({
      title: "Job Created",
      description: "New job has been created successfully",
    });
  };

  const handleCancelJob = (jobId: string) => {
    setJobs((prevJobs) => prevJobs.map(job => 
      job.id === jobId ? { ...job, status: "cancelled" as JobStatus } : job
    ));
  };

  // Extract technicians for the filter
  const technicians = initialTechnicians.map(tech => ({
    id: tech.id,
    name: tech.name
  }));

  return (
    <div className="space-y-8 py-8">
      <JobHeader onCreateJob={() => setShowCreateModal(true)} />
      
      <JobStats jobs={jobs} />
      
      <JobTabs 
        jobs={jobs} 
        technicians={technicians} 
        onCancelJob={handleCancelJob} 
      />
      
      <CreateJobModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal} 
        onAddJob={handleAddJob} 
      />
    </div>
  );
};

export default Jobs;
