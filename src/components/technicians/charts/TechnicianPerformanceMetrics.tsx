
import React from "react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Technician } from "@/types/technician";
import { Trophy, Star, BarChart3, CircleDollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface TechnicianPerformanceMetricsProps {
  technician: Technician;
  metrics: {
    revenue?: number;
    earnings?: number;
    expenses?: number;
    profit?: number;
    partsValue?: number;
  };
  jobStatus?: string;
  onJobStatusChange?: (status: string) => void;
}

const TechnicianPerformanceMetrics: React.FC<TechnicianPerformanceMetricsProps> = ({
  technician,
  metrics,
  jobStatus = "all",
  onJobStatusChange
}) => {
  if (!technician || !metrics) return null;

  // Calculate trends (mock data for demonstration)
  const completedJobsTrend = { value: "5.2%", isPositive: true };
  const ratingTrend = { value: "0.3%", isPositive: true };
  const avgJobValueTrend = { value: "3.1%", isPositive: true };
  const revenueTrend = { value: "7.5%", isPositive: true };
  const profitTrend = { value: "6.8%", isPositive: true };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full max-w-full overflow-x-hidden">
      <Card className="h-[110px] bg-gradient-to-br from-indigo-50 via-indigo-100/30 to-purple-50 border-indigo-200 hover:shadow-md transition-all">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-900">Completed Jobs</h3>
          <p className="text-2xl font-bold text-indigo-600 mt-1">{technician.completedJobs || 0}</p>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground mt-1">
              Successfully finished services
            </p>
            <div className="flex items-center bg-indigo-100 text-indigo-600 text-xs font-medium p-1 rounded">
              <Trophy size={12} className="mr-1" />
              <span>+{completedJobsTrend.value}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="h-[110px] bg-gradient-to-br from-amber-50 via-amber-100/30 to-yellow-50 border-amber-200 hover:shadow-md transition-all">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-900">Rating</h3>
          <p className="text-2xl font-bold text-amber-600 mt-1">{(technician.rating || 0).toFixed(1)}★</p>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground mt-1">
              Customer satisfaction score
            </p>
            <div className="flex items-center bg-amber-100 text-amber-600 text-xs font-medium p-1 rounded">
              <Star size={12} className="mr-1" />
              <span>+{ratingTrend.value}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="h-[110px] bg-gradient-to-br from-violet-50 via-violet-100/30 to-purple-50 border-violet-200 hover:shadow-md transition-all">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-900">Average Job Value</h3>
          <p className="text-2xl font-bold text-violet-600 mt-1">{formatCurrency(metrics.revenue ? metrics.revenue / (technician.completedJobs || 1) : 0)}</p>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground mt-1">
              Average revenue per service
            </p>
            <div className="flex items-center bg-violet-100 text-violet-600 text-xs font-medium p-1 rounded">
              <BarChart3 size={12} className="mr-1" />
              <span>+{avgJobValueTrend.value}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="h-[110px] bg-gradient-to-br from-blue-50 via-blue-100/30 to-sky-50 border-blue-200 hover:shadow-md transition-all">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-900">Total Income</h3>
          <p className="text-2xl font-bold text-blue-600 mt-1">{formatCurrency(metrics.revenue || 0)}</p>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground mt-1">
              Gross revenue generated
            </p>
            <div className="flex items-center bg-blue-100 text-blue-600 text-xs font-medium p-1 rounded">
              <CircleDollarSign size={12} className="mr-1" />
              <span>+{revenueTrend.value}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="h-[110px] bg-gradient-to-br from-emerald-50 via-emerald-100/30 to-teal-50 border-emerald-200 hover:shadow-md transition-all">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-900">Company Profit</h3>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(metrics.profit || 0)}</p>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground mt-1">
              Profit after expenses
            </p>
            <div className="flex items-center bg-emerald-100 text-emerald-600 text-xs font-medium p-1 rounded">
              <TrendingUp size={12} className="mr-1" />
              <span>+{profitTrend.value}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicianPerformanceMetrics;
