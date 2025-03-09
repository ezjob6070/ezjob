
import { Card, CardContent } from "@/components/ui/card";
import { BarChartIcon, BriefcaseIcon, UsersIcon, DollarSign, XCircle } from "lucide-react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Job } from "./JobTypes";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

type JobStatsProps = {
  jobs: Job[];
  date?: DateRange | undefined;
};

const JobStats = ({ jobs, date }: JobStatsProps) => {
  // Stats
  const scheduledJobs = jobs.filter(job => job.status === "scheduled").length;
  const completedJobs = jobs.filter(job => job.status === "completed").length;
  const cancelledJobs = jobs.filter(job => job.status === "cancelled").length;
  const totalRevenue = jobs.reduce((sum, job) => sum + job.amount, 0);

  // Format date range for display
  const getDateRangeText = () => {
    if (!date?.from) return null;
    
    if (!date.to) {
      return (
        <div className="text-xs text-muted-foreground mt-1">
          {format(date.from, "MMM d, yyyy")}
        </div>
      );
    }
    
    return (
      <div className="text-xs text-muted-foreground mt-1">
        {format(date.from, "MMM d")} - {format(date.to, "MMM d, yyyy")}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Scheduled Jobs</p>
              <p className="text-2xl font-bold">{scheduledJobs}</p>
              {getDateRangeText()}
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
              {getDateRangeText()}
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
              {getDateRangeText()}
            </div>
            <div className="p-2 bg-purple-100 rounded-full">
              <DollarSign className="h-5 w-5 text-purple-700" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-500">Cancelled Jobs</p>
              <p className="text-2xl font-bold">{cancelledJobs}</p>
              {getDateRangeText()}
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <XCircle className="h-5 w-5 text-red-700" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobStats;
