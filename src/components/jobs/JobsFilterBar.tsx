
import React, { useState } from "react";
import { useJobsContext } from "./context/JobsContext";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Calendar, Users, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const JobsFilterBar = () => {
  const { 
    filteredJobs, 
    jobs, 
    hasActiveFilters, 
    clearFilters,
    selectedTechnicians,
    toggleTechnician,
    selectAllTechnicians,
    deselectAllTechnicians,
    sortBy,
    setSortBy
  } = useJobsContext();
  
  const [openTechnicians, setOpenTechnicians] = useState(false);
  
  // Get unique technician names from jobs
  const availableTechnicians = React.useMemo(() => {
    const techNames = jobs
      .map(job => job.technicianName)
      .filter(Boolean) as string[];
    return [...new Set(techNames)].sort();
  }, [jobs]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 bg-gray-50 p-3 rounded-md border border-gray-100">
      <div className="flex flex-wrap items-center gap-2">
        {/* Technician Filter */}
        <Popover open={openTechnicians} onOpenChange={setOpenTechnicians}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              role="combobox" 
              aria-expanded={openTechnicians}
              className="flex gap-1"
              size="sm"
            >
              <Users className="h-4 w-4" />
              {selectedTechnicians.length > 0 ? (
                <span>
                  {selectedTechnicians.length} technician{selectedTechnicians.length > 1 ? 's' : ''}
                </span>
              ) : (
                <span>Technicians</span>
              )}
              <ChevronDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[220px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search technicians..." />
              <CommandList>
                <CommandEmpty>No technician found.</CommandEmpty>
                <CommandGroup>
                  {availableTechnicians.map((tech) => (
                    <CommandItem
                      key={tech}
                      onSelect={() => toggleTechnician(tech)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedTechnicians.includes(tech) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {tech}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <div className="border-t p-2 flex justify-between">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => selectAllTechnicians()}
                    className="text-xs"
                  >
                    Select all
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => deselectAllTechnicians()}
                    className="text-xs"
                  >
                    Clear
                  </Button>
                </div>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        
        {/* Date Sort Filter */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[140px] h-9" size="sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <SelectValue placeholder="Sort by date" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
          </SelectContent>
        </Select>
        
        {hasActiveFilters && (
          <Button 
            onClick={clearFilters} 
            variant="outline"
            size="sm"
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            Clear all filters
          </Button>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground">
        Showing {filteredJobs.length} of {jobs.length} jobs
      </p>
    </div>
  );
};

export default JobsFilterBar;
