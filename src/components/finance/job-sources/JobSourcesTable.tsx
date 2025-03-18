
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { JobSource } from "@/types/finance";

interface JobSourcesTableProps {
  sources: JobSource[];
}

const JobSourcesTable: React.FC<JobSourcesTableProps> = ({ sources }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Source Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Completed Jobs</TableHead>
          <TableHead className="text-right">Revenue Generated</TableHead>
          <TableHead className="text-right">Expenses</TableHead>
          <TableHead className="text-right">Profit</TableHead>
          <TableHead className="text-right">Profit Margin</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sources.length > 0 ? (
          sources.map((source) => {
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
                <TableCell>
                  <div className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    {source.category || "Others"}
                  </div>
                </TableCell>
                <TableCell className="text-right">{source.totalJobs || 0}</TableCell>
                <TableCell className="text-right text-sky-600">{formatCurrency(totalRevenue)}</TableCell>
                <TableCell className="text-right text-red-600">-{formatCurrency(expenses)}</TableCell>
                <TableCell className="text-right text-emerald-600">{formatCurrency(profit)}</TableCell>
                <TableCell className="text-right">{profitMargin}%</TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center">
              No job sources match the selected filters
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default JobSourcesTable;
