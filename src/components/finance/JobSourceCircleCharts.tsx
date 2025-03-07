
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { JobSource } from "@/types/finance";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  
  // Filter job sources based on search query
  const searchFilteredJobSources = filteredJobSources.filter(source => 
    jobSourceSearchQuery === "" || 
    source.name.toLowerCase().includes(jobSourceSearchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      {/* Payment Breakdown Simple Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Income</CardTitle>
            <CardDescription>Revenue from all sources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
            <CardDescription>Costs and operating expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Company Profit</CardTitle>
            <CardDescription>Revenue after all expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(companyProfit)}</div>
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
