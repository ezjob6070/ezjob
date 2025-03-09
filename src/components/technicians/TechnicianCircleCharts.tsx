
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Technician } from "@/types/technician";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CompactTechnicianFilter from "@/components/finance/technician-filters/CompactTechnicianFilter";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

interface TechnicianCircleChartsProps {
  filteredTechnicians: Technician[];
  dateRange?: DateRange;
}

const TechnicianCircleCharts: React.FC<TechnicianCircleChartsProps> = ({ 
  filteredTechnicians,
  dateRange
}) => {
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<string>("all");
  const [selectedTechnicianNames, setSelectedTechnicianNames] = useState<string[]>([]);
  
  const technicianNames = filteredTechnicians.map(tech => tech.name);
  
  // Apply filters
  const displayedTechnicians = filteredTechnicians.filter(tech => {
    // Filter by payment type
    const matchesPaymentType = 
      paymentTypeFilter === "all" || 
      tech.paymentType === paymentTypeFilter;
    
    // Filter by selected technicians
    const matchesTechnician = 
      selectedTechnicianNames.length === 0 || 
      selectedTechnicianNames.includes(tech.name);
    
    return matchesPaymentType && matchesTechnician;
  });
  
  // Calculate total revenue from technicians
  const totalRevenue = displayedTechnicians.reduce((sum, tech) => sum + tech.totalRevenue, 0);
  
  // Calculate total technician payments
  const technicianEarnings = displayedTechnicians.reduce((sum, tech) => 
    sum + tech.totalRevenue * (tech.paymentType === "percentage" ? tech.paymentRate / 100 : 1), 0
  );
  
  // Estimate expenses as 33% of revenue
  const totalExpenses = totalRevenue * 0.33;
  
  // Calculate net profit
  const companyProfit = totalRevenue - technicianEarnings - totalExpenses;
  
  // Handle technician selection
  const toggleTechnician = (techName: string) => {
    setSelectedTechnicianNames(prev => 
      prev.includes(techName) 
        ? prev.filter(t => t !== techName)
        : [...prev, techName]
    );
  };

  const clearFilters = () => {
    setSelectedTechnicianNames([]);
    setPaymentTypeFilter("all");
  };

  const applyFilters = () => {
    // Filters are applied instantly
  };

  // Format date range for display
  const getDateRangeText = () => {
    if (!dateRange?.from) return "";
    
    return dateRange.to
      ? `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`
      : `${format(dateRange.from, "MMM d, yyyy")}`;
  };
  
  const dateRangeText = getDateRangeText();
  
  return (
    <div className="space-y-6">
      {/* Payment Breakdown Simple Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Income</CardTitle>
            <CardDescription>
              Revenue from all technicians
              {dateRangeText && (
                <div className="text-xs mt-1 text-muted-foreground">{dateRangeText}</div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sky-600">{formatCurrency(totalRevenue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
            <CardDescription>
              Technician payments and costs
              {dateRangeText && (
                <div className="text-xs mt-1 text-muted-foreground">{dateRangeText}</div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">-{formatCurrency(technicianEarnings + totalExpenses)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Company Profit</CardTitle>
            <CardDescription>
              Revenue after all expenses
              {dateRangeText && (
                <div className="text-xs mt-1 text-muted-foreground">{dateRangeText}</div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formatCurrency(companyProfit)}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Technicians List Table */}
      <Card>
        <CardHeader>
          <CardTitle>Technician Financial Performance</CardTitle>
          <CardDescription>Earnings and profit metrics for each technician</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters moved inside the card */}
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

            {(selectedTechnicianNames.length > 0 || paymentTypeFilter !== "all") && (
              <div className="text-sm text-muted-foreground ml-auto">
                Showing {displayedTechnicians.length} of {filteredTechnicians.length} technicians
              </div>
            )}
          </div>

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
                  <TableRow key={tech.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 mr-2 text-xs">
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
    </div>
  );
};

export default TechnicianCircleCharts;
