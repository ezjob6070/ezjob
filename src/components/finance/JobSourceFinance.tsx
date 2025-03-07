
import { useState, useEffect } from "react";
import { SearchIcon, ArrowUpDown, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { FinancialTransaction, JobSource } from "@/types/finance";
import { JobSource as JobSourceType } from "@/types/jobSource";
import { DonutChart } from "@/components/DonutChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import EntityFilter, { Entity } from "@/components/finance/EntityFilter";
import { X } from "lucide-react";

type JobSourceFinanceRecord = {
  jobSource: JobSourceType | { id: string; name: string };
  totalJobs: number;
  totalRevenue: number;
  sourceCost: number;
  companyProfit: number;
  expenses: number;
};

type JobSourceFinanceProps = {
  jobSources: JobSourceType[] | JobSource[];
  transactions: FinancialTransaction[];
};

const JobSourceFinance = ({ jobSources, transactions }: JobSourceFinanceProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof JobSourceFinanceRecord>("totalRevenue");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [filteredTransactions, setFilteredTransactions] = useState<FinancialTransaction[]>(transactions);

  // Convert job sources to Entity type for the filter component
  const sourceEntities: Entity[] = jobSources.map(source => ({
    id: source.id,
    name: source.name,
  }));

  // Apply filters when selection or date range changes
  useEffect(() => {
    let filtered = [...transactions];
    
    // Filter by selected job sources
    if (selectedSourceIds.length > 0) {
      filtered = filtered.filter(transaction => 
        transaction.jobSourceId && selectedSourceIds.includes(transaction.jobSourceId)
      );
    }
    
    // Filter by date range
    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= dateRange.from! && 
               transactionDate <= dateRange.to!;
      });
    }
    
    setFilteredTransactions(filtered);
  }, [selectedSourceIds, dateRange, transactions]);

  // Calculate financial metrics for each job source
  const jobSourceFinances: JobSourceFinanceRecord[] = jobSources
    .filter(jobSource => selectedSourceIds.length === 0 || selectedSourceIds.includes(jobSource.id))
    .map(jobSource => {
      // Filter transactions for this job source
      const jobSourceTransactions = filteredTransactions.filter(
        t => t.jobSourceId === jobSource.id && t.status === "completed"
      );
      
      // Payment transactions
      const paymentTransactions = jobSourceTransactions.filter(t => t.category === "payment");
      
      // Expense transactions
      const expenseTransactions = jobSourceTransactions.filter(t => t.category === "expense");
      
      const totalJobs = paymentTransactions.length;
      const totalRevenue = paymentTransactions.reduce((sum, t) => sum + t.amount, 0);
      const expenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      // Calculate job source cost - assuming 5% of revenue as default if not available
      let sourceCost = 0;
      if ('paymentType' in jobSource && 'paymentValue' in jobSource) {
        sourceCost = jobSource.paymentType === "percentage" 
          ? totalRevenue * (jobSource.paymentValue / 100)
          : totalJobs * jobSource.paymentValue;
      } else {
        // Default calculation for basic job sources without payment structure
        sourceCost = totalRevenue * 0.05;
      }
      
      const companyProfit = totalRevenue - sourceCost - expenses;
      
      return {
        jobSource,
        totalJobs,
        totalRevenue,
        sourceCost,
        companyProfit,
        expenses
      };
    });

  // Calculate totals for profit visualization
  const totalRevenue = jobSourceFinances.reduce((sum, source) => sum + source.totalRevenue, 0);
  const totalSourceCost = jobSourceFinances.reduce((sum, source) => sum + source.sourceCost, 0);
  const totalExpenses = jobSourceFinances.reduce((sum, source) => sum + source.expenses, 0);
  const totalCompanyProfit = jobSourceFinances.reduce((sum, source) => sum + source.companyProfit, 0);

  // Filter by search term
  const filteredRecords = jobSourceFinances.filter(record => 
    record.jobSource.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort records
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    const valueA = a[sortColumn];
    const valueB = b[sortColumn];
    
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    }
    
    // Handle job source object differently
    if (sortColumn === "jobSource") {
      return sortDirection === "asc" 
        ? a.jobSource.name.localeCompare(b.jobSource.name)
        : b.jobSource.name.localeCompare(a.jobSource.name);
    }
    
    return 0;
  });

  const handleSort = (column: keyof JobSourceFinanceRecord) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc"); // Default to descending for new columns
    }
  };

  const formatDateRange = () => {
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`;
    }
    return "Select date range";
  };

  const handleClearFilters = () => {
    setSelectedSourceIds([]);
    setDateRange({ from: undefined, to: undefined });
    setSearchTerm("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-[180px]">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search job sources..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <EntityFilter
          entities={sourceEntities}
          selectedEntityIds={selectedSourceIds}
          onSelectionChange={setSelectedSourceIds}
          title="Select Job Sources"
          buttonText="Job Sources"
        />
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden md:inline">{formatDateRange()}</span>
              <span className="md:hidden">Date Range</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarComponent
              initialFocus
              mode="range"
              selected={dateRange as any}
              onSelect={setDateRange as any}
              numberOfMonths={2}
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        
        {(selectedSourceIds.length > 0 || dateRange.from || searchTerm) && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters} className="gap-1">
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* Profit Breakdown Chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profit Breakdown</CardTitle>
            <CardDescription>
              Distribution of revenue and costs
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center pt-4">
            <DonutChart
              data={[
                {
                  name: "Company Profit",
                  value: totalCompanyProfit,
                  color: "#8B5CF6"
                },
                {
                  name: "Source Costs",
                  value: totalSourceCost,
                  color: "#F97316"
                },
                {
                  name: "Expenses",
                  value: totalExpenses,
                  color: "#EF4444"
                }
              ]}
              title={formatCurrency(totalCompanyProfit)}
              subtitle="Company Profit"
              size={220}
            />
          </CardContent>
        </Card>

        {/* Expenses Breakdown Chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Expenses Breakdown</CardTitle>
            <CardDescription>
              Distribution of expenses by type
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center pt-4">
            <DonutChart
              data={[
                {
                  name: "Marketing",
                  value: totalExpenses * 0.45, // Estimated 45% marketing
                  color: "#EF4444"
                },
                {
                  name: "Referral Fees",
                  value: totalExpenses * 0.35, // Estimated 35% referral fees
                  color: "#F59E0B"
                },
                {
                  name: "Software",
                  value: totalExpenses * 0.20, // Estimated 20% software/tools
                  color: "#10B981"
                }
              ]}
              title={formatCurrency(totalExpenses)}
              subtitle="Total Expenses"
              size={220}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Job Sources</CardTitle>
            <CardDescription>
              Best performing job sources by revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedRecords.slice(0, 5).map((record) => (
                <div key={record.jobSource.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="font-medium">{record.jobSource.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {record.totalJobs} jobs
                    </span>
                    <span className="font-medium">
                      {formatCurrency(record.totalRevenue)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("jobSource")} className="cursor-pointer hover:bg-muted">
                <div className="flex items-center">
                  Job Source Name
                  {sortColumn === "jobSource" && (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("totalJobs")} className="cursor-pointer hover:bg-muted">
                <div className="flex items-center">
                  Jobs
                  {sortColumn === "totalJobs" && (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("totalRevenue")} className="cursor-pointer hover:bg-muted">
                <div className="flex items-center">
                  Total Revenue
                  {sortColumn === "totalRevenue" && (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("sourceCost")} className="cursor-pointer hover:bg-muted">
                <div className="flex items-center">
                  Source Cost
                  {sortColumn === "sourceCost" && (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("expenses")} className="cursor-pointer hover:bg-muted">
                <div className="flex items-center">
                  Expenses
                  {sortColumn === "expenses" && (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("companyProfit")} className="cursor-pointer hover:bg-muted">
                <div className="flex items-center">
                  Company Profit
                  {sortColumn === "companyProfit" && (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRecords.length > 0 ? (
              sortedRecords.map((record) => (
                <TableRow key={record.jobSource.id}>
                  <TableCell className="font-medium">{record.jobSource.name}</TableCell>
                  <TableCell>{record.totalJobs}</TableCell>
                  <TableCell>{formatCurrency(record.totalRevenue)}</TableCell>
                  <TableCell>{formatCurrency(record.sourceCost)}</TableCell>
                  <TableCell>{formatCurrency(record.expenses)}</TableCell>
                  <TableCell>{formatCurrency(record.companyProfit)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                  No job source financial data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default JobSourceFinance;
