
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { JobSource, FinancialTransaction } from "@/types/finance";
import { DonutChart } from "@/components/DonutChart";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import JobSourceFinanceSection from "@/components/finance/JobSourceFinanceSection";

interface JobSourcesDashboardProps {
  filteredJobSources: JobSource[];
  filteredTransactions: FinancialTransaction[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const JobSourcesDashboard: React.FC<JobSourcesDashboardProps> = ({
  filteredJobSources,
  filteredTransactions,
  searchQuery,
  setSearchQuery
}) => {
  // Calculate total revenue and profit for donut charts
  const totalRevenue = filteredJobSources.reduce((sum, source) => sum + (source.totalRevenue || 0), 0);
  const totalProfit = filteredJobSources.reduce((sum, source) => sum + (source.companyProfit || 0), 0);
  const totalExpenses = filteredJobSources.reduce((sum, source) => sum + (source.expenses || 0), 0);

  // Calculate expense categories
  const expenseCategories = [
    { name: "Marketing", value: totalExpenses * 0.4, color: "#8b5cf6" },
    { name: "Platform Fees", value: totalExpenses * 0.3, color: "#ec4899" },
    { name: "Referral Costs", value: totalExpenses * 0.15, color: "#f97316" },
    { name: "Advertising", value: totalExpenses * 0.1, color: "#22c55e" },
    { name: "Other", value: totalExpenses * 0.05, color: "#3b82f6" },
  ];

  // Sort job sources for top performers
  const topJobSources = [...filteredJobSources]
    .sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Job Sources Performance</CardTitle>
          <CardDescription>Revenue and profit by job source</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-sm font-medium mb-4">Revenue Distribution</h3>
              <DonutChart
                data={filteredJobSources.map((source, index) => ({
                  name: source.name,
                  value: source.totalRevenue || 0,
                  color: [`#8b5cf6`, `#ec4899`, `#f97316`, `#22c55e`, `#3b82f6`][index % 5]
                }))}
                title={formatCurrency(totalRevenue)}
                subtitle="Total Revenue"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">Profit Distribution</h3>
              <DonutChart
                data={filteredJobSources.map((source, index) => ({
                  name: source.name,
                  value: source.companyProfit || 0,
                  color: [`#8b5cf6`, `#ec4899`, `#f97316`, `#22c55e`, `#3b82f6`][index % 5]
                }))}
                title={formatCurrency(totalProfit)}
                subtitle="Total Profit"
              />
            </div>
          </div>
          
          {/* Additional breakdown charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-sm font-medium mb-4">Profit Breakdown</h3>
              <DonutChart
                data={[
                  { name: "Company Profit", value: totalProfit, color: "#22c55e" },
                  { name: "Expenses", value: totalExpenses, color: "#f87171" },
                ]}
                title={formatCurrency(totalProfit + totalExpenses)}
                subtitle="Total Revenue"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">Expense Breakdown</h3>
              <DonutChart
                data={expenseCategories}
                title={formatCurrency(totalExpenses)}
                subtitle="Total Expenses"
              />
            </div>
          </div>
          
          <Input
            className="mb-4"
            placeholder="Search job sources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          {/* Top Job Sources Table */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Top Performing Job Sources</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source Name</TableHead>
                  <TableHead className="text-right">Total Jobs</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Expenses</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                  <TableHead className="text-right">Profit Margin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topJobSources.map((source) => {
                  const profit = source.companyProfit || 0;
                  const revenue = source.totalRevenue || 0;
                  const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
                  
                  return (
                    <TableRow key={source.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          <span>{source.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{source.totalJobs}</TableCell>
                      <TableCell className="text-right">{formatCurrency(revenue)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(source.expenses || 0)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(profit)}</TableCell>
                      <TableCell className="text-right">{profitMargin.toFixed(1)}%</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          <JobSourceFinanceSection 
            jobSources={filteredJobSources} 
            filteredTransactions={filteredTransactions} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default JobSourcesDashboard;
