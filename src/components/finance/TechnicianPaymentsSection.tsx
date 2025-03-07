
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Calendar, ChevronDown } from "lucide-react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Technician } from "@/types/technician";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DateRange } from "react-day-picker";
import DateRangeSelector from "@/components/finance/DateRangeSelector";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";

interface TechnicianPaymentsSectionProps {
  technicians: Technician[];
}

const TechnicianPaymentsSection: React.FC<TechnicianPaymentsSectionProps> = ({ technicians }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentType, setPaymentType] = useState<string>("all");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    to: new Date(),
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);

  // Filter technicians based on search, payment type and potentially date
  const filteredTechnicians = technicians.filter(tech => {
    const matchesSearch = 
      searchQuery === "" || 
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPaymentType = 
      paymentType === "all" || 
      tech.paymentType === paymentType;
    
    const matchesTechnicianFilter =
      selectedTechnicians.length === 0 ||
      selectedTechnicians.includes(tech.name);
    
    return matchesSearch && matchesPaymentType && matchesTechnicianFilter;
  });

  // Sort technicians by earnings (highest first)
  const sortedTechnicians = [...filteredTechnicians].sort((a, b) => {
    const aEarnings = a.totalRevenue * (a.paymentType === "percentage" ? a.paymentRate / 100 : 1);
    const bEarnings = b.totalRevenue * (b.paymentType === "percentage" ? b.paymentRate / 100 : 1);
    return bEarnings - aEarnings;
  });

  // Calculate total payments and metrics
  const totalPayments = sortedTechnicians.reduce((sum, tech) => {
    return sum + tech.totalRevenue * (tech.paymentType === "percentage" ? tech.paymentRate / 100 : 1);
  }, 0);
  
  const totalRevenue = sortedTechnicians.reduce((sum, tech) => sum + tech.totalRevenue, 0);
  
  // Estimate expenses as 33% of revenue
  const totalExpenses = totalRevenue * 0.33;
  
  // Calculate net profit
  const netProfit = totalRevenue - totalPayments - totalExpenses;

  // Get unique technician names
  const technicianNames = [...new Set(technicians.map(tech => tech.name))];

  // Toggle technician selection
  const toggleTechnician = (techName: string) => {
    setSelectedTechnicians(prev => 
      prev.includes(techName) 
        ? prev.filter(t => t !== techName)
        : [...prev, techName]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedTechnicians([]);
    setPaymentType("all");
    setSearchQuery("");
    setDate({
      from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
      to: new Date(),
    });
  };

  // Apply filters function 
  const applyFilters = () => {
    setShowFilters(false);
  };

  // Handle date preset selection
  const handleDatePresetSelection = (preset: string) => {
    const today = new Date();
    
    switch (preset) {
      case "today":
        setDate({ from: today, to: today });
        break;
      case "yesterday":
        const yesterday = subDays(today, 1);
        setDate({ from: yesterday, to: yesterday });
        break;
      case "last-week":
        const lastWeekStart = startOfWeek(subDays(today, 7), { weekStartsOn: 1 });
        const lastWeekEnd = endOfWeek(subDays(today, 7), { weekStartsOn: 1 });
        setDate({ from: lastWeekStart, to: lastWeekEnd });
        break;
      case "this-month":
        setDate({ from: startOfMonth(today), to: today });
        break;
      case "last-month":
        const lastMonthDate = subDays(startOfMonth(today), 1);
        setDate({ from: startOfMonth(lastMonthDate), to: endOfMonth(lastMonthDate) });
        break;
      case "last-30-days":
        setDate({ from: subDays(today, 30), to: today });
        break;
      case "last-year":
        setDate({ from: startOfYear(subDays(startOfYear(today), 1)), to: endOfYear(subDays(startOfYear(today), 1)) });
        break;
      default:
        break;
    }
  };

  // Select all technicians
  const selectAllTechnicians = () => {
    setSelectedTechnicians([...technicianNames]);
  };

  // Deselect all technicians
  const deselectAllTechnicians = () => {
    setSelectedTechnicians([]);
  };

  const allSelected = technicianNames.length > 0 && selectedTechnicians.length === technicianNames.length;
  const someSelected = selectedTechnicians.length > 0 && selectedTechnicians.length < technicianNames.length;

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Technician Payments</CardTitle>
            <CardDescription>Manage and track technician payment details</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Cards - TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-6">
            <div>
              <h3 className="font-medium text-muted-foreground text-sm">Total Income</h3>
              <p className="text-2xl font-semibold mt-1">{formatCurrency(totalRevenue)}</p>
              <p className="text-xs text-muted-foreground mt-1">Revenue from all technicians</p>
            </div>
          </Card>
          
          <Card className="p-6">
            <div>
              <h3 className="font-medium text-muted-foreground text-sm">Total Expenses</h3>
              <p className="text-2xl font-semibold mt-1">{formatCurrency(totalPayments + totalExpenses)}</p>
              <p className="text-xs text-muted-foreground mt-1">Technician payments and costs</p>
            </div>
          </Card>
          
          <Card className="p-6">
            <div>
              <h3 className="font-medium text-muted-foreground text-sm">Net Company Profit</h3>
              <p className="text-2xl font-semibold mt-1">{formatCurrency(netProfit)}</p>
              <p className="text-xs text-muted-foreground mt-1">Revenue after all expenses</p>
            </div>
          </Card>
        </div>
      
        {/* Filters Panel */}
        {showFilters && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-base font-bold mb-2">Filter by Technician</h3>
                  <div className="space-y-2">
                    <div className="relative mb-3">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search technicians..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 pb-1 border-b mb-2">
                      <Checkbox 
                        id="select-all-technicians" 
                        checked={allSelected}
                        data-state={someSelected ? "indeterminate" : allSelected ? "checked" : "unchecked"}
                        onCheckedChange={() => allSelected ? deselectAllTechnicians() : selectAllTechnicians()}
                      />
                      <label 
                        htmlFor="select-all-technicians"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Select All Technicians
                      </label>
                    </div>
                    
                    <div className="max-h-40 overflow-y-auto">
                      {technicianNames.map((techName) => (
                        <div key={techName} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`tech-${techName}`} 
                            checked={selectedTechnicians.includes(techName)}
                            onCheckedChange={() => toggleTechnician(techName)}
                          />
                          <label 
                            htmlFor={`tech-${techName}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {techName}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base font-bold mb-2">Filter by Date Range</h3>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Quick Select</span>
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => handleDatePresetSelection("today")}>
                            Today
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDatePresetSelection("yesterday")}>
                            Yesterday
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDatePresetSelection("last-week")}>
                            Last Week
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDatePresetSelection("this-month")}>
                            This Month
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDatePresetSelection("last-month")}>
                            Last Month
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDatePresetSelection("last-30-days")}>
                            Last 30 Days
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDatePresetSelection("last-year")}>
                            Last Year
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <DateRangeSelector date={date} setDate={setDate} />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4 space-x-2">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
                <Button size="sm" onClick={applyFilters}>
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Search bar and filters for table (always visible) */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Search technicians..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select 
            value={paymentType} 
            onValueChange={setPaymentType}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Payment Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="flat">Flat Rate</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Separator className="my-4" />
        
        {/* Payments Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Technician</TableHead>
              <TableHead>Payment Type</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Payment Amount</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTechnicians.length > 0 ? (
              sortedTechnicians.map((tech) => {
                const paymentAmount = tech.totalRevenue * (tech.paymentType === "percentage" ? tech.paymentRate / 100 : 1);
                
                return (
                  <TableRow key={tech.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-2 text-xs">
                          {tech.initials}
                        </div>
                        <div>
                          <div>{tech.name}</div>
                          <div className="text-xs text-muted-foreground">{tech.specialty}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{tech.paymentType}</TableCell>
                    <TableCell>
                      {tech.paymentType === "percentage" 
                        ? `${tech.paymentRate}%` 
                        : formatCurrency(tech.paymentRate)}
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(tech.totalRevenue)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(paymentAmount)}</TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Paid
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline">Details</Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TechnicianPaymentsSection;
