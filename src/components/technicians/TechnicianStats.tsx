
import { Card, CardContent } from "@/components/ui/card";
import { BarChartIcon, BriefcaseIcon, UsersIcon } from "lucide-react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Technician } from "@/types/technician";

type TechnicianStatsProps = {
  technicians: Technician[];
};

const TechnicianStats = ({ technicians }: TechnicianStatsProps) => {
  // Stats
  const activeTechnicians = technicians.filter(tech => tech.status === "active").length;
  const totalJobs = technicians.reduce((sum, tech) => sum + tech.completedJobs, 0);
  const totalRevenue = technicians.reduce((sum, tech) => sum + tech.totalRevenue, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Technicians</p>
              <p className="text-2xl font-bold text-blue-600">{activeTechnicians}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <UsersIcon className="h-5 w-5 text-blue-700" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed Jobs</p>
              <p className="text-2xl font-bold text-green-600">{totalJobs}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <BriefcaseIcon className="h-5 w-5 text-green-700" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-full">
              <BarChartIcon className="h-5 w-5 text-purple-700" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicianStats;
