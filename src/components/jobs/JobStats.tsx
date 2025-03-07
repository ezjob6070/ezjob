
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Job } from "@/pages/Jobs";
import { 
  ClipboardListIcon, 
  UsersIcon, 
  CalendarIcon, 
  AlertTriangleIcon, 
  FileTextIcon 
} from "lucide-react";

interface JobStatsProps {
  jobs: Job[];
}

const JobStats = ({ jobs }: JobStatsProps) => {
  // Stats calculation
  const totalJobs = jobs.length;
  const completedJobs = jobs.filter(job => job.status === "completed").length;
  const inProgressJobs = jobs.filter(job => job.status === "in-progress").length;
  const scheduledJobs = jobs.filter(job => job.status === "scheduled").length;
  const cancelledJobs = jobs.filter(job => job.status === "cancelled").length;
  const totalRevenue = jobs.reduce((total, job) => total + job.amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangleIcon className="h-5 w-5 text-red-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cancelled</p>
              <p className="text-2xl font-bold">{cancelledJobs}</p>
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
  );
};

export default JobStats;
