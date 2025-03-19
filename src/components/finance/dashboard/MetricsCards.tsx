
import React from "react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { CircleDollarSign, BadgeDollarSign, PiggyBank } from "lucide-react";
import DashboardMetricCard from "@/components/DashboardMetricCard";

interface DashboardMetricsProps {
  totalRevenue: number;
  totalEarnings: number;
  companyProfit: number;
  dateRangeText: string;
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  totalRevenue,
  totalEarnings,
  companyProfit,
  dateRangeText
}) => {
  // Calculate trends (placeholder values)
  const revenueTrend = { value: "6.2%", isPositive: true };
  const earningsTrend = { value: "3.8%", isPositive: true };
  const profitTrend = { value: "5.1%", isPositive: true };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <DashboardMetricCard
        title="Total Revenue"
        value={formatCurrency(totalRevenue)}
        icon={<CircleDollarSign size={20} className="text-blue-500" />}
        description={`Period: ${dateRangeText || 'All time'}`}
        trend={revenueTrend}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 hover:shadow-md transition-all"
        variant="finance"
      />
      
      <DashboardMetricCard
        title="Technician Earnings"
        value={formatCurrency(totalEarnings)}
        icon={<BadgeDollarSign size={20} className="text-violet-500" />}
        description={`Period: ${dateRangeText || 'All time'}`}
        trend={earningsTrend}
        className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100 hover:shadow-md transition-all"
        variant="finance"
      />
      
      <DashboardMetricCard
        title="Company Profit"
        value={formatCurrency(companyProfit)}
        icon={<PiggyBank size={20} className="text-emerald-500" />}
        description={`Period: ${dateRangeText || 'All time'}`}
        trend={profitTrend}
        className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 hover:shadow-md transition-all"
        variant="finance"
      />
    </div>
  );
};

export default DashboardMetrics;
