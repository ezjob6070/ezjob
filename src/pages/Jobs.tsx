
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon, CalendarIcon, ClipboardListIcon, UsersIcon, FileTextIcon } from "lucide-react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import JobsTable from "@/components/jobs/JobsTable";
import CreateJobModal from "@/components/jobs/CreateJobModal";

// Job types
export type JobStatus = "scheduled" | "in-progress" | "completed" | "cancelled";

export type Job = {
  id: string;
  title: string;
  clientName: string;
  clientId: string;
  technicianName: string;
  technicianId: string;
  scheduledDate: Date;
  status: JobStatus;
  amount: number;
  description: string;
  createdAt: Date;
};

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
  ]);

  const handleAddJob = (newJob: Job) => {
    setJobs((prevJobs) => [newJob, ...prevJobs]);
    toast({
      title: "Job Created",
      description: "New job has been created successfully",
    });
  };

  // Stats calculation
  const totalJobs = jobs.length;
  const completedJobs = jobs.filter(job => job.status === "completed").length;
  const inProgressJobs = jobs.filter(job => job.status === "in-progress").length;
  const scheduledJobs = jobs.filter(job => job.status === "scheduled").length;
  const totalRevenue = jobs.reduce((total, job) => total + job.amount, 0);

  return (
    <div className="space-y-8 py-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold leading-tight tracking-tighter">
            Jobs Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Create, schedule, and manage jobs and technicians
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-900"
        >
          <PlusIcon className="mr-2 h-4 w-4" /> Create Job
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <ClipboardListIcon className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Jobs</p>
                <p className="text-2xl font-bold">{totalJobs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-full">
                <UsersIcon className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedJobs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-100 rounded-full">
                <CalendarIcon className="h-5 w-5 text-yellow-700" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{inProgressJobs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-full">
                <FileTextIcon className="h-5 w-5 text-purple-700" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all-jobs">
        <TabsList className="grid grid-cols-4 max-w-md">
          <TabsTrigger value="all-jobs">All Jobs</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled ({scheduledJobs})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({inProgressJobs})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedJobs})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-jobs" className="mt-6">
          <JobsTable jobs={jobs} formatCurrency={formatCurrency} />
        </TabsContent>
        
        <TabsContent value="scheduled" className="mt-6">
          <JobsTable 
            jobs={jobs.filter(job => job.status === "scheduled")} 
            formatCurrency={formatCurrency} 
          />
        </TabsContent>
        
        <TabsContent value="in-progress" className="mt-6">
          <JobsTable 
            jobs={jobs.filter(job => job.status === "in-progress")} 
            formatCurrency={formatCurrency} 
          />
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          <JobsTable 
            jobs={jobs.filter(job => job.status === "completed")} 
            formatCurrency={formatCurrency} 
          />
        </TabsContent>
      </Tabs>
      
      <CreateJobModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal} 
        onAddJob={handleAddJob} 
      />
    </div>
  );
};

export default Jobs;
