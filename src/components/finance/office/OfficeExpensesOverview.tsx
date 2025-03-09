
import { DateRange } from "react-day-picker";
import { DollarSign, TrendingDown, Building, Clock } from "lucide-react";
import DashboardMetricCard from "@/components/DashboardMetricCard";

type OfficeExpensesOverviewProps = {
  date: DateRange | undefined;
  activeCategory: string | null;
};

const OfficeExpensesOverview = ({ date, activeCategory }: OfficeExpensesOverviewProps) => {
  // This would normally come from your data hooks
  const totalExpenses = 12540.75;
  const monthlyAverage = 4180.25;
  const largestExpense = 2850.00;
  const recentExpense = 420.50;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardMetricCard
        title="Total Expenses"
        value={`$${totalExpenses.toLocaleString()}`}
        description={activeCategory ? `Filtered by ${activeCategory}` : "All categories"}
        icon={<DollarSign className="h-4 w-4" />}
        trend={{ value: "8.5%", isPositive: false }}
      />
      
      <DashboardMetricCard
        title="Monthly Average"
        value={`$${monthlyAverage.toLocaleString()}`}
        description="Last 3 months"
        icon={<TrendingDown className="h-4 w-4" />}
      />
      
      <DashboardMetricCard
        title="Largest Expense"
        value={`$${largestExpense.toLocaleString()}`}
        description="Office Rent"
        icon={<Building className="h-4 w-4" />}
      />
      
      <DashboardMetricCard
        title="Most Recent"
        value={`$${recentExpense.toLocaleString()}`}
        description="Office Supplies"
        icon={<Clock className="h-4 w-4" />}
      />
    </div>
  );
};

export default OfficeExpensesOverview;
