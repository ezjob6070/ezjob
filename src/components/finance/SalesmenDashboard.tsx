
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Download, Filter, FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";
import { Technician } from "@/types/technician";
import DateRangeSelector from "./DateRangeSelector";

interface SalesmenDashboardProps {
  dateRange?: DateRange;
  setDateRange?: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

const SalesmenDashboard: React.FC<SalesmenDashboardProps> = ({ dateRange, setDateRange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { technicians, jobs } = useGlobalState();
  
  // Filter technicians that are salesmen
  const salesmen = technicians.filter((tech) => tech.role === "salesman");

  // Filter by search term
  const filteredSalesmen = salesmen.filter((salesman) =>
    salesman.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salesman.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salesman.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salesman.subRole?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get jobs within the date range
  const filteredJobs = jobs.filter(job => {
    const jobDate = job.scheduledDate ? new Date(job.scheduledDate) : new Date(job.date);
    const isInDateRange = 
      (!dateRange?.from || jobDate >= dateRange.from) && 
      (!dateRange?.to || jobDate <= dateRange.to);
    
    return isInDateRange;
  });

  // Calculate sales metrics for each salesman
  const salesmenMetrics = salesmen.map(salesman => {
    // For demonstration, assign jobs randomly to salesmen based on their ID
    // In a real app, you would have a direct relationship between jobs and salesmen
    const associatedJobs = filteredJobs.filter(
      job => job.id.charCodeAt(0) % salesmen.length === salesmen.findIndex(s => s.id === salesman.id)
    );
    
    const totalRevenue = associatedJobs.reduce(
      (sum, job) => sum + (job.actualAmount || job.amount), 0
    );
    
    // Calculate commission based on salesman's payment type
    let commission = 0;
    if (salesman.paymentType === "percentage") {
      commission = totalRevenue * (salesman.paymentRate / 100);
    } else if (salesman.paymentType === "flat") {
      commission = associatedJobs.length * salesman.paymentRate;
    } else if (salesman.paymentType === "hourly") {
      // Assuming sales typically takes 1 hour per job
      commission = associatedJobs.length * salesman.hourlyRate;
    } else if (salesman.paymentType === "salary") {
      // Just use a fixed amount for the period if salaried
      commission = salesman.paymentRate;
    }
    
    // Add incentives if applicable
    if (salesman.incentiveType === "commission" && salesman.incentiveAmount) {
      commission += totalRevenue * (salesman.incentiveAmount / 100);
    } else if (salesman.incentiveType === "bonus" && salesman.incentiveAmount) {
      commission += salesman.incentiveAmount;
    }
    
    const averageSaleValue = associatedJobs.length > 0 
      ? totalRevenue / associatedJobs.length 
      : 0;
    
    return {
      ...salesman,
      totalRevenue,
      commission,
      salesCount: associatedJobs.length,
      averageSaleValue,
      profit: totalRevenue - commission
    };
  });

  // Calculate totals
  const totalSales = salesmenMetrics.reduce((sum, sm) => sum + sm.salesCount, 0);
  const totalRevenue = salesmenMetrics.reduce((sum, sm) => sum + sm.totalRevenue, 0);
  const totalCommissions = salesmenMetrics.reduce((sum, sm) => sum + sm.commission, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Salesmen Performance</h1>
          <p className="text-muted-foreground">Monitor sales performance, commissions, and metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <DateRangeSelector date={dateRange} setDate={setDateRange} />
          <Button variant="outline" className="gap-2">
            <Download size={16} /> Export
          </Button>
          <Button variant="outline" className="gap-2">
            <FileText size={16} /> Commissions
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search salesmen..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter size={16} /> Filter
        </Button>
        <Button variant="outline" className="gap-2">
          <ArrowUpDown size={16} /> Sort
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesmen.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sales Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales} jobs</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalRevenue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalCommissions)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salesmen performance chart would go here */}

      {/* Salesmen table */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Performance</CardTitle>
          <CardDescription>Review sales performance for all sales staff</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Salesman</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Commission Structure</TableHead>
                <TableHead className="text-right">Sales</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Avg. Sale</TableHead>
                <TableHead className="text-right">Commission</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSalesmen.length > 0 ? (
                salesmenMetrics
                  .sort((a, b) => b.totalRevenue - a.totalRevenue)
                  .map((salesman) => (
                    <TableRow key={salesman.id}>
                      <TableCell className="font-medium">{salesman.name}</TableCell>
                      <TableCell>{salesman.subRole || "Sales Agent"}</TableCell>
                      <TableCell>
                        {salesman.paymentType === "percentage" 
                          ? `${salesman.paymentRate}% commission` 
                          : salesman.paymentType === "flat"
                          ? `${formatCurrency(salesman.paymentRate)} per sale`
                          : salesman.paymentType === "salary"
                          ? `Salary + ${salesman.incentiveType === "commission" ? "commission" : "bonus"}`
                          : `${formatCurrency(salesman.hourlyRate)}/hr`}
                      </TableCell>
                      <TableCell className="text-right">{salesman.salesCount}</TableCell>
                      <TableCell className="text-right text-blue-600">
                        {formatCurrency(salesman.totalRevenue)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(salesman.averageSaleValue)}
                      </TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        {formatCurrency(salesman.commission)}
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-muted-foreground mb-2">No salesmen found</div>
                      <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesmenDashboard;
