
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Filter, Users } from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths } from "date-fns";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface TechnicianFiltersProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  selectedTechnicians: string[];
  setSelectedTechnicians: React.Dispatch<React.SetStateAction<string[]>>;
  technicianNames: string[];
  paymentTypeFilter: string;
  setPaymentTypeFilter: (paymentType: string) => void;
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
  const [technicianSearchQuery, setTechnicianSearchQuery] = useState("");
  const [showPaymentTypeFilter, setShowPaymentTypeFilter] = useState(false);

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
  
  const toggleTechnician = (techName: string) => {
    setSelectedTechnicians(prev => 
      prev.includes(techName) 
        ? prev.filter(t => t !== techName)
        : [...prev, techName]
    );
  };

  const toggleAllTechnicians = (checked: boolean) => {
    if (checked) {
      setSelectedTechnicians(
        technicianSearchQuery 
          ? technicianNames.filter(name => name.toLowerCase().includes(technicianSearchQuery.toLowerCase()))
          : [...technicianNames]
      );
    } else {
      setSelectedTechnicians([]);
    }
  };

  const filteredTechniciansForSelection = technicianNames.filter(
    tech => tech.toLowerCase().includes(technicianSearchQuery.toLowerCase())
  );

  const allTechniciansSelected = 
    filteredTechniciansForSelection.length > 0 && 
    filteredTechniciansForSelection.every(tech => selectedTechnicians.includes(tech));
  
  const someTechniciansSelected = 
    selectedTechnicians.length > 0 && 
    !allTechniciansSelected;

  const applyFilters = () => {
    setAppliedFilters(true);
    setShowTechnicianFilter(false);
    setShowDateFilter(false);
    setShowPaymentTypeFilter(false);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Popover open={showDateFilter} onOpenChange={setShowDateFilter}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
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
          <Button variant="outline" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {selectedTechnicians.length > 0 
              ? `${selectedTechnicians.length} technicians selected` 
              : "Filter Technicians"
            }
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <div className="p-3">
            <Input 
              type="text" 
              placeholder="Search technicians..." 
              className="mb-3" 
              value={technicianSearchQuery}
              onChange={(e) => setTechnicianSearchQuery(e.target.value)}
            />
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
              {filteredTechniciansForSelection.map(tech => (
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
              {filteredTechniciansForSelection.length === 0 && (
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

      <Popover open={showPaymentTypeFilter} onOpenChange={setShowPaymentTypeFilter}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {paymentTypeFilter !== "all" 
              ? `Payment Type: ${paymentTypeFilter === "percentage" ? "Percentage" : "Flat Rate"}` 
              : "Payment Type"
            }
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <div className="p-3">
            <h3 className="text-sm font-medium mb-3">Select Payment Type</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="payment-all" 
                  checked={paymentTypeFilter === "all"}
                  onCheckedChange={() => setPaymentTypeFilter("all")}
                />
                <label 
                  htmlFor="payment-all"
                  className="text-sm cursor-pointer"
                >
                  All Payment Types
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="payment-percentage" 
                  checked={paymentTypeFilter === "percentage"}
                  onCheckedChange={() => setPaymentTypeFilter("percentage")}
                />
                <label 
                  htmlFor="payment-percentage"
                  className="text-sm cursor-pointer"
                >
                  Percentage Based
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="payment-flat" 
                  checked={paymentTypeFilter === "flat"}
                  onCheckedChange={() => setPaymentTypeFilter("flat")}
                />
                <label 
                  htmlFor="payment-flat"
                  className="text-sm cursor-pointer"
                >
                  Flat Rate
                </label>
              </div>
            </div>
          </div>
          <div className="border-t p-3 flex justify-between">
            <Button variant="ghost" size="sm" onClick={clearFilters}>Clear</Button>
            <Button variant="default" size="sm" onClick={applyFilters}>Apply</Button>
          </div>
        </PopoverContent>
      </Popover>

      {appliedFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  );
};

export default TechnicianFilters;
