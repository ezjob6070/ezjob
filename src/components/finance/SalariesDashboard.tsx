import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { initialEmployees } from "@/data/employees";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Employee, SalaryBasis, IncentiveType } from "@/types/employee";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpDown, 
  Download, 
  BadgeDollarSign, 
  Calendar, 
  Users,
  Search,
  Filter,
  Clock
} from "lucide-react";
import DateRangeSelector from "@/components/finance/DateRangeSelector";
import ReportGenerator from "@/components/finance/ReportGenerator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

interface SalariesDashboardProps {
  dateRange: DateRange | undefined;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

type SalarySort = "name-asc" | "name-desc" | "salary-high" | "salary-low" | "tenure-long" | "tenure-short" | "hourly-high" | "hourly-low";

const SalariesDashboard: React.FC<SalariesDashboardProps> = ({ 
  dateRange,
  setDateRange 
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState<SalarySort>("salary-high");
  const [hourlyRateRange, setHourlyRateRange] = useState<[number, number]>([0, 100]);
  const [viewMode, setViewMode] = useState<"standard" | "hourly">("standard");
  
  // Extract unique departments
  const departments = Array.from(
    new Set(initialEmployees.map(employee => employee.department))
  );

  // Get employees with calculated monthly salaries
  const getCalculatedEmployees = () => {
    return initialEmployees.map(employee => {
      // Calculate normalized monthly salary
      let monthlySalary = employee.salary;
      if (employee.salaryBasis === "weekly") {
        monthlySalary = employee.salary * 4.33; // Average weeks in a month
      } else if (employee.salaryBasis === "yearly") {
        monthlySalary = employee.salary / 12;
      } else if (employee.salaryBasis === "hourly") {
        // Assume 40 hours per week, 4.33 weeks per month
        monthlySalary = (employee.hourlyRate || 0) * 40 * 4.33;
      }
      
      // Calculate taxes if available
      const taxAmount = employee.taxPercentage 
        ? monthlySalary * (employee.taxPercentage / 100)
        : 0;
      
      // Calculate net salary
      const netSalary = monthlySalary - taxAmount;
      
      // Calculate tenure in months
      const hireDate = new Date(employee.dateHired);
      const now = new Date();
      const tenureMonths = 
        (now.getFullYear() - hireDate.getFullYear()) * 12 + 
        (now.getMonth() - hireDate.getMonth());
      
      return {
        ...employee,
        monthlySalary,
        taxAmount,
        netSalary,
        tenureMonths,
        hourlyRate: employee.hourlyRate || 0,
        incentiveAmount: employee.incentiveAmount || 0,
        incentiveType: employee.incentiveType || "hourly"
      };
    });
  };

  // Filter and sort employees
  const filteredEmployees = getCalculatedEmployees()
    .filter(employee => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        searchQuery === "" || 
        employee.name.toLowerCase().includes(searchLower) ||
        employee.position.toLowerCase().includes(searchLower) ||
        employee.department.toLowerCase().includes(searchLower);
      
      // Department filter
      const matchesDepartment = 
        departmentFilter === "all" || 
        employee.department === departmentFilter;
      
      // Status filter
      const matchesStatus = 
        statusFilter === "all" || 
        employee.status === statusFilter;
      
      // Hourly rate filter
      const hourlyRate = employee.hourlyRate || 0;
      const matchesHourlyRate = 
        hourlyRate >= hourlyRateRange[0] && 
        hourlyRate <= hourlyRateRange[1];
      
      return matchesSearch && matchesDepartment && matchesStatus && matchesHourlyRate;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "salary-high":
          return b.monthlySalary - a.monthlySalary;
        case "salary-low":
          return a.monthlySalary - b.monthlySalary;
        case "hourly-high":
          return (b.hourlyRate || 0) - (a.hourlyRate || 0);
        case "hourly-low":
          return (a.hourlyRate || 0) - (b.hourlyRate || 0);
        case "tenure-long":
          return b.tenureMonths - a.tenureMonths;
        case "tenure-short":
          return a.tenureMonths - b.tenureMonths;
        default:
          return 0;
      }
    });

  // Calculate overall salary stats
  const totalMonthlySalary = filteredEmployees.reduce(
    (sum, employee) => sum + employee.monthlySalary, 
    0
  );
  
  const totalTaxes = filteredEmployees.reduce(
    (sum, employee) => sum + employee.taxAmount, 
    0
  );
  
  const totalNetSalary = filteredEmployees.reduce(
    (sum, employee) => sum + employee.netSalary, 
    0
  );
  
  const avgHourlyRate = filteredEmployees.length
    ? filteredEmployees.reduce((sum, emp) => sum + (emp.hourlyRate || 0), 0) / filteredEmployees.length
    : 0;

  // Format number as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format hourly rate
  const formatHourlyRate = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Get salary basis display text - fixed to return proper SalaryBasis type
  const getSalaryBasisText = (basis?: SalaryBasis) => {
    switch (basis) {
      case "hourly":
        return "Hourly";
      case "weekly":
        return "Weekly";
      case "monthly":
        return "Monthly";
      case "yearly":
        return "Yearly";
      default:
        return "Yearly";
    }
  };
  
