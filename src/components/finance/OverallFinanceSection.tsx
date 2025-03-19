
import React from "react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { DateRange } from "react-day-picker";
import { Banknote, Wallet, PiggyBank } from "lucide-react";
import DateRangeSelector from "@/components/finance/DateRangeSelector";
import DashboardMetricCard from "@/components/DashboardMetricCard";

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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <DashboardMetricCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={<Banknote size={20} className="text-blue-500" />}
          description={`Period: ${getDateRangeDisplay()}`}
          trend={{ value: "8.3%", isPositive: true }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 hover:shadow-md transition-all"
          variant="finance"
        />
        
        <DashboardMetricCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon={<Wallet size={20} className="text-red-500" />}
          description={`Period: ${getDateRangeDisplay()}`}
          trend={{ value: "4.2%", isPositive: false }}
          className="bg-gradient-to-br from-red-50 to-rose-50 border-red-100 hover:shadow-md transition-all"
          variant="finance"
        />
        
        <DashboardMetricCard
          title="Net Profit"
          value={formatCurrency(totalProfit)}
          icon={<PiggyBank size={20} className="text-emerald-500" />}
          description={`${profitMargin.toFixed(1)}% profit margin`}
          trend={{ value: `${Math.abs(profitMargin - 25).toFixed(1)}%`, isPositive: isProfitPositive }}
          className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 hover:shadow-md transition-all"
          variant="finance"
        />
      </div>
    </div>
  );
};

export default OverallFinanceSection;
