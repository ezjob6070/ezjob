
import React from "react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { DateRange } from "react-day-picker";
import { Banknote, Wallet, PiggyBank, Phone, TrendingUp } from "lucide-react";
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

  // Calculate average job value
  const avgJobValue = totalRevenue > 0 ? totalRevenue / 42 : 0;
  
  // Sample call tracking data
  const callsData = {
    total: 154,
    converted: 98,
    scheduled: 37,
    missed: 19,
    conversionRate: 63
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between gap-4 items-start lg:items-center">
        <h2 className="text-xl font-bold tracking-tight">Financial Overview</h2>
        <DateRangeSelector date={date} setDate={setDate} />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <CompactDashboardMetricCard 
          title="Revenue"
          value={formatCurrency(totalRevenue)}
          icon={<Banknote className="h-4 w-4 text-blue-600" />}
          description={`${formatCurrency(avgJobValue)} avg per job`}
          trend={{ value: "8.3%", isPositive: true }}
          className="bg-gradient-to-br from-blue-50 to-blue-50/30 border-blue-100"
          valueClassName="text-blue-700 font-bold"
          dateRangeText="78% of quarterly goal"
        />
        
        <CompactDashboardMetricCard 
          title="Net Profit"
          value={formatCurrency(totalProfit)}
          icon={<PiggyBank className="h-4 w-4 text-emerald-600" />}
          description={`${profitMargin.toFixed(1)}% profit margin`}
          trend={{ value: "5.2%", isPositive: true }}
          className="bg-gradient-to-br from-emerald-50 to-emerald-50/30 border-emerald-100"
          valueClassName="text-emerald-700 font-bold"
          dateRangeText={`Labor ${formatCurrency(totalExpenses * 0.4)}`}
        />
        
        <CompactDashboardMetricCard 
          title="Total Calls"
          value={callsData.total.toString()}
          icon={<Phone className="h-4 w-4 text-indigo-600" />}
          description={`${callsData.conversionRate}% conversion rate`}
          trend={{ value: "3.8%", isPositive: true }}
          className="bg-gradient-to-br from-indigo-50 to-indigo-50/30 border-indigo-100"
          valueClassName="text-indigo-700 font-bold"
          dateRangeText={`${callsData.scheduled} follow-ups`}
        />
        
        <CompactDashboardMetricCard 
          title="Average Job Value"
          value={formatCurrency(avgJobValue)}
          icon={<Wallet className="h-4 w-4 text-purple-600" />}
          description="Per completed job"
          trend={{ value: "2.1%", isPositive: true }}
          className="bg-gradient-to-br from-purple-50 to-purple-50/30 border-purple-100"
          valueClassName="text-purple-700 font-bold"
          dateRangeText={getDateRangeDisplay()}
        />
        
        <CompactDashboardMetricCard 
          title="Monthly Growth"
          value="+5.7%"
          icon={<TrendingUp className="h-4 w-4 text-amber-600" />}
          description="Compared to last month"
          trend={{ value: "1.2%", isPositive: true }}
          className="bg-gradient-to-br from-amber-50 to-amber-50/30 border-amber-100"
          valueClassName="text-amber-700 font-bold"
          dateRangeText={`Target: 6%`}
        />
      </div>
    </div>
  );
};

export default OverallFinanceSection;
