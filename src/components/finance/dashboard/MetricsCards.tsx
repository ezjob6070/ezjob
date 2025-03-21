
import React from "react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { CircleDollarSign, BadgeDollarSign, PiggyBank } from "lucide-react";
import DashboardMetricCard from "@/components/DashboardMetricCard";
import { useWindowSize } from "@/hooks/use-window-size";

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
  const { width } = useWindowSize();
  const isMobile = width < 768;
  
  // Calculate trends (placeholder values)
  const revenueTrend = { value: "6.2%", isPositive: true };
  const earningsTrend = { value: "3.8%", isPositive: true };
  const profitTrend = { value: "5.1%", isPositive: true };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6 w-full max-w-full overflow-hidden">
      <DashboardMetricCard
        title="Total Income"
        value={formatCurrency(totalRevenue)}
        icon={<CircleDollarSign size={16} className="text-blue-500" />}
        description={`Period: ${dateRangeText || 'All time'}`}
        trend={revenueTrend}
        className="bg-gradient-to-br from-blue-50 via-blue-100/30 to-indigo-50 border-blue-200 hover:shadow-md transition-all h-[110px] w-full"
        variant="finance"
        valueClassName="text-blue-600 text-lg md:text-xl font-bold mt-1"
      >
        <p className="text-xs text-muted-foreground">All revenue from completed jobs</p>
      </DashboardMetricCard>
      
      <DashboardMetricCard
        title="Technician Earnings"
        value={formatCurrency(totalEarnings)}
        icon={<BadgeDollarSign size={16} className="text-red-500" />}
        description={`Period: ${dateRangeText || 'All time'}`}
        trend={earningsTrend}
        className="bg-gradient-to-br from-red-50 via-red-100/30 to-rose-50 border-red-200 hover:shadow-md transition-all h-[110px] w-full"
        variant="finance"
        valueClassName="text-red-600 text-lg md:text-xl font-bold mt-1"
      >
        <p className="text-xs text-muted-foreground">Total amounts paid to technicians</p>
      </DashboardMetricCard>
      
      <DashboardMetricCard
        title="Company Profit"
        value={formatCurrency(companyProfit)}
        icon={<PiggyBank size={16} className="text-emerald-500" />}
        description={`Period: ${dateRangeText || 'All time'}`}
        trend={profitTrend}
        className="bg-gradient-to-br from-emerald-50 via-emerald-100/30 to-teal-50 border-emerald-200 hover:shadow-md transition-all h-[110px] w-full"
        variant="finance"
        valueClassName="text-emerald-600 text-lg md:text-xl font-bold mt-1"
      >
        <p className="text-xs text-muted-foreground">Net profit after all expenses</p>
      </DashboardMetricCard>
    </div>
  );
};

export default DashboardMetrics;
