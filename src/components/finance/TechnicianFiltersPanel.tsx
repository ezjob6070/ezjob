
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search, Calendar, ChevronDown } from "lucide-react";
import DateRangeSelector from "@/components/finance/DateRangeSelector";
import { DateRange } from "react-day-picker";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";

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
  deselectAllTechnicians
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  if (!showFilters) return null;
  
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
  
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Filter by Technician</h3>
            <div className="space-y-2">
              {/* Search Bar */}
              <div className="relative mb-3">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search technicians..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Select All Checkbox */}
              <div className="flex items-center space-x-2 pb-1 border-b mb-2">
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
              
              <div className="max-h-40 overflow-y-auto">
                {filteredTechnicians.map((techName) => (
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
            <h3 className="text-sm font-medium mb-2">Filter by Date Range</h3>
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
  );
};

export default TechnicianFiltersPanel;
