
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

interface ContractorsDashboardProps {
  dateRange?: DateRange;
  setDateRange?: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

const ContractorsDashboard: React.FC<ContractorsDashboardProps> = ({ dateRange, setDateRange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { technicians, jobs } = useGlobalState();
  
  // Filter technicians that are contractors
  const contractors = technicians.filter((tech) => tech.role === "contractor");

  // Filter by search term
  const filteredContractors = contractors.filter((contractor) =>
    contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contractor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contractor.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contractor.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get jobs assigned to contractors within the date range
  const contractorJobs = jobs.filter(job => {
    const jobDate = job.scheduledDate ? new Date(job.scheduledDate) : 
                  new Date(typeof job.date === 'object' && job.date instanceof Date ? job.date : String(job.date || new Date()));
    const isInDateRange = 
      (!dateRange?.from || jobDate >= dateRange.from) && 
      (!dateRange?.to || jobDate <= dateRange.to);
    
    return isInDateRange && contractors.some(c => c.id === job.technicianId);
  });

  // Calculate financial metrics for each contractor
  const contractorMetrics = contractors.map(contractor => {
    const contractorFilteredJobs = contractorJobs.filter(job => job.technicianId === contractor.id);
    const totalRevenue = contractorFilteredJobs.reduce(
      (sum, job) => sum + (job.actualAmount || job.amount), 0
    );
    const completedJobs = contractorFilteredJobs.filter(job => job.status === "completed").length;
    
    // Calculate payment based on contractor's payment type
    let payment = 0;
    if (contractor.paymentType === "percentage") {
      payment = totalRevenue * (contractor.paymentRate / 100);
    } else if (contractor.paymentType === "flat") {
      payment = completedJobs * contractor.paymentRate;
    } else if (contractor.paymentType === "hourly") {
      // Assuming average 2 hours per job for calculation purposes
      payment = completedJobs * 2 * contractor.hourlyRate;
    }
    
    return {
      ...contractor,
      totalRevenue,
      completedJobs,
      payment,
      jobCount: contractorFilteredJobs.length
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Contractors Finance</h1>
          <p className="text-muted-foreground">Monitor contractor payments and performance</p>
        </div>
        <div className="flex items-center gap-2">
          <DateRangeSelector date={dateRange} setDate={setDateRange} />
          <Button variant="outline" className="gap-2">
            <Download size={16} /> Export
          </Button>
          <Button variant="outline" className="gap-2">
            <FileText size={16} /> Invoices
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contractors..."
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Contractors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contractors.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(contractorMetrics.reduce((sum, c) => sum + c.totalRevenue, 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(contractorMetrics.reduce((sum, c) => sum + c.payment, 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contractorMetrics.reduce((sum, c) => sum + c.completedJobs, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contractors table */}
      <Card>
        <CardHeader>
          <CardTitle>Contractor Performance</CardTitle>
          <CardDescription>Review financial data for all contractors</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contractor</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Payment Type</TableHead>
                <TableHead className="text-right">Jobs</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Payment</TableHead>
                <TableHead className="text-right">Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContractors.length > 0 ? (
                contractorMetrics
                  .filter(contractor => 
                    contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    contractor.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .sort((a, b) => b.totalRevenue - a.totalRevenue)
                  .map((contractor) => (
                    <TableRow key={contractor.id}>
                      <TableCell className="font-medium">{contractor.name}</TableCell>
                      <TableCell>{contractor.specialty || "General"}</TableCell>
                      <TableCell>
                        {contractor.paymentType === "percentage" 
                          ? `${contractor.paymentRate}% of revenue` 
                          : contractor.paymentType === "flat"
                          ? `${formatCurrency(contractor.paymentRate)} per job`
                          : `${formatCurrency(contractor.hourlyRate)}/hr`}
                      </TableCell>
                      <TableCell className="text-right">{contractor.jobCount}</TableCell>
                      <TableCell className="text-right text-blue-600">
                        {formatCurrency(contractor.totalRevenue)}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {formatCurrency(contractor.payment)}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        {formatCurrency(contractor.totalRevenue - contractor.payment)}
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-muted-foreground mb-2">No contractors found</div>
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

export default ContractorsDashboard;
