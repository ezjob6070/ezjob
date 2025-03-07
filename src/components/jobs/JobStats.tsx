import { Card, CardContent } from "@/components/ui/card";
import { BarChartIcon, BriefcaseIcon, UsersIcon, DollarSign } from "lucide-react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Job } from "./JobTypes";

type JobStatsProps = {
  jobs: Job[];
};

const JobStats = ({ jobs }: JobStatsProps) => {
  // Stats
  const scheduledJobs = jobs.filter(job => job.status === "scheduled").length;
  const completedJobs = jobs.filter(job => job.status === "completed").length;
  const totalRevenue = jobs.reduce((sum, job) => sum + job.amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Scheduled Jobs</p>
              <p className="text-2xl font-bold">{scheduledJobs}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <BriefcaseIcon className="h-5 w-5 text-blue-700" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed Jobs</p>
              <p className="text-2xl font-bold">{completedJobs}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <UsersIcon className="h-5 w-5 text-green-700" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-full">
              <DollarSign className="h-5 w-5 text-purple-700" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobStats;
