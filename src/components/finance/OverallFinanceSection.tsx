
import React from "react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import CompactDateRangePicker from "./CompactDateRangePicker";
import { format } from "date-fns";
import { 
  CalendarIcon,
  ArrowRightIcon
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
          <CardHeader>
            <CardTitle>Total Income</CardTitle>
            <CardDescription>
              Revenue from all sources
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-xs text-muted-foreground mt-1">
                      {date?.from && date?.to && (
                        <span>
                          {format(date.from, "MMM d")} - {format(date.to, "MMM d, yyyy")}
                        </span>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Data for selected date range</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalRevenue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
            <CardDescription>
              Expenses across all categories
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-xs text-muted-foreground mt-1">
                      {date?.from && date?.to && (
                        <span>
                          {format(date.from, "MMM d")} - {format(date.to, "MMM d, yyyy")}
                        </span>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Data for selected date range</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">-{formatCurrency(totalExpenses)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Company Profit</CardTitle>
            <CardDescription>
              Revenue after expenses
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-xs text-muted-foreground mt-1">
                      {date?.from && date?.to && (
                        <span>
                          {format(date.from, "MMM d")} - {format(date.to, "MMM d, yyyy")}
                        </span>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Data for selected date range</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalProfit >= 0 ? formatCurrency(totalProfit) : `-${formatCurrency(Math.abs(totalProfit))}`}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverallFinanceSection;
