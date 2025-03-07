
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
  const netProfit = totalRevenue - totalExpenses;

  // Calculate expense categories
  const expenseCategories = [
    { name: "Marketing", value: totalExpenses * 0.4, color: "#f87171" },
    { name: "Platform Fees", value: totalExpenses * 0.3, color: "#22c55e" },
    { name: "Referral Costs", value: totalExpenses * 0.15, color: "#f97316" },
    { name: "Advertising", value: totalExpenses * 0.1, color: "#3b82f6" },
    { name: "Other", value: totalExpenses * 0.05, color: "#8b5cf6" },
  ];

  // Sort job sources for top performers
  const topJobSources = [...filteredJobSources]
    .sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <Input
        className="mb-4"
        placeholder="Search job sources..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profit Breakdown Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Profit Breakdown</CardTitle>
            <CardDescription>Distribution of revenue and costs</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={[
                { name: "Company Profit", value: totalProfit, color: "#8b5cf6" },
                { name: "Expenses", value: totalExpenses, color: "#f87171" },
              ]}
              title={formatCurrency(totalProfit)}
              subtitle="Company Profit"
            />
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">Net Profit</p>
              <p className="text-xl font-bold">{formatCurrency(netProfit)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Expense Breakdown Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Expenses Breakdown</CardTitle>
            <CardDescription>Distribution of expenses by type</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={expenseCategories}
              title={formatCurrency(totalExpenses)}
              subtitle="Total Expenses"
            />
          </CardContent>
        </Card>

        {/* Top Job Sources Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Top Job Sources</CardTitle>
            <CardDescription>Best performing job sources by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topJobSources.map((source) => (
                <div key={source.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="font-medium">{source.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {source.totalJobs || 0} jobs
                    </div>
                    <div className="font-medium">
                      {formatCurrency(source.totalRevenue || 0)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Job Sources Table */}
      <Card>
        <CardHeader>
          <CardTitle>Job Sources Performance</CardTitle>
          <CardDescription>Revenue and profit by job source</CardDescription>
        </CardHeader>
        <CardContent>
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
              {filteredJobSources.map((source) => {
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
        </CardContent>
      </Card>
      
      <JobSourceFinanceSection 
        jobSources={filteredJobSources} 
        filteredTransactions={filteredTransactions} 
      />
    </div>
  );
};

export default JobSourcesDashboard;
