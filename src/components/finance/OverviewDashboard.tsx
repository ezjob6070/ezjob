
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DonutChart } from "@/components/DonutChart";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { JobSource, FinancialTransaction, ProfitBreakdownItem } from "@/types/finance";
import OverallFinanceSection from "@/components/finance/OverallFinanceSection";
import TransactionsSection from "@/components/finance/TransactionsSection";

interface OverviewDashboardProps {
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  jobSources: JobSource[];
  filteredTransactions: FinancialTransaction[];
  expenseCategories: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  totalRevenue,
  totalExpenses,
  totalProfit,
  jobSources,
  filteredTransactions,
  expenseCategories
}) => {
  // Generate the profit breakdown data
  const profitBreakdown: ProfitBreakdownItem[] = [
    { name: "Operating Costs", value: totalProfit * 0.3, color: "#3b82f6" }, // blue
    { name: "Reinvestment", value: totalProfit * 0.25, color: "#10b981" },   // green
    { name: "Owner Dividends", value: totalProfit * 0.30, color: "#f59e0b" }, // amber
    { name: "Taxes", value: totalProfit * 0.15, color: "#ef4444" },          // red
  ];

  // Revenue breakdown data
  const revenueBreakdown = [
    { name: "Service Revenue", value: totalRevenue * 0.75, color: "#0ea5e9" }, // sky blue
    { name: "Parts & Materials", value: totalRevenue * 0.20, color: "#ec4899" }, // pink
    { name: "Diagnostic Fees", value: totalRevenue * 0.05, color: "#6366f1" },  // indigo
  ];

  return (
    <div className="space-y-8">
      <OverallFinanceSection 
        totalRevenue={totalRevenue} 
        totalExpenses={totalExpenses} 
        totalProfit={totalProfit} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>Source of revenue streams</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <DonutChart
              data={revenueBreakdown}
              title={formatCurrency(totalRevenue)}
              subtitle="Total Revenue"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Distribution of expenses by type</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <DonutChart
              data={expenseCategories}
              title={formatCurrency(totalExpenses)}
              subtitle="Total Expenses"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Net Profit Breakdown</CardTitle>
            <CardDescription>How profit is distributed</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <DonutChart
              data={profitBreakdown}
              title={formatCurrency(totalProfit)}
              subtitle="Net Profit"
            />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Top Job Sources</CardTitle>
          <CardDescription>Best performing job sources by revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Source Name</TableHead>
                <TableHead className="text-right">Jobs</TableHead>
                <TableHead className="text-right">Total Revenue</TableHead>
                <TableHead className="text-right">Source Cost</TableHead>
                <TableHead className="text-right">Expenses</TableHead>
                <TableHead className="text-right">Company Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobSources
                .sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0))
                .slice(0, 5)
                .map((source) => (
                  <TableRow key={source.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span>{source.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{source.totalJobs}</TableCell>
                    <TableCell className="text-right">{formatCurrency(source.totalRevenue || 0)}</TableCell>
                    <TableCell className="text-right">{formatCurrency((source.expenses || 0) * 0.4)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(source.expenses || 0)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(source.companyProfit || 0)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <TransactionsSection filteredTransactions={filteredTransactions.slice(0, 5)} />
    </div>
  );
};

export default OverviewDashboard;
