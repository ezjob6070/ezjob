
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  X, 
  Calendar,
  ChevronDown,
  Users
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { 
  JobFilterProps, 
  DateFilterType,
  DateFilterCategory 
} from "./JobFilterTypes";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

const JobFilters = ({ filters, setFilters, technicians, resetFilters }: JobFilterProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);

  const updateFilter = <K extends keyof typeof filters>(
    key: K,
    value: typeof filters[K]
  ) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleDateFilterChange = (value: DateFilterType) => {
    updateFilter("dateFilter", value);
    // Reset custom date range if not using custom filter
    if (value !== "custom") {
      updateFilter("customDateRange", { from: undefined, to: undefined });
    }
  };

  // Format the current date filter selection for display
  const getDateFilterLabel = () => {
    switch(filters.dateFilter) {
      case "today": return "Today";
      case "tomorrow": return "Tomorrow";
      case "yesterday": return "Yesterday";
      case "thisWeek": return "This Week";
      case "nextWeek": return "Next Week";
      case "lastWeek": return "Last Week";
      case "thisMonth": return "This Month";
      case "lastMonth": return "Last Month";
      case "custom": 
        if (filters.customDateRange.from && filters.customDateRange.to) {
          return `${format(filters.customDateRange.from, "MMM d")} - ${format(filters.customDateRange.to, "MMM d")}`;
        }
        return "Custom Range";
      default: return "Today";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap md:flex-nowrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            className="pl-8"
            value={filters.searchTerm}
            onChange={(e) => updateFilter("searchTerm", e.target.value)}
          />
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              {filters.technicianFilter ? 
                technicians.find(t => t.id === filters.technicianFilter)?.name || "Technician" : 
                "All Technicians"}
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <div className="p-2">
              <div className="space-y-2">
                <Button 
                  variant={filters.technicianFilter === "" ? "default" : "outline"} 
                  className="w-full justify-start text-left"
                  onClick={() => updateFilter("technicianFilter", "")}
                >
                  All Technicians
                </Button>
                {technicians.map((tech) => (
                  <Button 
                    key={tech.id} 
                    variant={filters.technicianFilter === tech.id ? "default" : "outline"} 
                    className="w-full justify-start text-left"
                    onClick={() => updateFilter("technicianFilter", tech.id)}
                  >
                    {tech.name}
                  </Button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              {getDateFilterLabel()}
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start" side="bottom">
            <Tabs defaultValue="preset" className="w-full">
              <TabsList className="grid grid-cols-1 mb-2">
                <TabsTrigger value="preset">Date Options</TabsTrigger>
              </TabsList>
              <TabsContent value="preset" className="p-2 space-y-2">
                <div className="grid grid-cols-1 gap-2">
                  <Button 
                    variant={filters.dateFilter === "all" ? "default" : "outline"} 
                    className="justify-start"
                    onClick={() => handleDateFilterChange("all")}
                  >
                    All Dates
                  </Button>
                  <Button 
                    variant={filters.dateFilter === "today" ? "default" : "outline"} 
                    className="justify-start"
                    onClick={() => handleDateFilterChange("today")}
                  >
                    Today
                  </Button>
                  <Button 
                    variant={filters.dateFilter === "tomorrow" ? "default" : "outline"} 
                    className="justify-start"
                    onClick={() => handleDateFilterChange("tomorrow")}
                  >
                    Tomorrow
                  </Button>
                  <Button 
                    variant={filters.dateFilter === "thisWeek" ? "default" : "outline"} 
                    className="justify-start"
                    onClick={() => handleDateFilterChange("thisWeek")}
                  >
                    This Week
                  </Button>
                  <Button 
                    variant={filters.dateFilter === "nextWeek" ? "default" : "outline"} 
                    className="justify-start"
                    onClick={() => handleDateFilterChange("nextWeek")}
                  >
                    Next Week
                  </Button>
                  <Button 
                    variant={filters.dateFilter === "thisMonth" ? "default" : "outline"} 
                    className="justify-start"
                    onClick={() => handleDateFilterChange("thisMonth")}
                  >
                    This Month
                  </Button>
                  <Button 
                    variant={filters.dateFilter === "yesterday" ? "default" : "outline"} 
                    className="justify-start"
                    onClick={() => handleDateFilterChange("yesterday")}
                  >
                    Yesterday
                  </Button>
                  <Button 
                    variant={filters.dateFilter === "lastWeek" ? "default" : "outline"} 
                    className="justify-start"
                    onClick={() => handleDateFilterChange("lastWeek")}
                  >
                    Last Week
                  </Button>
                  <Button 
                    variant={filters.dateFilter === "lastMonth" ? "default" : "outline"} 
                    className="justify-start"
                    onClick={() => handleDateFilterChange("lastMonth")}
                  >
                    Last Month
                  </Button>
                </div>
                <div className="pt-4">
                  <CalendarComponent
                    mode="range"
                    selected={filters.customDateRange}
                    onSelect={(range) => {
                      if (range) {
                        updateFilter("customDateRange", range);
                        handleDateFilterChange("custom");
                      }
                    }}
                    numberOfMonths={1}
                    className="rounded-md border"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>
        
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
        <Button variant="outline">Export</Button>
      </div>
      
      {showFilters && (
        <div className="p-4 border rounded-md space-y-4">
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={resetFilters} className="gap-2">
              <X className="h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobFilters;
