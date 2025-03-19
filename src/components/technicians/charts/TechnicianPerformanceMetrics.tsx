
import React from "react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Technician } from "@/types/technician";
import { Trophy, Star, BarChart3, CircleDollarSign, TrendingUp } from "lucide-react";
import DashboardMetricCard from "@/components/DashboardMetricCard";

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
      <DashboardMetricCard
        title="Completed Jobs"
        value={technician.completedJobs || 0}
        icon={<Trophy size={20} className="text-indigo-500" />}
        description="Total completed jobs"
        trend={completedJobsTrend}
        className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100 hover:shadow-md transition-all"
        variant="finance"
      />
      
      <DashboardMetricCard
        title="Rating"
        value={`${(technician.rating || 0).toFixed(1)}★`}
        icon={<Star size={20} className="text-amber-500" />}
        description="Average client rating"
        trend={ratingTrend}
        className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100 hover:shadow-md transition-all"
        variant="finance"
      />
      
      <DashboardMetricCard
        title="Average Job Value"
        value={formatCurrency(metrics.revenue ? metrics.revenue / (technician.completedJobs || 1) : 0)}
        icon={<BarChart3 size={20} className="text-violet-500" />}
        description="Per completed job"
        trend={avgJobValueTrend}
        className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100 hover:shadow-md transition-all"
        variant="finance"
        valueClassName="text-violet-600"
      />
      
      <DashboardMetricCard
        title="Total Revenue"
        value={formatCurrency(metrics.revenue || 0)}
        icon={<CircleDollarSign size={20} className="text-sky-500" />}
        description="All completed jobs"
        trend={revenueTrend}
        className="bg-gradient-to-br from-sky-50 to-blue-50 border-sky-100 hover:shadow-md transition-all"
        variant="finance"
        valueClassName="text-blue-600"
      />

      <DashboardMetricCard
        title="Company Profit"
        value={formatCurrency(metrics.profit || 0)}
        icon={<TrendingUp size={20} className="text-emerald-500" />}
        description="Net company earnings"
        trend={profitTrend}
        className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 hover:shadow-md transition-all"
        variant="finance"
        valueClassName="text-emerald-600"
      />
    </div>
  );
};

export default TechnicianPerformanceMetrics;
