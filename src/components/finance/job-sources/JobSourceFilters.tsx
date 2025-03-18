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
import { format, isAfter, isBefore, isToday, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths } from "date-fns";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface JobSourceFiltersProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  selectedJobSources: string[];
  setSelectedJobSources: React.Dispatch<React.SetStateAction<string[]>>;
  jobSourceNames: string[];
  appliedFilters: boolean;
  setAppliedFilters: (applied: boolean) => void;
  clearFilters: () => void;
}

const JobSourceFilters: React.FC<JobSourceFiltersProps> = ({
  date,
  setDate,
  selectedJobSources,
  setSelectedJobSources,
  jobSourceNames,
  appliedFilters,
  setAppliedFilters,
  clearFilters
}) => {
  const [showSourceFilter, setShowSourceFilter] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [sourceSearchQuery, setSourceSearchQuery] = useState("");

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
  
  const toggleJobSource = (sourceName: string) => {
    setSelectedJobSources(prev => 
      prev.includes(sourceName) 
        ? prev.filter(t => t !== sourceName)
        : [...prev, sourceName]
    );
  };

  const toggleAllJobSources = (checked: boolean) => {
    if (checked) {
      setSelectedJobSources(
        sourceSearchQuery 
          ? jobSourceNames.filter(name => name.toLowerCase().includes(sourceSearchQuery.toLowerCase()))
          : [...jobSourceNames]
      );
    } else {
      setSelectedJobSources([]);
    }
  };

  const filteredJobSourcesForSelection = jobSourceNames.filter(
    source => source.toLowerCase().includes(sourceSearchQuery.toLowerCase())
  );

  const allJobSourcesSelected = 
    filteredJobSourcesForSelection.length > 0 && 
    filteredJobSourcesForSelection.every(source => selectedJobSources.includes(source));
  
  const someJobSourcesSelected = 
    selectedJobSources.length > 0 && 
    !allJobSourcesSelected;

  const applyFilters = () => {
    setAppliedFilters(true);
    setShowSourceFilter(false);
    setShowDateFilter(false);
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

      <Popover open={showSourceFilter} onOpenChange={setShowSourceFilter}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {selectedJobSources.length > 0 
              ? `${selectedJobSources.length} sources selected` 
              : "Filter Job Sources"
            }
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <div className="p-3">
            <Input 
              type="text" 
              placeholder="Search sources..." 
              className="mb-3" 
              value={sourceSearchQuery}
              onChange={(e) => setSourceSearchQuery(e.target.value)}
            />
            <div className="flex items-center space-x-2 py-2 border-b border-gray-200 mb-2">
              <Checkbox 
                id="select-all-sources"
                checked={allJobSourcesSelected}
                data-state={
                  someJobSourcesSelected 
                    ? "indeterminate" 
                    : allJobSourcesSelected 
                      ? "checked" 
                      : "unchecked"
                }
                onCheckedChange={toggleAllJobSources}
              />
              <label 
                htmlFor="select-all-sources"
                className="text-sm font-medium cursor-pointer"
              >
                Select All Job Sources
              </label>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {filteredJobSourcesForSelection.map(source => (
                <div key={source} className="flex items-center space-x-2 py-1">
                  <Checkbox 
                    id={`source-${source}`} 
                    checked={selectedJobSources.includes(source)}
                    onCheckedChange={() => toggleJobSource(source)}
                  />
                  <label 
                    htmlFor={`source-${source}`}
                    className="text-sm cursor-pointer"
                  >
                    {source}
                  </label>
                </div>
              ))}
              {filteredJobSourcesForSelection.length === 0 && (
                <div className="text-sm text-muted-foreground py-2">No job sources found</div>
              )}
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

export default JobSourceFilters;