  // Get incentive type display text - fixed to properly handle IncentiveType
  const getIncentiveTypeText = (type?: IncentiveType) => {
    switch (type) {
      case "hourly":
        return "Per Hour";
      case "weekly":
        return "Per Week";
      case "monthly":
        return "Per Month";
      default:
        return "N/A";
    }
  };

  return (
    <div className="space-y-6">
      {/* Salaries Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Monthly Salaries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BadgeDollarSign className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">{formatCurrency(totalMonthlySalary)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredEmployees.length} employees
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Tax Withholdings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BadgeDollarSign className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">{formatCurrency(totalTaxes)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Average: {formatCurrency(totalTaxes / (filteredEmployees.length || 1))}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Net Salaries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BadgeDollarSign className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">{formatCurrency(totalNetSalary)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              After tax deductions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Average Hourly Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <span className="text-2xl font-bold">{formatHourlyRate(avgHourlyRate)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Per hour
            </p>
          </CardContent>
        </Card>
      </div>

      {/* View Mode Selector */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "standard" | "hourly")}>
        <TabsList className="mb-4">
          <TabsTrigger value="standard">Standard View</TabsTrigger>
          <TabsTrigger value="hourly" className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Hourly View
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees by name, position, or department..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortOption} onValueChange={(value) => setSortOption(value as SalarySort)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="salary-high">Salary (High-Low)</SelectItem>
              <SelectItem value="salary-low">Salary (Low-High)</SelectItem>
              <SelectItem value="hourly-high">Hourly Rate (High-Low)</SelectItem>
              <SelectItem value="hourly-low">Hourly Rate (Low-High)</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="tenure-long">Tenure (Longest)</SelectItem>
              <SelectItem value="tenure-short">Tenure (Shortest)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Hourly Rate Filter (only shown in hourly view) */}
      {viewMode === "hourly" && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Hourly Rate Filter
            </h3>
            <div className="text-sm">
              {formatHourlyRate(hourlyRateRange[0])} - {formatHourlyRate(hourlyRateRange[1])}
            </div>
          </div>
          <Slider
            className="my-4"
            value={hourlyRateRange}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => setHourlyRateRange(value as [number, number])}
          />
        </Card>
      )}
      
      {/* Date Range Picker */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" /> 
          Salary Period
        </h2>
        <DateRangeSelector date={dateRange} setDate={setDateRange} />
      </div>

      {/* Employees Salary Table */}
      <Card className="overflow-hidden border">
        {viewMode === "standard" ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Basis</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <span>Gross Salary</span>
                    <ArrowUpDown 
                      className="h-3.5 w-3.5 cursor-pointer" 
                      onClick={() => setSortOption(
                        sortOption === "salary-high" ? "salary-low" : "salary-high"
                      )}
                    />
                  </div>
                </TableHead>
                <TableHead>Tax %</TableHead>
                <TableHead>Tax Amount</TableHead>
                <TableHead>Net Salary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          {employee.profileImage && (
                            <AvatarImage src={employee.profileImage} alt={employee.name} />
                          )}
                          <AvatarFallback className="bg-indigo-100 text-indigo-600">
                            {employee.name.split(' ').map(part => part[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-muted-foreground">{employee.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>
                      {format(new Date(employee.dateHired), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getSalaryBasisText(employee.salaryBasis)}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(employee.salary)}
                    </TableCell>
                    <TableCell>
                      {employee.taxPercentage ? `${employee.taxPercentage}%` : "N/A"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatCurrency(employee.taxAmount)}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(employee.netSalary)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No employees match the current filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Hourly Rate</span>
                    <ArrowUpDown 
                      className="h-3.5 w-3.5 cursor-pointer" 
                      onClick={() => setSortOption(
                        sortOption === "hourly-high" ? "hourly-low" : "hourly-high"
                      )}
                    />
                  </div>
                </TableHead>
                <TableHead>Incentive Type</TableHead>
                <TableHead>Incentive Amount</TableHead>
                <TableHead>Est. Weekly</TableHead>
                <TableHead>Est. Monthly</TableHead>
                <TableHead>Est. Yearly</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => {
                  const hourlyRate = employee.hourlyRate || 0;
                  const weeklyPay = hourlyRate * 40; // Assume 40 hour week
                  const monthlyPay = weeklyPay * 4.33; // Avg weeks in month
                  const yearlyPay = monthlyPay * 12;
                  
                  return (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            {employee.profileImage && (
                              <AvatarImage src={employee.profileImage} alt={employee.name} />
                            )}
                            <AvatarFallback className="bg-indigo-100 text-indigo-600">
                              {employee.name.split(' ').map(part => part[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-muted-foreground">{employee.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell className="font-medium">
                        {formatHourlyRate(hourlyRate)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getIncentiveTypeText(employee.incentiveType)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatHourlyRate(employee.incentiveAmount || 0)}</TableCell>
                      <TableCell>{formatCurrency(weeklyPay)}</TableCell>
                      <TableCell>{formatCurrency(monthlyPay)}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(yearlyPay)}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No employees match the current filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Report Generator */}
      <div className="pt-4">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Users className="h-5 w-5" /> 
          Salary Reports
        </h2>
        <ReportGenerator dateRange={dateRange} />
      </div>
    </div>
  );
};

export default SalariesDashboard;
