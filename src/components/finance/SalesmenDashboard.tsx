
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Download, Filter, Search, Calendar, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";
import { Technician } from "@/types/technician";
import { Job } from "@/types/job";
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
    (salesman.subRole?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  );

  // Get jobs assigned to salesmen within the date range
  const salesJobs = jobs.filter(job => {
    const jobDate = job.scheduledDate ? new Date(job.scheduledDate) : new Date(job.date);
    const isInDateRange = 
      (!dateRange?.from || jobDate >= dateRange.from) && 
      (!dateRange?.to || jobDate <= dateRange.to);
    
    return isInDateRange && salesmen.some(s => s.id === job.technicianId);
  });

  // Calculate financial metrics for each salesman
  const salesmenMetrics = salesmen.map(salesman => {
    const salesmanFilteredJobs = salesJobs.filter(job => job.technicianId === salesman.id);
    const totalRevenue = salesmanFilteredJobs.reduce(
      (sum, job) => sum + (job.actualAmount || job.amount), 0
    );
    const completedSales = salesmanFilteredJobs.filter(job => job.status === "completed").length;
    
    // Calculate commission based on salesman's incentive type
    let commission = 0;
    if (salesman.incentiveType === "commission" && salesman.incentiveAmount) {
      commission = totalRevenue * (salesman.incentiveAmount / 100);
    } else if (salesman.paymentType === "percentage" && salesman.paymentRate) {
      commission = totalRevenue * (salesman.paymentRate / 100);
    } else if (salesman.paymentType === "flat") {
      commission = completedSales * salesman.paymentRate;
    }
    
    const profit = totalRevenue - commission;
    const averageSaleValue = completedSales > 0 ? totalRevenue / completedSales : 0;
    
    return {
      ...salesman,
      totalRevenue,
      commission,
      salesCount: completedSales,
      averageSaleValue,
      profit
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Salesmen Finance</h1>
          <p className="text-muted-foreground">Monitor sales performance and commissions</p>
        </div>
        <div className="flex items-center gap-2">
          <DateRangeSelector date={dateRange} setDate={setDateRange} />
          <Button variant="outline" className="gap-2">
            <Download size={16} /> Export
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Salesmen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesmen.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(salesmenMetrics.reduce((sum, s) => sum + s.totalRevenue, 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Commissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(salesmenMetrics.reduce((sum, s) => sum + s.commission, 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {salesmenMetrics.reduce((sum, s) => sum + s.salesCount, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salesmen table */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Performance</CardTitle>
          <CardDescription>Review financial data for all salesmen</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Salesperson</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Commission Type</TableHead>
                <TableHead className="text-right">Sales</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Commission</TableHead>
                <TableHead className="text-right">Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSalesmen.length > 0 ? (
                salesmenMetrics
                  .sort((a, b) => b.totalRevenue - a.totalRevenue)
                  .map((salesman) => (
                    <TableRow key={salesman.id}>
                      <TableCell className="font-medium">{salesman.name}</TableCell>
                      <TableCell>{salesman.subRole || "Sales Representative"}</TableCell>
                      <TableCell>
                        {salesman.incentiveType === "commission" 
                          ? `${salesman.incentiveAmount}% of revenue` 
                          : salesman.paymentType === "percentage"
                          ? `${salesman.paymentRate}% of revenue`
                          : salesman.paymentType === "flat"
                          ? `${formatCurrency(salesman.paymentRate)} per sale`
                          : "No commission"}
                      </TableCell>
                      <TableCell className="text-right">{salesman.salesCount}</TableCell>
                      <TableCell className="text-right text-blue-600">
                        {formatCurrency(salesman.totalRevenue)}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {formatCurrency(salesman.commission)}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        {formatCurrency(salesman.profit)}
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
