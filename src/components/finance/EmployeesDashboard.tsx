
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Download, Filter, FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";
import { Technician } from "@/types/technician";
import DateRangeSelector from "./DateRangeSelector";

interface EmployeesDashboardProps {
  dateRange?: DateRange;
  setDateRange?: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

const EmployeesDashboard: React.FC<EmployeesDashboardProps> = ({ dateRange, setDateRange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { technicians } = useGlobalState();
  
  // Cast the technician array to ensure it includes the 'role' property
  const typedTechnicians = technicians as (Technician & { role?: string, subRole?: string })[];
  
  // Filter technicians that are employed
  const employees = typedTechnicians.filter((tech) => tech.role === "employed");

  // Filter by search term
  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.phone?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    (employee.position?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  );

  // Calculate salary expenditure for each employee
  const employeeMetrics = employees.map(employee => {
    let monthlySalary = 0;
    
    if (employee.salaryBasis === "hourly") {
      // Assuming 160 hours per month for full-time employees
      monthlySalary = employee.hourlyRate * 160;
    } else if (employee.salaryBasis === "weekly") {
      monthlySalary = employee.paymentRate * 4.33; // Average weeks in a month
    } else if (employee.salaryBasis === "bi-weekly" || employee.salaryBasis === "biweekly") {
      monthlySalary = employee.paymentRate * 2.17; // Average bi-weekly periods in a month
    } else if (employee.salaryBasis === "monthly") {
      monthlySalary = employee.paymentRate;
    } else if (employee.salaryBasis === "annually" || employee.salaryBasis === "yearly") {
      monthlySalary = employee.paymentRate / 12;
    }
    
    // Calculate period payment based on date range
    let periodPayment = monthlySalary;
    if (dateRange?.from && dateRange?.to) {
      const days = (dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 3600 * 24);
      periodPayment = (monthlySalary / 30) * days; // Approximate daily rate
    }
    
    // Add incentives if applicable
    if (employee.incentiveType && employee.incentiveAmount) {
      if (employee.incentiveType === "monthly") {
        periodPayment += employee.incentiveAmount;
      } else if (employee.incentiveType === "yearly") {
        periodPayment += employee.incentiveAmount / 12;
      }
    }
    
    return {
      ...employee,
      periodPayment,
      monthlySalary,
      subRole: employee.subRole || null // Ensure subRole exists, even if null
    };
  });

  // Calculate totals
  const totalMonthlySalaries = employeeMetrics.reduce((sum, emp) => sum + emp.monthlySalary, 0);
  const totalPeriodPayments = employeeMetrics.reduce((sum, emp) => sum + emp.periodPayment, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Employees Finance</h1>
          <p className="text-muted-foreground">Monitor employee salaries and compensation</p>
        </div>
        <div className="flex items-center gap-2">
          <DateRangeSelector date={dateRange} setDate={setDateRange} />
          <Button variant="outline" className="gap-2">
            <Download size={16} /> Export
          </Button>
          <Button variant="outline" className="gap-2">
            <FileText size={16} /> Payroll
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter size={16} /> Filter
        </Button>
        <Button variant="outline" className="gap-2">
          <ArrowUpDown size={16} /> Sort
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Payroll</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalMonthlySalaries)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Period Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalPeriodPayments)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Annual Payroll</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalMonthlySalaries * 12)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employees table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Compensation</CardTitle>
          <CardDescription>Review salary data for all employees</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Salary Basis</TableHead>
                <TableHead className="text-right">Base Rate</TableHead>
                <TableHead className="text-right">Monthly</TableHead>
                <TableHead className="text-right">Annual</TableHead>
                <TableHead className="text-right">Period Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length > 0 ? (
                employeeMetrics
                  .sort((a, b) => b.monthlySalary - a.monthlySalary)
                  .map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.position || employee.subRole || "Office Staff"}</TableCell>
                      <TableCell className="capitalize">
                        {employee.salaryBasis}
                        {employee.incentiveType && employee.incentiveType !== "none" && employee.incentiveAmount && (
                          <span className="text-xs text-blue-600 ml-2">
                            +{employee.incentiveType === "bonus" ? "Bonus" : "Commission"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {employee.salaryBasis === "hourly" 
                          ? `${formatCurrency(employee.hourlyRate)}/hr` 
                          : formatCurrency(employee.paymentRate)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(employee.monthlySalary)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(employee.monthlySalary * 12)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(employee.periodPayment)}
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-muted-foreground mb-2">No employees found</div>
                      <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesDashboard;
