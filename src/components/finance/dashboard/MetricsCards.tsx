
import React from "react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { CircleDollarSign, BadgeDollarSign, PiggyBank } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
      <Card className="h-[110px] bg-gradient-to-br from-blue-50 via-blue-100/30 to-indigo-50 border-blue-200 hover:shadow-md transition-all">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-900">Total Income</h3>
          <p className="text-2xl font-bold text-blue-600 mt-1">{formatCurrency(totalRevenue)}</p>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground mt-1">
              Period: {dateRangeText || 'All time'}
            </p>
            <div className="flex items-center bg-blue-100 text-blue-600 text-xs font-medium p-1 rounded">
              <CircleDollarSign size={12} className="mr-1" />
              <span>+{revenueTrend.value}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="h-[110px] bg-gradient-to-br from-red-50 via-red-100/30 to-rose-50 border-red-200 hover:shadow-md transition-all">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-900">Technician Earnings</h3>
          <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(totalEarnings)}</p>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground mt-1">
              Period: {dateRangeText || 'All time'}
            </p>
            <div className="flex items-center bg-red-100 text-red-600 text-xs font-medium p-1 rounded">
              <BadgeDollarSign size={12} className="mr-1" />
              <span>+{earningsTrend.value}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="h-[110px] bg-gradient-to-br from-emerald-50 via-emerald-100/30 to-teal-50 border-emerald-200 hover:shadow-md transition-all">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-900">Company Profit</h3>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(companyProfit)}</p>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground mt-1">
              Period: {dateRangeText || 'All time'}
            </p>
            <div className="flex items-center bg-emerald-100 text-emerald-600 text-xs font-medium p-1 rounded">
              <PiggyBank size={12} className="mr-1" />
              <span>+{profitTrend.value}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMetrics;
