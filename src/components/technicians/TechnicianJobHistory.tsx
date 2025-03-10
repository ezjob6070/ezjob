
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Technician } from "@/types/technician";
import { initialJobs } from "@/data/jobs";
import { Job } from "@/components/jobs/JobTypes";
import { CheckCircle, XCircle, Clock, DollarSign } from "lucide-react";

interface TechnicianJobHistoryProps {
  technician: Technician;
}

const TechnicianJobHistory: React.FC<TechnicianJobHistoryProps> = ({ technician }) => {
  // Filter jobs associated with this technician
  const technicianJobs = useMemo(() => {
    return initialJobs.filter(job => 
      job.technicianName && job.technicianName.toLowerCase().includes(technician.name.toLowerCase())
    );
  }, [technician.name]);

  // Calculate job statistics
  const jobStats = useMemo(() => {
    const completed = technicianJobs.filter(job => job.status === "completed").length;
    const canceled = technicianJobs.filter(job => job.status === "canceled").length;
    const inProgress = technicianJobs.filter(job => job.status === "in_progress").length;
    const scheduled = technicianJobs.filter(job => job.status === "scheduled").length;
    const totalRevenue = technicianJobs.reduce((sum, job) => sum + (job.amount || 0), 0);
    
    return { completed, canceled, inProgress, scheduled, totalRevenue };
  }, [technicianJobs]);

  // Get jobs by status
  const getJobsByStatus = (status: string) => {
    return technicianJobs.filter(job => job.status === status);
  };

  // Render a job card
  const renderJobCard = (job: Job) => (
    <Card key={job.id} className="mb-3 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium">{job.title}</h4>
            <p className="text-sm text-muted-foreground mb-2">
              {job.date ? format(new Date(job.date), 'MMM d, yyyy') : 'No date'}
            </p>
            <p className="text-sm">{job.clientName}</p>
            {job.address && <p className="text-xs text-muted-foreground">{job.address}</p>}
          </div>
          <div className="flex flex-col items-end">
            <Badge variant={job.status === "completed" ? "success" : 
                           job.status === "canceled" ? "destructive" : 
                           job.status === "in_progress" ? "warning" : "outline"}>
              {job.status.replace('_', ' ')}
            </Badge>
            <p className="text-sm font-medium mt-2">${job.amount?.toLocaleString() || '0'}</p>
          </div>
        </div>
        {job.description && (
          <p className="text-sm mt-2 text-muted-foreground">{job.description}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Job Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
            <p className="text-xl font-bold">{jobStats.completed}</p>
            <p className="text-sm text-muted-foreground">Completed Jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <XCircle className="h-8 w-8 text-red-500 mb-2" />
            <p className="text-xl font-bold">{jobStats.canceled}</p>
            <p className="text-sm text-muted-foreground">Canceled Jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Clock className="h-8 w-8 text-blue-500 mb-2" />
            <p className="text-xl font-bold">{jobStats.scheduled + jobStats.inProgress}</p>
            <p className="text-sm text-muted-foreground">Upcoming Jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <DollarSign className="h-8 w-8 text-green-700 mb-2" />
            <p className="text-xl font-bold">${jobStats.totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Jobs List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Jobs</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="canceled">Canceled</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          {technicianJobs.length > 0 ? (
            technicianJobs.map(renderJobCard)
          ) : (
            <p className="text-center py-8 text-muted-foreground">No job history found for this technician.</p>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4">
          {getJobsByStatus("completed").length > 0 ? (
            getJobsByStatus("completed").map(renderJobCard)
          ) : (
            <p className="text-center py-8 text-muted-foreground">No completed jobs found.</p>
          )}
        </TabsContent>
        
        <TabsContent value="canceled" className="mt-4">
          {getJobsByStatus("canceled").length > 0 ? (
            getJobsByStatus("canceled").map(renderJobCard)
          ) : (
            <p className="text-center py-8 text-muted-foreground">No canceled jobs found.</p>
          )}
        </TabsContent>
        
        <TabsContent value="in_progress" className="mt-4">
          {getJobsByStatus("in_progress").length > 0 ? (
            getJobsByStatus("in_progress").map(renderJobCard)
          ) : (
            <p className="text-center py-8 text-muted-foreground">No jobs in progress.</p>
          )}
        </TabsContent>
        
        <TabsContent value="scheduled" className="mt-4">
          {getJobsByStatus("scheduled").length > 0 ? (
            getJobsByStatus("scheduled").map(renderJobCard)
          ) : (
            <p className="text-center py-8 text-muted-foreground">No scheduled jobs.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TechnicianJobHistory;
