
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Technician } from "@/types/technician";
import CompactTechnicianFilter from "@/components/finance/technician-filters/CompactTechnicianFilter";
import CompactDateRangeSelector from "@/components/finance/CompactDateRangeSelector";
import { DateRange } from "react-day-picker";

interface TechnicianFinancialTableProps {
  filteredTechnicians: Technician[];
  displayedTechnicians: Technician[];
  selectedTechnicianNames: string[];
  toggleTechnician: (techName: string) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  paymentTypeFilter: string;
  setPaymentTypeFilter: (value: string) => void;
  localDateRange: DateRange | undefined;
  setLocalDateRange: (date: DateRange | undefined) => void;
  onTechnicianSelect: (technician: Technician) => void;
  selectedTechnicianId?: string;
}

const TechnicianFinancialTable: React.FC<TechnicianFinancialTableProps> = ({
  filteredTechnicians,
  displayedTechnicians,
  selectedTechnicianNames,
  toggleTechnician,
  clearFilters,
  applyFilters,
  paymentTypeFilter,
  setPaymentTypeFilter,
  localDateRange,
  setLocalDateRange,
  onTechnicianSelect,
  selectedTechnicianId
}) => {
  const technicianNames = filteredTechnicians.map(tech => tech.name);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Technician Financial Performance</CardTitle>
        <CardDescription>Earnings and profit metrics for each technician</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-gray-50 rounded-md border border-gray-100">
          <CompactTechnicianFilter 
            technicianNames={technicianNames}
            selectedTechnicians={selectedTechnicianNames}
            toggleTechnician={toggleTechnician}
            clearFilters={clearFilters}
            applyFilters={applyFilters}
          />
          
          <div className="w-56">
            <Select value={paymentTypeFilter} onValueChange={setPaymentTypeFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Payment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payment Types</SelectItem>
                <SelectItem value="percentage">Percentage Based</SelectItem>
                <SelectItem value="flat">Flat Rate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="ml-auto">
            <CompactDateRangeSelector date={localDateRange} setDate={setLocalDateRange} />
          </div>

          {(selectedTechnicianNames.length > 0 || paymentTypeFilter !== "all") && (
            <div className="text-sm text-muted-foreground">
              Showing {displayedTechnicians.length} of {filteredTechnicians.length} technicians
            </div>
          )}
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Technician</TableHead>
              <TableHead>Total Revenue</TableHead>
              <TableHead>Technician Earnings</TableHead>
              <TableHead>Company Earnings</TableHead>
              <TableHead>Profit Ratio</TableHead>
              <TableHead>Parts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedTechnicians.map((tech) => {
              const techEarnings = tech.totalRevenue * (tech.paymentType === "percentage" ? tech.paymentRate / 100 : 1);
              const companyEarnings = tech.totalRevenue - techEarnings - (tech.totalRevenue * 0.33);
              const profitRatio = ((companyEarnings / tech.totalRevenue) * 100).toFixed(1);
              const partsValue = tech.totalRevenue * 0.2; // Assuming parts are 20% of total revenue
              
              return (
                <TableRow 
                  key={tech.id}
                  className={`cursor-pointer hover:bg-slate-50 ${selectedTechnicianId === tech.id ? 'bg-indigo-50' : ''}`}
                  onClick={() => onTechnicianSelect(tech)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white mr-2 text-xs ${selectedTechnicianId === tech.id ? 'bg-indigo-600' : 'bg-indigo-400'}`}>
                        {tech.initials}
                      </div>
                      <span>{tech.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({tech.paymentType === "percentage" ? `${tech.paymentRate}%` : "Flat Rate"})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sky-600">{formatCurrency(tech.totalRevenue)}</TableCell>
                  <TableCell className="text-red-600">-{formatCurrency(techEarnings)}</TableCell>
                  <TableCell className="text-violet-600">{formatCurrency(companyEarnings)}</TableCell>
                  <TableCell>{profitRatio}%</TableCell>
                  <TableCell className="text-red-600">-{formatCurrency(partsValue)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TechnicianFinancialTable;
