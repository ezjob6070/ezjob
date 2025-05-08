
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
  CommandList,
  CommandSeparator
} from "@/components/ui/command";
import { Check, Filter, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TechnicianFilter, FilterGroup } from "../JobTypes";
import { cn } from "@/lib/utils";

interface TechnicianFilterDropdownProps {
  technicianGroups: FilterGroup[];
  selectedTechnicians: string[];
  onToggleTechnician: (name: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

const TechnicianFilterDropdown: React.FC<TechnicianFilterDropdownProps> = ({
  technicianGroups,
  selectedTechnicians,
  onToggleTechnician,
  onSelectAll,
  onDeselectAll
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Count the total number of technicians
  const totalTechnicians = technicianGroups.reduce(
    (sum, group) => sum + group.filters.length, 0
  );
  
  // Check if all technicians are selected
  const allSelected = selectedTechnicians.length === totalTechnicians && totalTechnicians > 0;
  
  // Filter groups based on search query
  const filteredGroups = technicianGroups
    .map(group => ({
      ...group,
      filters: group.filters.filter(tech => 
        tech.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter(group => group.filters.length > 0);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={cn(
            "flex items-center justify-between gap-1 h-9",
            selectedTechnicians.length > 0 && "bg-blue-50 text-blue-600 border-blue-200"
          )}
        >
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            <span>Technicians</span>
          </div>
          {selectedTechnicians.length > 0 && (
            <Badge variant="secondary" className="ml-1 bg-blue-100">
              {selectedTechnicians.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="h-4 w-4 text-muted-foreground mr-2" />
            <CommandInput 
              placeholder="Search technicians..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="border-0 focus:ring-0 h-9"
            />
          </div>
          <CommandList className="max-h-[300px]">
            <CommandEmpty>No technicians found.</CommandEmpty>
            
            <CommandGroup className="px-2 py-1">
              <div className="flex items-center justify-between py-1">
                <span className="text-sm font-medium">Select All Technicians</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={() => allSelected ? onDeselectAll() : onSelectAll()}
                >
                  {allSelected ? "Deselect All" : "Select All"}
                </Button>
              </div>
            </CommandGroup>
            
            <CommandSeparator />
            
            {filteredGroups.map((group) => (
              <CommandGroup key={group.name} heading={group.name} className="px-2">
                {group.filters.map((tech) => (
                  <CommandItem
                    key={tech.name}
                    onSelect={() => onToggleTechnician(tech.name)}
                    className="flex items-center py-1 cursor-pointer"
                  >
                    <div className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-sm border mr-2",
                      selectedTechnicians.includes(tech.name) 
                        ? "bg-primary border-primary" 
                        : "border-muted-foreground"
                    )}>
                      {selectedTechnicians.includes(tech.name) && 
                        <Check className="h-3 w-3 text-white" />
                      }
                    </div>
                    <span>{tech.name}</span>
                    {tech.role && (
                      <Badge variant="outline" className="ml-auto text-xs">
                        {tech.role}
                      </Badge>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
            
            {filteredGroups.length === 0 && searchQuery && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No technicians match your search.
              </div>
            )}
          </CommandList>
          
          <div className="flex items-center justify-between border-t p-2">
            <div className="text-xs text-muted-foreground">
              {selectedTechnicians.length} of {totalTechnicians} selected
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  onDeselectAll();
                  setOpen(false);
                }}
                className="h-7 text-xs"
              >
                Clear
              </Button>
              <Button 
                size="sm" 
                onClick={() => setOpen(false)}
                className="h-7 text-xs"
              >
                Apply
              </Button>
            </div>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TechnicianFilterDropdown;
