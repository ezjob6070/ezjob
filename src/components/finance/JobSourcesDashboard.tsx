
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { JobSource, FinancialTransaction } from "@/types/finance";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import JobSourceInvoiceSection from "@/components/finance/JobSourceInvoiceSection";

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
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Job Sources Performance</CardTitle>
          <CardDescription>Financial metrics for job sources</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source Name</TableHead>
                <TableHead className="text-right">Completed Jobs</TableHead>
                <TableHead className="text-right">Revenue Generated</TableHead>
                <TableHead className="text-right">Expenses</TableHead>
                <TableHead className="text-right">Profit</TableHead>
                <TableHead className="text-right">Profit Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobSources.map((source) => {
                const totalRevenue = source.totalRevenue || 0;
                const expenses = source.expenses || 0;
                const profit = source.companyProfit || 0;
                const profitMargin = totalRevenue > 0 
                  ? ((profit / totalRevenue) * 100).toFixed(1) 
                  : "0.0";
                
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
                    <TableCell className="text-right">{source.totalJobs || 0}</TableCell>
                    <TableCell className="text-right">{formatCurrency(totalRevenue)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(expenses)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(profit)}</TableCell>
                    <TableCell className="text-right">{profitMargin}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <JobSourceInvoiceSection 
        jobSources={filteredJobSources} 
      />
    </div>
  );
};

export default JobSourcesDashboard;
