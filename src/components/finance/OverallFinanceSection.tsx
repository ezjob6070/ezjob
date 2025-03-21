
import React from "react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { DateRange } from "react-day-picker";
import { Banknote, Wallet, PiggyBank } from "lucide-react";
import DateRangeSelector from "@/components/finance/DateRangeSelector";
import { Card, CardContent } from "@/components/ui/card";

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
        <Card className="h-[110px] bg-gradient-to-br from-blue-50 via-blue-100/30 to-indigo-50 border-blue-200 hover:shadow-md transition-all">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-900">Total Income</h3>
            <p className="text-2xl font-bold text-blue-600 mt-1">{formatCurrency(totalRevenue)}</p>
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground mt-1">
                Period: {getDateRangeDisplay()}
              </p>
              <div className="flex items-center bg-blue-100 text-blue-600 text-xs font-medium p-1 rounded">
                <Banknote size={12} className="mr-1" />
                <span>+8.3%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="h-[110px] bg-gradient-to-br from-red-50 via-red-100/30 to-rose-50 border-red-200 hover:shadow-md transition-all">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-900">Total Expenses</h3>
            <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(totalExpenses)}</p>
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground mt-1">
                Period: {getDateRangeDisplay()}
              </p>
              <div className="flex items-center bg-red-100 text-red-600 text-xs font-medium p-1 rounded">
                <Wallet size={12} className="mr-1" />
                <span>+4.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="h-[110px] bg-gradient-to-br from-emerald-50 via-emerald-100/30 to-teal-50 border-emerald-200 hover:shadow-md transition-all">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-900">Net Profit</h3>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(totalProfit)}</p>
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground mt-1">
                {profitMargin.toFixed(1)}% profit margin
              </p>
              <div className="flex items-center bg-emerald-100 text-emerald-600 text-xs font-medium p-1 rounded">
                <PiggyBank size={12} className="mr-1" />
                <span>{isProfitPositive ? "+" : "-"}{Math.abs(profitMargin - 25).toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverallFinanceSection;
