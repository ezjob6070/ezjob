
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { JobSource } from "@/types/finance";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DonutChart } from "@/components/DonutChart";

interface JobSourceCircleChartsProps {
  filteredJobSources: JobSource[];
}

const JobSourceCircleCharts: React.FC<JobSourceCircleChartsProps> = ({ 
  filteredJobSources 
}) => {
  const [jobSourceSearchQuery, setJobSourceSearchQuery] = useState("");
  
  // Calculate total revenue from job sources
  const totalRevenue = filteredJobSources.reduce((sum, source) => sum + (source.totalRevenue || 0), 0);
  
  // Estimate expenses as 33% of revenue
  const totalExpenses = filteredJobSources.reduce((sum, source) => sum + (source.expenses || 0), 0);
  
  // Calculate net profit
  const companyProfit = filteredJobSources.reduce((sum, source) => sum + (source.companyProfit || 0), 0);
  const companyProfitPercentage = totalRevenue > 0 ? ((companyProfit / totalRevenue) * 100).toFixed(1) : "0.0";
  
  // Revenue breakdown data
  const revenueBreakdown = [
    { name: "Service Revenue", value: totalRevenue * 0.75, color: "#0ea5e9" }, // sky blue
    { name: "Parts & Materials", value: totalRevenue * 0.20, color: "#ec4899" }, // pink
    { name: "Diagnostic Fees", value: totalRevenue * 0.05, color: "#6366f1" },  // indigo
  ];

  // Job source expense breakdown
  const jobSourceExpenseBreakdown = [
    { name: "Operating Expenses", value: totalExpenses, color: "#f87171" },    // red
    { name: "Marketing Costs", value: totalRevenue * 0.15, color: "#22c55e" },    // green
    { name: "Company Profit", value: companyProfit, color: "#3b82f6" },       // blue
  ];

  // Net profit breakdown data
  const profitBreakdown = [
    { name: "Operating Costs", value: companyProfit * 0.3, color: "#3b82f6" }, // blue
    { name: "Reinvestment", value: companyProfit * 0.25, color: "#10b981" },   // green
    { name: "Owner Dividends", value: companyProfit * 0.30, color: "#f59e0b" }, // amber
    { name: "Taxes", value: companyProfit * 0.15, color: "#ef4444" },          // red
  ];
  
  // Filter job sources based on search query
  const searchFilteredJobSources = filteredJobSources.filter(source => 
    jobSourceSearchQuery === "" || 
    source.name.toLowerCase().includes(jobSourceSearchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      {/* Payment Breakdown Circles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Revenue Breakdown Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Income Breakdown</CardTitle>
            <CardDescription>Source of income streams</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={revenueBreakdown}
              title={formatCurrency(totalRevenue)}
              subtitle="Total Income"
            />
          </CardContent>
        </Card>

        {/* Expense Distribution Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Expenses</CardTitle>
            <CardDescription>Distribution of costs and profit</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={jobSourceExpenseBreakdown}
              title={formatCurrency(companyProfit)}
              subtitle="Company Profit"
            />
          </CardContent>
        </Card>

        {/* Net Profit Breakdown Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Net Company Profit</CardTitle>
            <CardDescription>How profit is distributed</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={profitBreakdown}
              title={formatCurrency(companyProfit)}
              subtitle="Net Company Profit"
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Job Sources List Table with Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Job Source Financial Performance</CardTitle>
          <CardDescription>Revenue and profit metrics for each source</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-4 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Search job sources..."
              value={jobSourceSearchQuery}
              onChange={(e) => setJobSourceSearchQuery(e.target.value)}
            />
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Source</TableHead>
                <TableHead>Total Revenue</TableHead>
                <TableHead>Expenses</TableHead>
                <TableHead>Company Profit</TableHead>
                <TableHead>Profit Ratio</TableHead>
                <TableHead>Parts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searchFilteredJobSources.map((source) => {
                const totalRevenue = source.totalRevenue || 0;
                const expenses = source.expenses || 0;
                const profit = source.companyProfit || 0;
                const profitRatio = totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(1) : "0.0";
                const partsValue = totalRevenue * 0.2; // Assuming parts are 20% of total revenue
                
                return (
                  <TableRow key={source.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 mr-2 text-xs">
                          {source.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span>{source.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(totalRevenue)}</TableCell>
                    <TableCell>{formatCurrency(expenses)}</TableCell>
                    <TableCell>{formatCurrency(profit)}</TableCell>
                    <TableCell>{profitRatio}%</TableCell>
                    <TableCell>{formatCurrency(partsValue)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobSourceCircleCharts;
