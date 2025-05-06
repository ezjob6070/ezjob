
import { DateRange } from "react-day-picker";
import { DollarSign, TrendingDown, Building, Clock } from "lucide-react";
import DashboardMetricCard from "@/components/DashboardMetricCard";
import { OfficeExpense } from "@/types/finance";
import { format } from "date-fns";

type OfficeExpensesOverviewProps = {
  totalExpenses: number;
  monthlyAverage: number;
  largestExpense: OfficeExpense | null;
  mostRecentExpense: OfficeExpense | null;
  activeCategory: string | null;
  date: DateRange | undefined;
};

const OfficeExpensesOverview = ({ 
  totalExpenses,
  monthlyAverage,
  largestExpense,
  mostRecentExpense,
  activeCategory,
  date
}: OfficeExpensesOverviewProps) => {
  // Format date range for display
  const dateRangeText = date?.from && date?.to 
    ? `${format(date.from, "MMM d, yyyy")} - ${format(date.to, "MMM d, yyyy")}`
    : "All time";
    
  // Format category filter for display
  const filterDescription = activeCategory 
    ? `Filtered by ${activeCategory}`
    : `All expense categories`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardMetricCard
        title="Total Expenses"
        value={`$${totalExpenses.toLocaleString()}`}
        description={filterDescription}
        icon={<DollarSign className="h-4 w-4" />}
        trend={{ value: dateRangeText, isPositive: false, showArrow: false }}
      />
      
      <DashboardMetricCard
        title="Monthly Average"
        value={`$${monthlyAverage.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
        description="Based on selected period"
        icon={<TrendingDown className="h-4 w-4" />}
      />
      
      <DashboardMetricCard
        title="Largest Expense"
        value={largestExpense ? `$${largestExpense.amount.toLocaleString()}` : "$0"}
        description={largestExpense ? largestExpense.description : "No expenses found"}
        icon={<Building className="h-4 w-4" />}
      />
      
      <DashboardMetricCard
        title="Most Recent"
        value={mostRecentExpense ? `$${mostRecentExpense.amount.toLocaleString()}` : "$0"}
        description={mostRecentExpense 
          ? `${mostRecentExpense.description} (${format(new Date(mostRecentExpense.date), "MMM d")})`
          : "No expenses found"
        }
        icon={<Clock className="h-4 w-4" />}
      />
    </div>
  );
};

export default OfficeExpensesOverview;
