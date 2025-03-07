
import { Card, CardContent } from "@/components/ui/card";
import { JobSource } from "@/types/jobSource";
import { BriefcaseIcon, DollarSignIcon, PercentIcon } from "lucide-react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";

interface JobSourceStatsProps {
  jobSources: JobSource[];
}

const JobSourceStats = ({ jobSources }: JobSourceStatsProps) => {
  const activeJobSources = jobSources.filter(source => source.isActive).length;
  const totalRevenue = jobSources.reduce((sum, source) => sum + source.totalRevenue, 0);
  const totalProfit = jobSources.reduce((sum, source) => sum + source.profit, 0);
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <BriefcaseIcon className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Sources</p>
              <p className="text-2xl font-bold">{activeJobSources}</p>
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
              <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple-100 rounded-full">
              <DollarSignIcon className="h-5 w-5 text-purple-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Profit</p>
              <p className="text-2xl font-bold">{formatCurrency(totalProfit)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-yellow-100 rounded-full">
              <PercentIcon className="h-5 w-5 text-yellow-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Profit Margin</p>
              <p className="text-2xl font-bold">{profitMargin.toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobSourceStats;
