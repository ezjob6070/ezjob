
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  X, 
  Calendar,
  ChevronDown,
  Tags
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
  FinanceFilterProps, 
  DateFilterType, 
  DateFilterCategory 
} from "./FinanceFilterTypes";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

const FinanceFilters = ({ filters, setFilters, jobSources, resetFilters }: FinanceFilterProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [dateCategory, setDateCategory] = useState<DateFilterCategory>("current");

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

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap md:flex-nowrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-8"
            value={filters.searchTerm}
            onChange={(e) => updateFilter("searchTerm", e.target.value)}
          />
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Tags className="h-4 w-4" />
              {filters.jobSourceFilter ? 
                jobSources.find(s => s.id === filters.jobSourceFilter)?.name || "Job Source" : 
                "All Job Sources"}
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <div className="p-2">
              <div className="space-y-2">
                <Button 
                  variant={filters.jobSourceFilter === "" ? "default" : "outline"} 
                  className="w-full justify-start text-left"
                  onClick={() => updateFilter("jobSourceFilter", "")}
                >
                  All Job Sources
                </Button>
                {jobSources.map((source) => (
                  <Button 
                    key={source.id} 
                    variant={filters.jobSourceFilter === source.id ? "default" : "outline"} 
                    className="w-full justify-start text-left"
                    onClick={() => updateFilter("jobSourceFilter", source.id)}
                  >
                    {source.name}
                  </Button>
                ))}
              </div>
            </div>
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
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Date Filters</h3>
              <Tabs value={dateCategory} onValueChange={(v) => setDateCategory(v as DateFilterCategory)}>
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="current">Current</TabsTrigger>
                  <TabsTrigger value="future">Future</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                  <TabsTrigger value="custom">Custom</TabsTrigger>
                </TabsList>
                <TabsContent value="current" className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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
                      variant={filters.dateFilter === "thisWeek" ? "default" : "outline"} 
                      className="justify-start"
                      onClick={() => handleDateFilterChange("thisWeek")}
                    >
                      This Week
                    </Button>
                    <Button 
                      variant={filters.dateFilter === "thisMonth" ? "default" : "outline"} 
                      className="justify-start"
                      onClick={() => handleDateFilterChange("thisMonth")}
                    >
                      This Month
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="future" className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Button 
                      variant={filters.dateFilter === "tomorrow" ? "default" : "outline"} 
                      className="justify-start"
                      onClick={() => handleDateFilterChange("tomorrow")}
                    >
                      Tomorrow
                    </Button>
                    <Button 
                      variant={filters.dateFilter === "nextWeek" ? "default" : "outline"} 
                      className="justify-start"
                      onClick={() => handleDateFilterChange("nextWeek")}
                    >
                      Next Week
                    </Button>
                    <Button 
                      variant={filters.dateFilter === "nextMonth" ? "default" : "outline"} 
                      className="justify-start"
                      onClick={() => handleDateFilterChange("nextMonth")}
                    >
                      Next Month
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="past" className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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
                </TabsContent>
                <TabsContent value="custom" className="pt-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <Calendar className="mr-2 h-4 w-4" />
                        {filters.customDateRange.from && filters.customDateRange.to ? (
                          `${format(filters.customDateRange.from, "MMM d, yyyy")} - ${format(filters.customDateRange.to, "MMM d, yyyy")}`
                        ) : (
                          "Select date range"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="range"
                        selected={filters.customDateRange as any}
                        onSelect={(range) => {
                          updateFilter("customDateRange", range as any);
                          handleDateFilterChange("custom");
                        }}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
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

export default FinanceFilters;
