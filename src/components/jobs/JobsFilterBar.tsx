
import React, { useState } from "react";
import { useJobsContext } from "./context/JobsContext";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Users } from "lucide-react";
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

const JobsFilterBar = () => {
  const { 
    filteredJobs, 
    jobs, 
    hasActiveFilters, 
    clearFilters,
    selectedTechnicians,
    toggleTechnician,
    selectAllTechnicians,
    deselectAllTechnicians
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
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="text-sm text-muted-foreground">
        Showing {filteredJobs.length} of {jobs.length} jobs
      </p>
      
      <div className="flex flex-wrap gap-2">
        {/* Technician Filter */}
        <Popover open={openTechnicians} onOpenChange={setOpenTechnicians}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              role="combobox" 
              aria-expanded={openTechnicians}
              className="flex gap-1"
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
          <PopoverContent className="w-[220px] p-0" align="end">
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
    </div>
  );
};

export default JobsFilterBar;
