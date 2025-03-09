import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search, Calendar, ChevronDown, X, Users } from "lucide-react";
import { DateRange } from "react-day-picker";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TechnicianFiltersPanelProps {
  showFilters: boolean;
  technicianNames: string[];
  selectedTechnicians: string[];
  toggleTechnician: (techName: string) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  selectAllTechnicians?: () => void;
  deselectAllTechnicians?: () => void;
  setShowFilters?: (show: boolean) => void;
  compact?: boolean;
}

const TechnicianFiltersPanel: React.FC<TechnicianFiltersPanelProps> = ({
  showFilters,
  technicianNames,
  selectedTechnicians,
  toggleTechnician,
  clearFilters,
  applyFilters,
  date,
  setDate,
  selectAllTechnicians,
  deselectAllTechnicians,
  setShowFilters,
  compact = false
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const allSelected = technicianNames.length > 0 && selectedTechnicians.length === technicianNames.length;
  const someSelected = selectedTechnicians.length > 0 && selectedTechnicians.length < technicianNames.length;
  
  const handleSelectAllChange = () => {
    if (allSelected) {
      deselectAllTechnicians?.();
    } else {
      selectAllTechnicians?.();
    }
  };

  const filteredTechnicians = technicianNames.filter(name =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
  
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 gap-2"
            >
              <Users className="h-4 w-4" />
              <span>Technicians</span>
              <span className="ml-1 rounded-full bg-blue-100 px-1.5 py-0.5 text-xs font-semibold text-blue-600">
                {selectedTechnicians.length || "All"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0" align="end">
            <div className="p-3 space-y-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search technicians..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                <Checkbox 
                  id="select-all-technicians-compact" 
                  checked={allSelected}
                  data-state={someSelected ? "indeterminate" : allSelected ? "checked" : "unchecked"}
                  onCheckedChange={handleSelectAllChange}
                />
                <label 
                  htmlFor="select-all-technicians-compact"
                  className="text-sm font-medium leading-none"
                >
                  Select All Technicians
                </label>
              </div>
              
              <div className="max-h-52 overflow-y-auto pt-2 space-y-1">
                {filteredTechnicians.map((techName) => (
                  <div key={techName} className="flex items-center space-x-2 py-1">
                    <Checkbox 
                      id={`tech-compact-${techName}`} 
                      checked={selectedTechnicians.includes(techName)}
                      onCheckedChange={() => toggleTechnician(techName)}
                    />
                    <label 
                      htmlFor={`tech-compact-${techName}`}
                      className="text-sm font-medium leading-none"
                    >
                      {techName}
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
                <Button size="sm" onClick={applyFilters}>
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
  
  if (!showFilters) return null;
  
  return (
    <Card className="mb-4 shadow-md border border-gray-200 overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Technician Filters</h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8">
              Clear all
            </Button>
            {setShowFilters && (
              <Button variant="outline" size="icon" onClick={() => setShowFilters(false)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-700 border-b pb-2">Filter by Technician</h3>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search technicians..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                  <Checkbox 
                    id="select-all-technicians" 
                    checked={allSelected}
                    data-state={someSelected ? "indeterminate" : allSelected ? "checked" : "unchecked"}
                    onCheckedChange={handleSelectAllChange}
                  />
                  <label 
                    htmlFor="select-all-technicians"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Select All Technicians
                  </label>
                </div>
                
                <div className="max-h-40 overflow-y-auto pt-2">
                  {filteredTechnicians.map((techName) => (
                    <div key={techName} className="flex items-center space-x-2 py-1.5">
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
            
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-700 border-b pb-2">Filter by Date Range</h3>
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
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className={cn(
                        "w-full justify-start text-left font-normal", 
                        !date && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(date.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button size="sm" onClick={applyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicianFiltersPanel;
