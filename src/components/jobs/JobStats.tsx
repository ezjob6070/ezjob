
import { Card, CardContent } from "@/components/ui/card";
import { BarChartIcon, BriefcaseIcon, UsersIcon, DollarSign, XCircle } from "lucide-react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Job } from "./JobTypes";
import { format, isWithinInterval } from "date-fns";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";

type JobStatsProps = {
  jobs: Job[];
};

const JobStats = ({ jobs }: JobStatsProps) => {
  // Use the global date filter
  const { dateFilter } = useGlobalState();
  
  // Filter jobs based on date range if provided
  const filteredJobs = dateFilter?.from 
    ? jobs.filter(job => {
        if (job.scheduledDate) {
          const jobDate = new Date(job.scheduledDate);
          return dateFilter.to 
            ? isWithinInterval(jobDate, { start: dateFilter.from, end: dateFilter.to }) 
            : jobDate >= dateFilter.from;
        }
        return false;
      })
    : jobs;
    
  // Stats
  const scheduledJobs = filteredJobs.filter(job => job.status === "scheduled").length;
  const completedJobs = filteredJobs.filter(job => job.status === "completed").length;
  const cancelledJobs = filteredJobs.filter(job => job.status === "cancelled").length;
  
  // Calculate using actualAmount for completed jobs and regular amount for others
  const totalRevenue = filteredJobs.reduce((sum, job) => {
    if (job.status === "completed" && job.actualAmount !== undefined) {
      return sum + job.actualAmount;
    }
    return sum + (job.amount || 0);
  }, 0);
  
  // Calculate expenses as 40% of revenue
  const totalExpenses = totalRevenue * 0.4;
  
  // Calculate profit
  const totalProfit = totalRevenue - totalExpenses;

  // Format date range for display
  const getDateRangeText = () => {
    if (!dateFilter?.from) return null;
    
    if (!dateFilter.to || dateFilter.from.toDateString() === dateFilter.to.toDateString()) {
      return (
        <div className="text-xs text-muted-foreground mt-1">
          {format(dateFilter.from, "MMM d, yyyy")}
        </div>
      );
    }
    
    return (
      <div className="text-xs text-muted-foreground mt-1">
        {format(dateFilter.from, "MMM d")} - {format(dateFilter.to, "MMM d, yyyy")}
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
