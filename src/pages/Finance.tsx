
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, FilterIcon, Calendar, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { 
  sampleTransactions, 
  getDateRangeForTimeFrame,
  generateFinancialReport
} from "@/data/finances";
import { TimeFrame, FinancialReport } from "@/types/finance";
import { Input } from "@/components/ui/input";
import { DonutChart } from "@/components/DonutChart";
import FinancialMetricsCards from "@/components/finance/FinancialMetricsCards";
import FinancialTransactionsTable from "@/components/finance/FinancialTransactionsTable";
import { cn } from "@/lib/utils";

const Finance = () => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("month");
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (timeFrame !== "custom") {
      const { startDate, endDate } = getDateRangeForTimeFrame(timeFrame as Exclude<TimeFrame, "custom">);
      setDateRange({ from: startDate, to: endDate });
      const generatedReport = generateFinancialReport(
        sampleTransactions,
        startDate,
        endDate,
        timeFrame
      );
      setReport(generatedReport);
    } else if (dateRange.from && dateRange.to) {
      const generatedReport = generateFinancialReport(
        sampleTransactions,
        dateRange.from,
        dateRange.to,
        "custom"
      );
      setReport(generatedReport);
    }
  }, [timeFrame, dateRange.from, dateRange.to]);

  const handleTabChange = (value: string) => {
    setTimeFrame(value as TimeFrame);
  };

  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range);
    if (range.from && range.to) {
      setTimeFrame("custom");
    }
  };

  const formatDateRange = () => {
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`;
    }
    return "Select date range";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Financial Reports</h1>
        
        <div className="flex flex-wrap items-center gap-2">
          <Tabs 
            value={timeFrame} 
            onValueChange={handleTabChange}
            className="w-full md:w-auto"
          >
            <TabsList className="grid grid-cols-4 w-full md:w-auto">
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span className="hidden md:inline">{formatDateRange()}</span>
                <span className="md:hidden">Date Range</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                initialFocus
                mode="range"
                selected={dateRange as any}
                onSelect={handleDateRangeChange as any}
                numberOfMonths={2}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {report && (
        <>
          <FinancialMetricsCards report={report} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Transactions</CardTitle>
                <CardDescription>
                  Transaction history for the selected period
                </CardDescription>
                <div className="mt-2 relative">
                  <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <FinancialTransactionsTable 
                  transactions={report.transactions} 
                  searchTerm={searchTerm}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Profit Breakdown</CardTitle>
                <CardDescription>
                  Distribution of revenue and expenses
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center pt-4">
                <DonutChart
                  data={[
                    {
                      name: "Company Profit",
                      value: report.companyProfit,
                      color: "#8B5CF6"
                    },
                    {
                      name: "Technician Payments",
                      value: report.technicianPayments,
                      color: "#F97316"
                    },
                    {
                      name: "Expenses",
                      value: report.totalExpenses,
                      color: "#EF4444"
                    }
                  ]}
                  title={formatCurrency(report.companyProfit)}
                  subtitle="Company Profit"
                  size={220}
                />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Finance;
