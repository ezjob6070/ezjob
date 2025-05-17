import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Filter } from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format, isAfter, isBefore, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TechnicianFiltersProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  selectedTechnicians: string[];
  setSelectedTechnicians: React.Dispatch<React.SetStateAction<string[]>>;
  technicianNames: string[];
  paymentTypeFilter: string;
  setPaymentTypeFilter: (filter: string) => void;
  appliedFilters: boolean;
  setAppliedFilters: (applied: boolean) => void;
  clearFilters: () => void;
}

const TechnicianFilters: React.FC<TechnicianFiltersProps> = ({
  date,
  setDate,
  selectedTechnicians,
  setSelectedTechnicians,
  technicianNames,
  paymentTypeFilter,
  setPaymentTypeFilter,
  appliedFilters,
  setAppliedFilters,
  clearFilters
}) => {
  const [showTechnicianFilter, setShowTechnicianFilter] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showPaymentRateFilter, setShowPaymentRateFilter] = useState(false);
  
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
        from = startOfWeek(today, { weekStartsOn: 1 });
        to = endOfWeek(today, { weekStartsOn: 1 });
        break;
      case "lastWeek":
        from = startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
        to = endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
        break;
      case "thisMonth":
        from = startOfMonth(today);
        to = endOfMonth(today);
        break;
      case "lastMonth":
        from = startOfMonth(subMonths(today, 1));
        to = endOfMonth(subMonths(today, 1));
        break;
      default:
        from = today;
    }
    
    setDate({ from, to });
    setAppliedFilters(true);
  };
  
  const toggleTechnician = (technicianName: string) => {
    setSelectedTechnicians(prev => 
      prev.includes(technicianName) ? prev.filter(name => name !== technicianName) : [...prev, technicianName]
    );
  };

  const toggleAllTechnicians = (checked: boolean) => {
    if (checked) {
      setSelectedTechnicians([...technicianNames]);
    } else {
      setSelectedTechnicians([]);
    }
  };

  const allTechniciansSelected = technicianNames.length > 0 && 
    technicianNames.every(tech => selectedTechnicians.includes(tech));
  
  const someTechniciansSelected = selectedTechnicians.length > 0 && !allTechniciansSelected;

  const applyFilters = () => {
    setAppliedFilters(true);
    setShowTechnicianFilter(false);
    setShowDateFilter(false);
    setShowPaymentRateFilter(false);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Popover open={showDateFilter} onOpenChange={setShowDateFilter}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 bg-white hover:bg-gray-50 border-gray-200 text-gray-700">
            <Calendar className="h-4 w-4 text-gray-500" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "MMM d, yyyy")} - {format(date.to, "MMM d, yyyy")}
                </>
              ) : (
                format(date.from, "MMM d, yyyy")
              )
            ) : (
              "Select date range"
            )}
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
              selected={date}
              onSelect={setDate}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </div>
          <div className="p-3 flex justify-between">
            <Button variant="ghost" size="sm" onClick={clearFilters}>Clear</Button>
            <Button variant="default" size="sm" onClick={applyFilters}>Apply</Button>
          </div>
        </PopoverContent>
      </Popover>

      <Popover open={showTechnicianFilter} onOpenChange={setShowTechnicianFilter}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 bg-white hover:bg-gray-50 border-gray-200 text-gray-700">
            <Filter className="h-4 w-4 text-gray-500" />
            {selectedTechnicians.length > 0 
              ? `${selectedTechnicians.length} technicians selected` 
              : "Filter Technicians"
            }
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <div className="p-3">
            <div className="flex items-center space-x-2 py-2 border-b border-gray-200 mb-2">
              <Checkbox 
                id="select-all-technicians"
                checked={allTechniciansSelected}
                data-state={
                  someTechniciansSelected 
                    ? "indeterminate" 
                    : allTechniciansSelected 
                      ? "checked" 
                      : "unchecked"
                }
                onCheckedChange={toggleAllTechnicians}
              />
              <label 
                htmlFor="select-all-technicians"
                className="text-sm font-medium cursor-pointer"
              >
                Select All Technicians
              </label>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {technicianNames.map(tech => (
                <div key={tech} className="flex items-center space-x-2 py-1">
                  <Checkbox 
                    id={`tech-${tech}`} 
                    checked={selectedTechnicians.includes(tech)}
                    onCheckedChange={() => toggleTechnician(tech)}
                  />
                  <label 
                    htmlFor={`tech-${tech}`}
                    className="text-sm cursor-pointer"
                  >
                    {tech}
                  </label>
                </div>
              ))}
              {technicianNames.length === 0 && (
                <div className="text-sm text-muted-foreground py-2">No technicians found</div>
              )}
            </div>
          </div>
          <div className="border-t p-3 flex justify-between">
            <Button variant="ghost" size="sm" onClick={clearFilters}>Clear</Button>
            <Button variant="default" size="sm" onClick={applyFilters}>Apply</Button>
          </div>
        </PopoverContent>
      </Popover>

      <Popover open={showPaymentRateFilter} onOpenChange={setShowPaymentRateFilter}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 bg-white hover:bg-gray-50 border-gray-200 text-gray-700">
            <Filter className="h-4 w-4 text-gray-500" />
            {paymentTypeFilter !== "all" 
              ? `Payment Rate: ${paymentTypeFilter}` 
              : "Payment Rate"
            }
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-0" align="start">
          <div className="p-3">
            <Select value={paymentTypeFilter} onValueChange={(value) => {
              setPaymentTypeFilter(value);
              setShowPaymentRateFilter(false);
              setAppliedFilters(true);
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Payment Rate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rates</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="flat">Flat Rate</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>

      {appliedFilters && (
        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 hover:bg-gray-50" onClick={clearFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  );
};

export default TechnicianFilters;
