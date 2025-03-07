
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Download, Users, BriefcaseIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { 
  sampleTransactions, 
  getDateRangeForTimeFrame,
  generateFinancialReport,
  filterTransactionsByDateRange
} from "@/data/finances";
import { TimeFrame, FinancialReport } from "@/types/finance";
import { DonutChart } from "@/components/DonutChart";
import FinancialMetricsCards from "@/components/finance/FinancialMetricsCards";
import FinancialTransactionsTable from "@/components/finance/FinancialTransactionsTable";
import TechniciansFinance from "@/components/technicians/TechniciansFinance";
import JobSourceFinance from "@/components/finance/JobSourceFinance";
import { initialTechnicians } from "@/data/technicians";
import { cn } from "@/lib/utils";
import { useFinanceFilters } from "@/components/finance/useFinanceFilters";
import FinanceFilters from "@/components/finance/FinanceFilters";

// Sample job sources for the filters
const sampleJobSources = [
  { id: "js1", name: "Website", paymentType: "percentage", paymentValue: 5, isActive: true, totalJobs: 45, totalRevenue: 56000, profit: 48000 },
  { id: "js2", name: "Referral", paymentType: "fixed", paymentValue: 50, isActive: true, totalJobs: 32, totalRevenue: 42000, profit: 38000 },
  { id: "js3", name: "Google Ads", paymentType: "percentage", paymentValue: 10, isActive: true, totalJobs: 28, totalRevenue: 35000, profit: 25000 },
  { id: "js4", name: "Social Media", paymentType: "percentage", paymentValue: 7, isActive: true, totalJobs: 22, totalRevenue: 28000, profit: 22000 },
  { id: "js5", name: "Direct Call", paymentType: "fixed", paymentValue: 0, isActive: true, totalJobs: 15, totalRevenue: 18000, profit: 18000 },
];

const Finance = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("month");
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  // Use the new finance filters hook
  const {
    filters,
    setFilters,
    filteredTransactions,
    resetFilters
  } = useFinanceFilters(sampleTransactions);

  useEffect(() => {
    if (timeFrame !== "custom") {
      const { startDate, endDate } = getDateRangeForTimeFrame(timeFrame as Exclude<TimeFrame, "custom">);
      setDateRange({ from: startDate, to: endDate });
      
      // Set the date filter in our filters state
      if (timeFrame === "day") {
        setFilters({ ...filters, dateFilter: "today" });
      } else if (timeFrame === "week") {
        setFilters({ ...filters, dateFilter: "thisWeek" });
      } else if (timeFrame === "month") {
        setFilters({ ...filters, dateFilter: "thisMonth" });
      } else if (timeFrame === "year") {
        setFilters({ ...filters, dateFilter: "all" });
      }
      
      const generatedReport = generateFinancialReport(
        sampleTransactions,
        startDate,
        endDate,
        timeFrame
      );
      setReport(generatedReport);
    } else if (dateRange.from && dateRange.to) {
      // When using custom date range
      setFilters({
        ...filters,
        dateFilter: "custom",
        customDateRange: { from: dateRange.from, to: dateRange.to }
      });
      
      const generatedReport = generateFinancialReport(
        sampleTransactions,
        dateRange.from,
        dateRange.to,
        "custom"
      );
      setReport(generatedReport);
    }
  }, [timeFrame, dateRange.from, dateRange.to]);

  // Update report when filters change
  useEffect(() => {
    if (report) {
      // Create a new report with filtered transactions
      const updatedReport = {
        ...report,
        transactions: filteredTransactions
      };
      
      // Recalculate financial metrics based on filtered transactions
      let totalRevenue = 0;
      let totalExpenses = 0;
      let technicianPayments = 0;
      
      filteredTransactions.forEach(transaction => {
        if (transaction.status === "completed") {
          if (transaction.category === "payment") {
            totalRevenue += transaction.amount;
            
            if (transaction.technicianName && transaction.technicianRate !== undefined) {
              const technicianProfit = transaction.technicianRateIsPercentage
                ? transaction.amount * (transaction.technicianRate / 100)
                : transaction.technicianRate;
              
              technicianPayments += technicianProfit;
            }
          } else if (transaction.category === "expense") {
            totalExpenses += transaction.amount;
          } else if (transaction.category === "refund") {
            totalRevenue -= transaction.amount;
          }
        }
      });
      
      const companyProfit = totalRevenue - totalExpenses - technicianPayments;
      
      setReport({
        ...updatedReport,
        totalRevenue,
        totalExpenses,
        companyProfit,
        technicianPayments
      });
    }
  }, [filteredTransactions]);

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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="technicians">Technicians Finance</TabsTrigger>
          <TabsTrigger value="jobSources">Job Sources Finance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          {report && (
            <>
              <FinanceFilters 
                filters={filters}
                setFilters={setFilters}
                jobSources={sampleJobSources}
                resetFilters={resetFilters}
              />
              
              <div className="mt-6">
                <FinancialMetricsCards report={report} />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Transactions</CardTitle>
                    <CardDescription>
                      Transaction history for the selected period
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FinancialTransactionsTable 
                      transactions={report.transactions} 
                      searchTerm={filters.searchTerm}
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
        </TabsContent>
        
        <TabsContent value="technicians">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Technicians Financial Performance
              </CardTitle>
              <CardDescription>
                Track revenue, payments, and company profit per technician
              </CardDescription>
            </CardHeader>
            <CardContent>
              {report && (
                <TechniciansFinance 
                  technicians={initialTechnicians} 
                  transactions={filteredTransactions} 
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="jobSources">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BriefcaseIcon className="h-5 w-5" />
                Job Sources Financial Performance
              </CardTitle>
              <CardDescription>
                Track revenue, costs, and company profit per job source
              </CardDescription>
            </CardHeader>
            <CardContent>
              {report && (
                <JobSourceFinance 
                  jobSources={sampleJobSources} 
                  transactions={filteredTransactions} 
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finance;
