
import React from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { JobSource, FinancialTransaction } from "@/types/finance";
import { Progress } from "@/components/ui/progress";

interface JobSourceFinanceProps {
  jobSources: JobSource[];
  transactions: FinancialTransaction[];
}

export const JobSourceFinance: React.FC<JobSourceFinanceProps> = ({ jobSources, transactions }) => {
  // Fix arithmetic operation errors by ensuring we're working with numbers
  const fixArithmeticOperations = () => {
    // Calculate totals with proper null checking
    const totalExpenses = jobSources.reduce((sum, source) => {
      const expenseValue = typeof source.expenses === 'number' ? source.expenses : 0;
      return sum + expenseValue;
    }, 0);

    const totalCompanyProfit = jobSources.reduce((sum, source) => {
      const profitValue = typeof source.companyProfit === 'number' ? source.companyProfit : 0;
      return sum + profitValue;
    }, 0);

    return { totalExpenses, totalCompanyProfit };
  };

  const { totalExpenses, totalCompanyProfit } = fixArithmeticOperations();
  
  // Calculate max revenue for progress bar
  const maxRevenue = Math.max(...jobSources.map(source => source.totalRevenue || 0));

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium text-black">Job Source</TableHead>
              <TableHead className="font-medium text-black">Total Jobs</TableHead>
              <TableHead className="font-medium text-black">Total Revenue</TableHead>
              <TableHead className="font-medium text-black">Revenue %</TableHead>
              <TableHead className="font-medium text-black">Expenses</TableHead>
              <TableHead className="font-medium text-black">Profit</TableHead>
              <TableHead className="font-medium text-black">Profit Margin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobSources.map((source) => {
              const revenue = source.totalRevenue || 0;
              const expenses = source.expenses || 0;
              const profit = source.companyProfit || 0;
              const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
              const revenuePercentage = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
              
              return (
                <TableRow key={source.id}>
                  <TableCell className="font-medium">{source.name}</TableCell>
                  <TableCell>{source.totalJobs}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>{formatCurrency(revenue)}</span>
                        <span className="text-xs text-muted-foreground">{revenuePercentage.toFixed(1)}%</span>
                      </div>
                      <Progress value={revenuePercentage} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    {maxRevenue > 0 ? ((revenue / maxRevenue) * 100).toFixed(1) : 0}%
                  </TableCell>
                  <TableCell>{formatCurrency(expenses)}</TableCell>
                  <TableCell>{formatCurrency(profit)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${profitMargin >= 40 ? 'bg-green-100 text-green-800' : profitMargin >= 20 ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {profitMargin.toFixed(1)}%
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-blue-50 p-4 rounded">
          <p className="text-sm font-medium text-black">Total Expenses</p>
          <p className="text-xl font-semibold">{formatCurrency(totalExpenses)}</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="text-xs">
              <p className="text-gray-700 font-medium">Marketing</p>
              <p className="font-medium">{formatCurrency(totalExpenses * 0.4)}</p>
            </div>
            <div className="text-xs">
              <p className="text-gray-700 font-medium">Operations</p>
              <p className="font-medium">{formatCurrency(totalExpenses * 0.35)}</p>
            </div>
            <div className="text-xs">
              <p className="text-gray-700 font-medium">Equipment</p>
              <p className="font-medium">{formatCurrency(totalExpenses * 0.15)}</p>
            </div>
            <div className="text-xs">
              <p className="text-gray-700 font-medium">Other</p>
              <p className="font-medium">{formatCurrency(totalExpenses * 0.1)}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded">
          <p className="text-sm font-medium text-black">Total Company Profit</p>
          <p className="text-xl font-semibold">{formatCurrency(totalCompanyProfit)}</p>
          <p className="mt-2 text-xs font-medium text-gray-700">
            {totalExpenses + totalCompanyProfit > 0 ? 
              `Profit Margin: ${((totalCompanyProfit / (totalExpenses + totalCompanyProfit)) * 100).toFixed(1)}%` : 
              'Profit Margin: 0%'}
          </p>
          <p className="mt-1 text-xs font-medium text-gray-700">
            {jobSources.length > 0 ? 
              `Average Profit per Job Source: ${formatCurrency(totalCompanyProfit / jobSources.length)}` : 
              'Average Profit per Job Source: $0'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobSourceFinance;
