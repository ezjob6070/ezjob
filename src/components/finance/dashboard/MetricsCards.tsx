
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
        title="Total Income"
        value={formatCurrency(totalRevenue)}
        icon={<CircleDollarSign size={20} className="text-blue-500" />}
        description={`Period: ${dateRangeText || 'All time'}`}
        trend={revenueTrend}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 hover:shadow-md transition-all h-full min-h-[160px]"
        variant="finance"
        valueClassName="text-blue-600 text-2xl md:text-3xl"
      >
        <p className="text-sm text-muted-foreground mb-1">All revenue from completed jobs</p>
      </DashboardMetricCard>
      
      <DashboardMetricCard
        title="Technician Earnings"
        value={formatCurrency(totalEarnings)}
        icon={<BadgeDollarSign size={20} className="text-red-500" />}
        description={`Period: ${dateRangeText || 'All time'}`}
        trend={earningsTrend}
        className="bg-gradient-to-br from-red-50 to-rose-50 border-red-100 hover:shadow-md transition-all h-full min-h-[160px]"
        variant="finance"
        valueClassName="text-red-600 text-2xl md:text-3xl"
      >
        <p className="text-sm text-muted-foreground mb-1">Total amounts paid to technicians</p>
      </DashboardMetricCard>
      
      <DashboardMetricCard
        title="Company Profit"
        value={formatCurrency(companyProfit)}
        icon={<PiggyBank size={20} className="text-emerald-500" />}
        description={`Period: ${dateRangeText || 'All time'}`}
        trend={profitTrend}
        className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 hover:shadow-md transition-all h-full min-h-[160px]"
        variant="finance"
        valueClassName="text-emerald-600 text-2xl md:text-3xl"
      >
        <p className="text-sm text-muted-foreground mb-1">Net profit after all expenses</p>
      </DashboardMetricCard>
    </div>
  );
};

export default DashboardMetrics;
