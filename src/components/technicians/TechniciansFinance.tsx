import { useState, useEffect } from "react";
import { ArrowUpDown, Calendar, List, Clock, Check, CalendarX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Technician } from "@/types/technician";
import { FinancialTransaction } from "@/types/finance";
import { calculateTechnicianProfit } from "@/components/dashboard/DashboardUtils";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SearchBar from "@/components/finance/filters/SearchBar";

type TechnicianFinanceRecord = {
  technician: Technician;
  totalJobs: number;
  totalRevenue: number;
  technicianPayment: number;
  companyProfit: number;
  expenses: number;
};

type TechniciansFinanceProps = {
  technicians: Technician[];
  transactions: FinancialTransaction[];
};

const TechniciansFinance = ({ technicians, transactions }: TechniciansFinanceProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof TechnicianFinanceRecord>("totalRevenue");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedTechnicianIds, setSelectedTechnicianIds] = useState<string[]>([]);
  const [jobStatus, setJobStatus] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [filteredTransactions, setFilteredTransactions] = useState<FinancialTransaction[]>(transactions);
  const [quoteStatusFilter, setQuoteStatusFilter] = useState<string>("all");

  // Convert technicians to Entity type for the filter component
  const technicianEntities: Entity[] = technicians.map(tech => ({
    id: tech.id,
    name: tech.name,
  }));

  // Apply filters when selection or date range changes
  useEffect(() => {
    let filtered = [...transactions];
    
    // Filter by selected technicians
    if (selectedTechnicianIds.length > 0) {
      filtered = filtered.filter(transaction => 
        transaction.technicianName && 
        technicians.some(tech => 
          tech.name === transaction.technicianName && 
          selectedTechnicianIds.includes(tech.id)
        )
      );
    }
    
    // Filter by job status
    if (jobStatus !== "all") {
      filtered = filtered.filter(transaction => transaction.status === jobStatus);
    }
    
    // Filter by date range
    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= dateRange.from! && 
               transactionDate <= dateRange.to!;
      });
    }

    // Filter by quote status if applicable
    if (quoteStatusFilter !== "all") {
      filtered = filtered.filter(transaction => {
        if (!transaction.quoteStatus) return quoteStatusFilter === "all";
        return transaction.quoteStatus === quoteStatusFilter;
      });
    }
    
    setFilteredTransactions(filtered);
  }, [selectedTechnicianIds, jobStatus, dateRange, transactions, technicians, quoteStatusFilter]);

  // Calculate financial metrics for each technician
  const technicianFinances: TechnicianFinanceRecord[] = technicians
    .filter(technician => selectedTechnicianIds.length === 0 || selectedTechnicianIds.includes(technician.id))
    .map(technician => {
      // Filter transactions for this technician
      const technicianTransactions = filteredTransactions.filter(
        t => t.technicianName === technician.name
      );
      
      // Payment transactions
      const paymentTransactions = technicianTransactions.filter(t => t.category === "payment");
      
      // Expense transactions
      const expenseTransactions = technicianTransactions.filter(t => t.category === "expense");
      
      const totalJobs = paymentTransactions.length;
      const totalRevenue = paymentTransactions.reduce((sum, t) => sum + t.amount, 0);
      const expenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      // Calculate technician payment based on their payment structure
      const technicianPayment = paymentTransactions.reduce((sum, t) => {
        if (t.technicianRate !== undefined) {
          return sum + calculateTechnicianProfit(
            t.amount, 
            t.technicianRate, 
            !!t.technicianRateIsPercentage
          );
        }
        return sum;
      }, 0);
      
      const companyProfit = totalRevenue - technicianPayment - expenses;
      
      return {
        technician,
        totalJobs,
        totalRevenue,
        technicianPayment,
        companyProfit,
        expenses
      };
    });

  // Calculate totals for profit visualization
  const totalRevenue = technicianFinances.reduce((sum, record) => sum + record.totalRevenue, 0);
  const totalTechnicianPayment = technicianFinances.reduce((sum, record) => sum + record.technicianPayment, 0);
  const totalExpenses = technicianFinances.reduce((sum, record) => sum + record.expenses, 0);
  const totalCompanyProfit = technicianFinances.reduce((sum, record) => sum + record.companyProfit, 0);

  // Filter by search term
  const filteredRecords = technicianFinances.filter(record => 
    record.technician.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort records
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    const valueA = a[sortColumn];
    const valueB = b[sortColumn];
    
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    }
    
    // Handle technician object differently
    if (sortColumn === "technician") {
      return sortDirection === "asc" 
        ? a.technician.name.localeCompare(b.technician.name)
        : b.technician.name.localeCompare(a.technician.name);
    }
    
    return 0;
  });

  const handleSort = (column: keyof TechnicianFinanceRecord) => {
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
    setSelectedTechnicianIds([]);
    setDateRange({ from: undefined, to: undefined });
    setSearchTerm("");
    setJobStatus("all");
    setQuoteStatusFilter("all");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-4">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Search technicians..."
          className="flex-1 min-w-[180px]"
        />
        
        <EntityFilter
          entities={technicianEntities}
          selectedEntityIds={selectedTechnicianIds}
          onSelectionChange={setSelectedTechnicianIds}
          title="Select Technicians"
          buttonText="Technicians"
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
        
        {/* Job Status Filter */}
        <Select value={jobStatus} onValueChange={setJobStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Job Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Jobs</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
          </SelectContent>
        </Select>
        
        {(selectedTechnicianIds.length > 0 || dateRange.from || searchTerm || jobStatus !== "all" || quoteStatusFilter !== "all") && (
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
              Distribution of revenue and payments
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
                  name: "Technician Payments",
                  value: totalTechnicianPayment,
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
                  name: "Materials",
                  value: totalExpenses * 0.6, // Estimated 60% for materials
                  color: "#EF4444"
                },
                {
                  name: "Transport",
                  value: totalExpenses * 0.25, // Estimated 25% for transport
                  color: "#F59E0B"
                },
                {
                  name: "Other",
                  value: totalExpenses * 0.15, // Estimated 15% for other expenses
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
            <CardTitle>Top Technicians</CardTitle>
            <CardDescription>
              Best performing technicians by revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedRecords.slice(0, 5).map((record) => (
                <div key={record.technician.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="font-medium">{record.technician.name}</span>
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
      
      {/* Quote Status Filter Tabs */}
      <div className="mb-4">
        <Tabs 
          defaultValue="all" 
          value={quoteStatusFilter} 
          onValueChange={setQuoteStatusFilter} 
          className="w-full"
        >
          <TabsList className="inline-flex h-9 items-center justify-start gap-1 px-1 py-1 bg-muted/50 w-auto">
            <TabsTrigger value="all" className="h-7 px-3 text-xs">
              <List className="h-3.5 w-3.5 mr-1.5" />
              <span>All Quotes</span>
            </TabsTrigger>
            <TabsTrigger value="pending" className="h-7 px-3 text-xs">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              <span>Pending</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="h-7 px-3 text-xs">
              <Check className="h-3.5 w-3.5 mr-1.5" />
              <span>Completed</span>
            </TabsTrigger>
            <TabsTrigger value="overdue" className="h-7 px-3 text-xs">
              <CalendarX className="h-3.5 w-3.5 mr-1.5" />
              <span>Overdue</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("technician")} className="cursor-pointer hover:bg-muted">
                <div className="flex items-center">
                  Technician Name
                  {sortColumn === "technician" && (
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
              <TableHead onClick={() => handleSort("technicianPayment")} className="cursor-pointer hover:bg-muted">
                <div className="flex items-center">
                  Technician Payment
                  {sortColumn === "technicianPayment" && (
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
                <TableRow key={record.technician.id}>
                  <TableCell className="font-medium">{record.technician.name}</TableCell>
                  <TableCell>{record.totalJobs}</TableCell>
                  <TableCell>{formatCurrency(record.totalRevenue)}</TableCell>
                  <TableCell>{formatCurrency(record.technicianPayment)}</TableCell>
                  <TableCell>{formatCurrency(record.expenses)}</TableCell>
                  <TableCell>{formatCurrency(record.companyProfit)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                  No technician financial data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TechniciansFinance;
