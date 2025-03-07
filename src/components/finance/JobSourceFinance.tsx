
import { useState } from "react";
import { SearchIcon, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { FinancialTransaction, JobSource } from "@/types/finance";
import { JobSource as JobSourceType } from "@/types/jobSource";
import { DonutChart } from "@/components/DonutChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type JobSourceFinanceRecord = {
  jobSource: JobSourceType | { id: string; name: string };
  totalJobs: number;
  totalRevenue: number;
  sourceCost: number;
  companyProfit: number;
};

type JobSourceFinanceProps = {
  jobSources: JobSourceType[] | JobSource[];
  transactions: FinancialTransaction[];
};

const JobSourceFinance = ({ jobSources, transactions }: JobSourceFinanceProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof JobSourceFinanceRecord>("totalRevenue");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Calculate financial metrics for each job source
  const jobSourceFinances: JobSourceFinanceRecord[] = jobSources.map(jobSource => {
    // Filter transactions for this job source
    const jobSourceTransactions = transactions.filter(
      t => t.jobSourceId === jobSource.id && t.status === "completed" && t.category === "payment"
    );
    
    const totalJobs = jobSourceTransactions.length;
    const totalRevenue = jobSourceTransactions.reduce((sum, t) => sum + t.amount, 0);
    
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
    
    const companyProfit = totalRevenue - sourceCost;
    
    return {
      jobSource,
      totalJobs,
      totalRevenue,
      sourceCost,
      companyProfit
    };
  });

  // Calculate totals for profit visualization
  const totalRevenue = jobSourceFinances.reduce((sum, source) => sum + source.totalRevenue, 0);
  const totalSourceCost = jobSourceFinances.reduce((sum, source) => sum + source.sourceCost, 0);
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Add visualization section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profit Breakdown</CardTitle>
            <CardDescription>
              Distribution of revenue and costs by job source
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
                }
              ]}
              title={formatCurrency(totalCompanyProfit)}
              subtitle="Company Profit"
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

      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search job sources..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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
                  <TableCell>{formatCurrency(record.companyProfit)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
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
