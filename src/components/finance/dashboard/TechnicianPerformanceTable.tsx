
import React from "react";
import { Technician } from "@/types/technician";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";

interface TechnicianPerformanceTableProps {
  filteredTechnicians: Technician[];
  selectedCategories: string[];
}

const TechnicianPerformanceTable: React.FC<TechnicianPerformanceTableProps> = ({
  filteredTechnicians,
  selectedCategories
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Technician Performance</CardTitle>
          <CardDescription>Financial metrics for technicians</CardDescription>
        </div>
        
        <div className="flex items-center gap-2">
          {selectedCategories.length > 0 && (
            <div className="text-sm px-3 py-1 rounded-full bg-slate-100 text-slate-700">
              {selectedCategories.length === 1 
                ? `Category: ${selectedCategories[0]}` 
                : `${selectedCategories.length} categories`}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Technician</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Completed Jobs</TableHead>
              <TableHead className="text-right">Revenue Generated</TableHead>
              <TableHead className="text-right">Parts</TableHead>
              <TableHead className="text-right">Earnings</TableHead>
              <TableHead className="text-right">Profit Margin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTechnicians.map((tech) => {
              const earnings = tech.totalRevenue * (tech.paymentType === "percentage" ? tech.paymentRate / 100 : 1);
              const profitMargin = ((tech.totalRevenue - earnings) / tech.totalRevenue * 100).toFixed(1);
              const partsValue = tech.totalRevenue * 0.2;
              
              return (
                <TableRow key={tech.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 mr-2 text-xs">
                        {tech.initials}
                      </div>
                      <span>{tech.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{tech.specialty}</TableCell>
                  <TableCell>
                    <div className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      {tech.category || "Others"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{tech.completedJobs}</TableCell>
                  <TableCell className="text-right text-sky-600">{formatCurrency(tech.totalRevenue)}</TableCell>
                  <TableCell className="text-right text-red-600">-{formatCurrency(partsValue)}</TableCell>
                  <TableCell className="text-right text-emerald-600">{formatCurrency(earnings)}</TableCell>
                  <TableCell className="text-right">{profitMargin}%</TableCell>
                </TableRow>
              );
            })}
            
            {filteredTechnicians.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No technicians match the selected filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TechnicianPerformanceTable;
