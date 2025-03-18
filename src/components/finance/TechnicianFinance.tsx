
import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { initialTechnicians } from "@/data/technicians";
import { Technician } from "@/types/technician";
import TechnicianFinanceFilters from "./TechnicianFinanceFilters";
import TechnicianMetricsCard from "./TechnicianMetricsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { isWithinInterval } from "date-fns";
import { DonutChart } from "@/components/DonutChart";

const TechnicianFinance = () => {
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians);
  const [filteredTechnicians, setFilteredTechnicians] = useState<Technician[]>(technicians);
  const [selectedTechnician, setSelectedTechnician] = useState<string>("all");
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [dateRangeText, setDateRangeText] = useState<string>("All Time");
  
  // Extract unique payment types from technicians
  const paymentTypes = Array.from(new Set(technicians.map(tech => tech.paymentType)));
  
  // Extract technician names
  const technicianNames = technicians.map(tech => tech.name);
  
  // Get the selected technician object
  const selectedTechnicianObject = selectedTechnician === "all" 
    ? null 
    : technicians.find(tech => tech.name === selectedTechnician);

  // Apply filters
  useEffect(() => {
    let filtered = [...technicians];
    
    // Filter by technician
    if (selectedTechnician !== "all") {
      filtered = filtered.filter(tech => tech.name === selectedTechnician);
    }
    
    // Filter by payment type
    if (selectedPaymentType !== "all") {
      filtered = filtered.filter(tech => tech.paymentType === selectedPaymentType);
    }
    
    // Filter by date range - this would normally filter by job dates
    // But for this example, we're just showing the filtered technicians
    
    setFilteredTechnicians(filtered);
    
    // Update date range text
    if (dateRange?.from) {
      if (dateRange.to) {
        setDateRangeText(`${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`);
      } else {
        setDateRangeText(`From ${dateRange.from.toLocaleDateString()}`);
      }
    } else {
      setDateRangeText("All Time");
    }
  }, [technicians, selectedTechnician, selectedPaymentType, dateRange]);
  
  const resetFilters = () => {
    setSelectedTechnician("all");
    setSelectedPaymentType("all");
    setDateRange(undefined);
  };
  
  // Calculate totals for all filtered technicians
  const calculateTotals = () => {
    return filteredTechnicians.reduce((totals, tech) => {
      // Calculate technician earnings based on payment type
      const techEarnings = tech.paymentType === "percentage" 
        ? tech.totalRevenue * (tech.paymentRate / 100)
        : tech.completedJobs * tech.paymentRate;
      
      const expenses = tech.totalRevenue * 0.33; // Assuming 33% expenses
      const companyProfit = tech.totalRevenue - techEarnings - expenses;
      
      return {
        completedJobs: totals.completedJobs + tech.completedJobs,
        cancelledJobs: totals.cancelledJobs + tech.cancelledJobs,
        totalRevenue: totals.totalRevenue + tech.totalRevenue,
        technicianEarnings: totals.technicianEarnings + techEarnings,
        expenses: totals.expenses + expenses,
        companyProfit: totals.companyProfit + companyProfit
      };
    }, {
      completedJobs: 0,
      cancelledJobs: 0,
      totalRevenue: 0,
      technicianEarnings: 0,
      expenses: 0,
      companyProfit: 0
    });
  };
  
  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Technician Finance</h2>
      
      {/* Filters */}
      <TechnicianFinanceFilters 
        technicianNames={technicianNames}
        selectedTechnician={selectedTechnician}
        onTechnicianChange={setSelectedTechnician}
        paymentTypes={paymentTypes}
        selectedPaymentType={selectedPaymentType}
        onPaymentTypeChange={setSelectedPaymentType}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onResetFilters={resetFilters}
      />
      
      {/* Selected Technician Metrics */}
      {selectedTechnicianObject && (
        <TechnicianMetricsCard 
          technician={selectedTechnicianObject} 
          dateRangeText={dateRangeText} 
        />
      )}
      
      {/* Overall Summary for filtered technicians */}
      {(!selectedTechnicianObject || filteredTechnicians.length > 1) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Financial Breakdown */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
              <CardDescription>
                {filteredTechnicians.length} technician{filteredTechnicians.length !== 1 ? 's' : ''} • {dateRangeText}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Completed Jobs</TableCell>
                    <TableCell className="text-right">{totals.completedJobs}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Cancelled Jobs</TableCell>
                    <TableCell className="text-right">{totals.cancelledJobs}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Revenue</TableCell>
                    <TableCell className="text-right">{formatCurrency(totals.totalRevenue)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Technician Payments</TableCell>
                    <TableCell className="text-right">{formatCurrency(totals.technicianEarnings)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Expenses</TableCell>
                    <TableCell className="text-right">{formatCurrency(totals.expenses)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Company Profit</TableCell>
                    <TableCell className="text-right">{formatCurrency(totals.companyProfit)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Profit Margin</TableCell>
                    <TableCell className="text-right">
                      {totals.totalRevenue > 0 
                        ? `${(totals.companyProfit / totals.totalRevenue * 100).toFixed(1)}%` 
                        : '0%'}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {/* Profit Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Profit Distribution</CardTitle>
              <CardDescription>Breakdown of revenue allocation</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <DonutChart
                data={[
                  {
                    name: "Company Profit",
                    value: totals.companyProfit,
                    color: "#8B5CF6" // purple
                  },
                  {
                    name: "Technician Payments",
                    value: totals.technicianEarnings,
                    color: "#F97316" // orange
                  },
                  {
                    name: "Expenses",
                    value: totals.expenses,
                    color: "#EF4444" // red
                  }
                ]}
                title={formatCurrency(totals.companyProfit)}
                subtitle="Company Profit"
                size={180}
              />
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Technician Table */}
      <Card>
        <CardHeader>
          <CardTitle>Technician Financial Performance</CardTitle>
          <CardDescription>Financial metrics for each technician</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Technician</TableHead>
                <TableHead>Payment Structure</TableHead>
                <TableHead>Completed Jobs</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Technician Earnings</TableHead>
                <TableHead>Company Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTechnicians.map((tech) => {
                // Calculate technician earnings based on payment type
                const techEarnings = tech.paymentType === "percentage" 
                  ? tech.totalRevenue * (tech.paymentRate / 100)
                  : tech.completedJobs * tech.paymentRate;
                
                const expenses = tech.totalRevenue * 0.33; // Assuming 33% expenses
                const companyProfit = tech.totalRevenue - techEarnings - expenses;
                
                return (
                  <TableRow 
                    key={tech.id} 
                    className={tech.name === selectedTechnician ? "bg-muted/50" : ""}
                    onClick={() => setSelectedTechnician(tech.name)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell className="font-medium">{tech.name}</TableCell>
                    <TableCell>
                      {tech.paymentType === "percentage" 
                        ? `${tech.paymentRate}% of job` 
                        : `${formatCurrency(tech.paymentRate)} per job`}
                    </TableCell>
                    <TableCell>{tech.completedJobs}</TableCell>
                    <TableCell>{formatCurrency(tech.totalRevenue)}</TableCell>
                    <TableCell>{formatCurrency(techEarnings)}</TableCell>
                    <TableCell>{formatCurrency(companyProfit)}</TableCell>
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

export default TechnicianFinance;
