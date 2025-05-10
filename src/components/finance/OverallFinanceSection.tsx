
import React from "react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { DateRange } from "react-day-picker";
import { BadgeDollarSign, ChartBar, Minus } from "lucide-react";
import DateRangeSelector from "@/components/finance/DateRangeSelector";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import CompactDashboardMetricCard from "@/components/CompactDashboardMetricCard";

interface OverallFinanceSectionProps {
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

const OverallFinanceSection: React.FC<OverallFinanceSectionProps> = ({
  totalRevenue,
  totalExpenses,
  totalProfit,
  date,
  setDate
}) => {
  // Calculate profit margin for trend display
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  const avgJobValue = totalRevenue > 0 ? totalRevenue / 42 : 0;
  
  // Format date range for display in description
  const getDateRangeDisplay = () => {
    if (!date?.from) return "All time";
    
    const from = date.from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const to = date.to ? date.to.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : from;
    
    return `${from} - ${to}`;
  };

  // Labor costs data (60% of expenses)
  const laborCosts = totalExpenses * 0.6;
  const materialCosts = totalExpenses - laborCosts;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between gap-4 items-start lg:items-center">
        <h2 className="text-xl font-bold tracking-tight">Financial Overview</h2>
        <DateRangeSelector date={date} setDate={setDate} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Revenue Card */}
        <CompactDashboardMetricCard
          title="Revenue"
          value={formatCurrency(totalRevenue)}
          description={`Average per job: ${formatCurrency(avgJobValue)}`}
          icon={<BadgeDollarSign className="h-4 w-4 text-blue-600" />}
          trend={{ value: "78% of goal", isPositive: true }}
          dateRangeText={getDateRangeDisplay()}
        />

        {/* Net Profit Card */}
        <CompactDashboardMetricCard
          title="Net Profit"
          value={formatCurrency(totalProfit)}
          description={`Labor costs: ${formatCurrency(laborCosts)}`}
          icon={<ChartBar className="h-4 w-4 text-green-600" />}
          trend={{ value: `${profitMargin.toFixed(0)}% margin`, isPositive: true }}
          dateRangeText={getDateRangeDisplay()}
        />

        {/* Expenses Card - New with red text and minus sign */}
        <CompactDashboardMetricCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          description={`Materials: ${formatCurrency(materialCosts)}`}
          icon={<Minus className="h-4 w-4 text-red-600" />}
          trend={{ value: "40% of revenue", isPositive: false }}
          dateRangeText={getDateRangeDisplay()}
          isNegative={true}
        />
      </div>
    </div>
  );
};

export default OverallFinanceSection;
