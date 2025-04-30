
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { SERVICE_TYPES } from "../constants";
import { Badge } from "@/components/ui/badge";

interface ServiceTypeFilterProps {
  selectedServiceTypes: string[];
  toggleServiceType: (serviceType: string) => void;
  clearServiceTypes: () => void;
}

export function ServiceTypeFilter({ 
  selectedServiceTypes, 
  toggleServiceType,
  clearServiceTypes
}: ServiceTypeFilterProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-start w-[240px]">
          <ChevronsUpDown className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="truncate mr-1">
            {selectedServiceTypes.length === 0
              ? "Filter by Service Type"
              : selectedServiceTypes.length === 1
              ? `Service Type: ${selectedServiceTypes[0]}`
              : `Service Types: ${selectedServiceTypes.length}`}
          </span>
          {selectedServiceTypes.length > 0 && (
            <Badge 
              variant="secondary" 
              className="ml-auto rounded-sm px-1 font-normal"
            >
              {selectedServiceTypes.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search service types..." />
          <CommandList>
            <CommandEmpty>No service types found.</CommandEmpty>
            <CommandGroup>
              {SERVICE_TYPES.map((serviceType) => {
                const isSelected = selectedServiceTypes.includes(serviceType);
                return (
                  <CommandItem
                    key={serviceType}
                    value={serviceType}
                    onSelect={() => {
                      toggleServiceType(serviceType);
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className="h-3 w-3" />
                    </div>
                    <span>{serviceType}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedServiceTypes.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => clearServiceTypes()}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default ServiceTypeFilter;
