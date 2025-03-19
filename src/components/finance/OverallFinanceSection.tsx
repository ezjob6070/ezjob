
import React from "react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { DateRange } from "react-day-picker";
import CompactDateRangePicker from "./CompactDateRangePicker";
import { format } from "date-fns";
import { 
  CalendarIcon,
  ArrowRightIcon,
  DollarSignIcon,
  TrendingDownIcon,
  PiggyBankIcon
} from "lucide-react";
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
  // Format the date range for display
  const getDateRangeText = () => {
    if (!date?.from) return "No date selected";
    if (!date.to) return `${format(date.from, "MMM dd, yyyy")}`;
    return (
      <div className="flex items-center text-sm text-muted-foreground">
        <CalendarIcon className="h-4 w-4 mr-1" />
        <span>{format(date.from, "MMM dd, yyyy")}</span>
        <ArrowRightIcon className="h-3 w-3 mx-1" />
        <span>{format(date.to, "MMM dd, yyyy")}</span>
      </div>
    );
  };

  const dateRangeText = date?.from && date?.to ? 
    `${format(date.from, "MMM d")} - ${format(date.to, "MMM d, yyyy")}` : 
    "All time";

  return (
    <div className="mb-8">
      <div className="mb-6">
        <div className="flex flex-col items-center">
          <div className="w-full flex justify-center mb-2">
            <CompactDateRangePicker date={date} setDate={setDate} />
          </div>
          <div className="mb-4">
            {getDateRangeText()}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <DollarSignIcon className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-black">Total Income</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                <p className="text-xs text-muted-foreground mt-1">{dateRangeText}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-100 rounded-full">
                <TrendingDownIcon className="h-5 w-5 text-red-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-black">Total Expenses</p>
                <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
                <p className="text-xs text-muted-foreground mt-1">{dateRangeText}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-full">
                <PiggyBankIcon className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-black">Net Company Profit</p>
                <p className={`text-2xl font-bold ${totalProfit >= 0 ? '' : 'text-red-600'}`}>
                  {totalProfit >= 0 ? formatCurrency(totalProfit) : `-${formatCurrency(Math.abs(totalProfit))}`}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{dateRangeText}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverallFinanceSection;
