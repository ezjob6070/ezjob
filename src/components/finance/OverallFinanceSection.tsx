
import React from "react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { DateRange } from "react-day-picker";
import { Banknote, Wallet, PiggyBank } from "lucide-react";
import DateRangeSelector from "@/components/finance/DateRangeSelector";
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
  const isProfitPositive = profitMargin > 25; // Example threshold
  
  // Format date range for display in description
  const getDateRangeDisplay = () => {
    if (!date?.from) return "All time";
    
    const from = date.from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const to = date.to ? date.to.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : from;
    
    return `${from} - ${to}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between gap-4 items-start lg:items-center">
        <h2 className="text-xl font-bold tracking-tight">Financial Overview</h2>
        <DateRangeSelector date={date} setDate={setDate} />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <CompactDashboardMetricCard 
          title="Total Income"
          value={formatCurrency(totalRevenue)}
          icon={<Banknote className="h-4 w-4 text-blue-600" />}
          description={`Period: ${getDateRangeDisplay()}`}
          trend={{ value: "8.3%", isPositive: true }}
          className="bg-gradient-to-br from-blue-50 to-blue-50/30 border-blue-100"
          valueClassName="text-blue-600"
        />
        
        <CompactDashboardMetricCard 
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon={<Wallet className="h-4 w-4 text-red-600" />}
          description={`Period: ${getDateRangeDisplay()}`}
          trend={{ value: "4.2%", isPositive: false }}
          className="bg-gradient-to-br from-red-50 to-red-50/30 border-red-100"
          valueClassName="text-red-600"
        />
        
        <CompactDashboardMetricCard 
          title="Net Profit"
          value={formatCurrency(totalProfit)}
          icon={<PiggyBank className="h-4 w-4 text-emerald-600" />}
          description={`${profitMargin.toFixed(1)}% profit margin`}
          trend={{ 
            value: `${Math.abs(profitMargin - 25).toFixed(1)}%`, 
            isPositive: isProfitPositive 
          }}
          className="bg-gradient-to-br from-emerald-50 to-emerald-50/30 border-emerald-100"
          valueClassName="text-emerald-600"
        />
        
        <CompactDashboardMetricCard 
          title="Average Job Value"
          value={formatCurrency(totalRevenue > 0 ? totalRevenue / 42 : 0)}
          icon={<Banknote className="h-4 w-4 text-purple-600" />}
          description="Per completed job"
          className="bg-gradient-to-br from-purple-50 to-purple-50/30 border-purple-100"
          valueClassName="text-purple-600"
        />
        
        <CompactDashboardMetricCard 
          title="Monthly Growth"
          value="+5.7%"
          icon={<TrendingUp className="h-4 w-4 text-indigo-600" />}
          description="Compared to last month"
          className="bg-gradient-to-br from-indigo-50 to-indigo-50/30 border-indigo-100"
          valueClassName="text-indigo-600"
        />
      </div>
    </div>
  );
};

export default OverallFinanceSection;
