
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

interface JobSourceFinanceProps {
  jobSources: Array<any>;
  transactions: Array<any>;
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

  return (
    <Card>
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Source</TableHead>
                <TableHead>Total Jobs</TableHead>
                <TableHead>Total Revenue</TableHead>
                <TableHead>Expenses</TableHead>
                <TableHead>Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobSources.map((source) => (
                <TableRow key={source.id}>
                  <TableCell className="font-medium">{source.name}</TableCell>
                  <TableCell>{source.totalJobs}</TableCell>
                  <TableCell>{formatCurrency(source.totalRevenue || 0)}</TableCell>
                  <TableCell>{formatCurrency(source.expenses || 0)}</TableCell>
                  <TableCell>{formatCurrency(source.companyProfit || 0)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-blue-50 p-3 rounded">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <p className="text-xl font-semibold">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <p className="text-sm text-gray-500">Total Company Profit</p>
            <p className="text-xl font-semibold">{formatCurrency(totalCompanyProfit)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobSourceFinance;
