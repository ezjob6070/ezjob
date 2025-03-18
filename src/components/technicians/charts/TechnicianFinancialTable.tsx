
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Technician } from "@/types/technician";
import CompactTechnicianFilter from "@/components/finance/technician-filters/CompactTechnicianFilter";
import { DateRange } from "react-day-picker";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Calendar, ChevronDown, ArrowUpAZ, ArrowDownAZ, ArrowUp10, ArrowDown10 } from "lucide-react";
import { format } from "date-fns";

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
  const [sortBy, setSortBy] = useState<string>("default");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const today = new Date();
  
  // Sort technicians based on selected sort option
  const sortedTechnicians = [...displayedTechnicians].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "profit-high":
        const profitA = a.totalRevenue - (a.totalRevenue * (a.paymentType === "percentage" ? a.paymentRate / 100 : 1)) - (a.totalRevenue * 0.33);
        const profitB = b.totalRevenue - (b.totalRevenue * (b.paymentType === "percentage" ? b.paymentRate / 100 : 1)) - (b.totalRevenue * 0.33);
        return profitB - profitA;
      case "profit-low":
        const profitC = a.totalRevenue - (a.totalRevenue * (a.paymentType === "percentage" ? a.paymentRate / 100 : 1)) - (a.totalRevenue * 0.33);
        const profitD = b.totalRevenue - (b.totalRevenue * (b.paymentType === "percentage" ? b.paymentRate / 100 : 1)) - (b.totalRevenue * 0.33);
        return profitC - profitD;
      default:
        return 0;
    }
  });

  const getDateDisplayText = () => {
    if (!localDateRange?.from) return "Today";
    
    if (localDateRange.to && 
        isSameDay(localDateRange.from, localDateRange.to) && 
        isSameDay(localDateRange.from, today)) {
      return "Today";
    }
    
    if (localDateRange.to && isSameDay(localDateRange.from, localDateRange.to)) {
      return format(localDateRange.from, "MMM d, yyyy");
    }
    
    if (localDateRange.to) {
      return `${format(localDateRange.from, "MMM d")} - ${format(localDateRange.to, "MMM d, yyyy")}`;
    }
    
    return format(localDateRange.from, "MMM d, yyyy");
  };

  const getTodayFormattedDate = () => {
    return format(today, "MMM d, yyyy");
  };
  
  function isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  const handleDatePreset = (preset: string) => {
    const today = new Date();
    let from: Date;
    let to: Date = today;

    switch (preset) {
      case "today":
        from = today;
        break;
      case "yesterday":
        from = new Date(today);
        from.setDate(today.getDate() - 1);
        to = new Date(from);
        break;
      case "thisWeek":
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
        from = startOfWeek;
        break;
      case "lastWeek":
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - today.getDay() - 6);
        from = lastWeekStart;
        const lastWeekEnd = new Date(lastWeekStart);
        lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
        to = lastWeekEnd;
        break;
      case "thisMonth":
        from = new Date(today.getFullYear(), today.getMonth(), 1);
        to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "lastMonth":
        from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        to = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      default:
        from = today;
    }
    
    setLocalDateRange({ from, to });
    setShowDateFilter(false);
  };
  
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

          <Popover open={showDateFilter} onOpenChange={setShowDateFilter}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex flex-col items-start px-4 py-2 h-auto min-h-[3rem] relative">
                <div className="flex items-center gap-2 font-medium">
                  <Calendar className="h-4 w-4" />
                  {getDateDisplayText()}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {isSameDay(localDateRange?.from || today, today) ? 
                    getTodayFormattedDate() : 
                    "Click to select custom range"}
                </div>
                <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-3 border-b">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <Button size="sm" variant="outline" onClick={() => handleDatePreset("today")}>Today</Button>
                  <Button size="sm" variant="outline" onClick={() => handleDatePreset("yesterday")}>Yesterday</Button>
                  <Button size="sm" variant="outline" onClick={() => handleDatePreset("thisWeek")}>This Week</Button>
                  <Button size="sm" variant="outline" onClick={() => handleDatePreset("lastWeek")}>Last Week</Button>
                  <Button size="sm" variant="outline" onClick={() => handleDatePreset("thisMonth")}>This Month</Button>
                  <Button size="sm" variant="outline" onClick={() => handleDatePreset("lastMonth")}>Last Month</Button>
                </div>
                <div className="text-sm font-medium mb-2">Custom Range</div>
                <CalendarComponent
                  mode="range"
                  selected={localDateRange}
                  onSelect={setLocalDateRange}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </div>
              <div className="p-3 flex justify-between">
                <Button variant="ghost" size="sm" onClick={clearFilters}>Clear</Button>
                <Button variant="default" size="sm" onClick={() => {
                  applyFilters();
                  setShowDateFilter(false);
                }}>Apply</Button>
              </div>
            </PopoverContent>
          </Popover>

          <div className="ml-auto">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort technicians" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="name-asc">
                  <div className="flex items-center gap-2">
                    <ArrowUpAZ className="h-4 w-4" />
                    <span>Name A-Z</span>
                  </div>
                </SelectItem>
                <SelectItem value="name-desc">
                  <div className="flex items-center gap-2">
                    <ArrowDownAZ className="h-4 w-4" />
                    <span>Name Z-A</span>
                  </div>
                </SelectItem>
                <SelectItem value="profit-high">
                  <div className="flex items-center gap-2">
                    <ArrowUp10 className="h-4 w-4" />
                    <span>Most Profitable</span>
                  </div>
                </SelectItem>
                <SelectItem value="profit-low">
                  <div className="flex items-center gap-2">
                    <ArrowDown10 className="h-4 w-4" />
                    <span>Least Profitable</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
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
            {sortedTechnicians.map((tech) => {
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
