
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  SearchIcon, 
  FilterIcon, 
  XIcon, 
  CalendarIcon 
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { JobFilterProps, DateFilterType } from "./JobFilterTypes";

const JobFilters = ({ filters, setFilters, technicians, resetFilters }: JobFilterProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = <K extends keyof typeof filters>(
    key: K,
    value: typeof filters[K]
  ) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            className="pl-8"
            value={filters.searchTerm}
            onChange={(e) => updateFilter("searchTerm", e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <FilterIcon className="h-4 w-4" />
          Filters
        </Button>
        <Button variant="outline">Export</Button>
      </div>
      
      {showFilters && (
        <div className="p-4 border rounded-md space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Technician</label>
              <Select 
                value={filters.technicianFilter} 
                onValueChange={(value) => updateFilter("technicianFilter", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Technicians" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Technicians</SelectItem>
                  {technicians.map((tech) => (
                    <SelectItem key={tech.id} value={tech.id}>
                      {tech.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Date Range</label>
              <Select 
                value={filters.dateFilter} 
                onValueChange={(value) => updateFilter("dateFilter", value as DateFilterType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {filters.dateFilter === "custom" && (
              <div>
                <label className="text-sm font-medium mb-1 block">Custom Range</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.customDateRange.from && filters.customDateRange.to ? (
                        `${format(filters.customDateRange.from, "MMM d, yyyy")} - ${format(filters.customDateRange.to, "MMM d, yyyy")}`
                      ) : (
                        "Select date range"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={filters.customDateRange}
                      onSelect={(range) => updateFilter("customDateRange", range as any)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={resetFilters} className="gap-2">
              <XIcon className="h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobFilters;
