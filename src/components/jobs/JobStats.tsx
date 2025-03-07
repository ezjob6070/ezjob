
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { BriefcaseIcon, CalendarIcon, DollarSignIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";

// Using a local job interface instead of importing from Jobs page
type JobStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

interface JobStatsProps {
  jobMetrics: {
    total: number;
    scheduled: number;
    in_progress: number;
    completed: number;
    cancelled: number;
    totalRevenue: number;
    completionRate: number;
  };
}

const JobStats = ({ jobMetrics }: JobStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <BriefcaseIcon className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Jobs</p>
              <p className="text-2xl font-bold">{jobMetrics.total}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-100 rounded-full">
              <DollarSignIcon className="h-5 w-5 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(jobMetrics.totalRevenue)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple-100 rounded-full">
              <CalendarIcon className="h-5 w-5 text-purple-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Upcoming Jobs</p>
              <p className="text-2xl font-bold">{jobMetrics.scheduled}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-yellow-100 rounded-full">
              <CheckCircleIcon className="h-5 w-5 text-yellow-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-2xl font-bold">{jobMetrics.completionRate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobStats;
