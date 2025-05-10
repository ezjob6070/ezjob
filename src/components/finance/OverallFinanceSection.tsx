
import React from "react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { DateRange } from "react-day-picker";
import { BadgeDollarSign, ChartBar, PhoneCall, TrendingUp, Calendar } from "lucide-react";
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

  // Mock data for call stats
  const callsData = {
    total: 154,
    converted: 98,
    followUps: 37,
    conversionRate: 63
  };

  // Mock data for labor costs
  const laborCosts = totalExpenses * 0.6;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between gap-4 items-start lg:items-center">
        <h2 className="text-xl font-bold tracking-tight">Financial Overview</h2>
        <DateRangeSelector date={date} setDate={setDate} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Revenue Card */}
        <CompactDashboardMetricCard
          title="Revenue"
          value={formatCurrency(totalRevenue)}
          icon={<BadgeDollarSign className="h-4 w-4 text-blue-600" />}
          description={`${formatCurrency(avgJobValue)} avg per job`}
          className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-all duration-300"
          trend={{ value: "78% of goal", isPositive: true }}
          dateRangeText={getDateRangeDisplay()}
        />
        
        {/* Net Profit Card */}
        <CompactDashboardMetricCard
          title="Net Profit"
          value={formatCurrency(totalProfit)}
          icon={<ChartBar className="h-4 w-4 text-green-600" />}
          description={`Labor costs: ${formatCurrency(laborCosts)}`}
          className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-all duration-300"
          trend={{ value: `${profitMargin.toFixed(0)}% margin`, isPositive: true }}
          dateRangeText={getDateRangeDisplay()}
        />
        
        {/* Total Calls Card */}
        <CompactDashboardMetricCard
          title="Total Calls"
          value={callsData.total.toString()}
          icon={<PhoneCall className="h-4 w-4 text-purple-600" />}
          description={`${callsData.followUps} follow-ups scheduled`}
          className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-all duration-300"
          trend={{ value: `${callsData.conversionRate}% conversion`, isPositive: true }}
          dateRangeText={getDateRangeDisplay()}
        />
        
        {/* Average Job Value Card */}
        <CompactDashboardMetricCard
          title="Avg Job Value"
          value={formatCurrency(avgJobValue)}
          icon={<TrendingUp className="h-4 w-4 text-amber-600" />}
          description="Per completed job"
          className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-all duration-300"
          trend={{ value: "+5.2% from last month", isPositive: true }}
          dateRangeText={getDateRangeDisplay()}
        />
        
        {/* Monthly Growth Card */}
        <CompactDashboardMetricCard
          title="Monthly Growth"
          value="+12.8%"
          icon={<Calendar className="h-4 w-4 text-indigo-600" />}
          description="Compared to last month"
          className="border-l-4 border-l-indigo-500 shadow-sm hover:shadow-md transition-all duration-300"
          trend={{ value: "Consistent uptrend", isPositive: true }}
          dateRangeText={getDateRangeDisplay()}
        />
      </div>
    </div>
  );
};

export default OverallFinanceSection;
