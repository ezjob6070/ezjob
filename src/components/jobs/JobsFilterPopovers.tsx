import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, CaretSortIcon, CheckCircledIcon, FunnelIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface JobsFilterPopoversProps {
  categories: string[];
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  selectAllCategories: () => void;
  deselectAllCategories: () => void;
  serviceTypes: string[];
  selectedServiceTypes: string[];
  toggleServiceType: (serviceType: string) => void;
  selectAllServiceTypes: () => void;
  deselectAllServiceTypes: () => void;
  jobSources: string[];
  selectedSources: string[];
  toggleSource: (source: string) => void;
  selectAllSources: () => void;
  deselectAllSources: () => void;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  // New contractor filters
  contractorNames: string[];
  selectedContractors: string[];
  toggleContractor: (contractor: string) => void;
  selectAllContractors: () => void;
  deselectAllContractors: () => void;
}

const JobsFilterPopovers: React.FC<JobsFilterPopoversProps> = ({
  serviceTypes,
  selectedServiceTypes,
  toggleServiceType,
  selectAllServiceTypes,
  deselectAllServiceTypes,
  jobSources,
  selectedSources,
  toggleSource,
  selectAllSources,
  deselectAllSources,
  date,
  setDate,
  // New contractor props
  contractorNames,
  selectedContractors,
  toggleContractor,
  selectAllContractors,
  deselectAllContractors
}) => {
  const [openServiceType, setOpenServiceType] = useState(false);
  const [openJobSource, setOpenJobSource] = useState(false);
  const [openContractor, setOpenContractor] = useState(false);
  const [openDate, setOpenDate] = useState(false);

  return (
    <div className="flex flex-wrap gap-2">
      {/* Service Type Filter */}
      <div className="relative">
        <Popover open={openServiceType} onOpenChange={setOpenServiceType}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={openServiceType} className="w-[200px] justify-between">
              {selectedServiceTypes.length > 0 ? selectedServiceTypes.join(", ") : "Select service type"}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandList>
                <CommandEmpty>No service type found.</CommandEmpty>
                <CommandGroup>
                  {serviceTypes.map((serviceType) => (
                    <CommandItem
                      key={serviceType}
                      onSelect={() => {
                        toggleServiceType(serviceType);
                        setOpenServiceType(false);
                      }}
                    >
                      <CheckCircledIcon className={cn("mr-2 h-4 w-4")} />
                      {serviceType}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Job Source Filter */}
      <div className="relative">
        <Popover open={openJobSource} onOpenChange={setOpenJobSource}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={openJobSource} className="w-[200px] justify-between">
              {selectedSources.length > 0 ? selectedSources.join(", ") : "Select job source"}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandList>
                <CommandEmpty>No job source found.</CommandEmpty>
                <CommandGroup>
                  {jobSources.map((source) => (
                    <CommandItem
                      key={source}
                      onSelect={() => {
                        toggleSource(source);
                        setOpenJobSource(false);
                      }}
                    >
                      <CheckCircledIcon className={cn("mr-2 h-4 w-4")} />
                      {source}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Contractor Filter */}
      <div className="relative">
        <Popover open={openContractor} onOpenChange={setOpenContractor}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={openContractor} className="w-[200px] justify-between">
              {selectedContractors.length > 0 ? selectedContractors.join(", ") : "Select contractor"}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandList>
                <CommandEmpty>No contractor found.</CommandEmpty>
                <CommandGroup>
                  {contractorNames.map((contractor) => (
                    <CommandItem
                      key={contractor}
                      onSelect={() => {
                        toggleContractor(contractor);
                        setOpenContractor(false);
                      }}
                    >
                      <CheckCircledIcon className={cn("mr-2 h-4 w-4")} />
                      {contractor}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Date Filter */}
      <div className="relative">
        <Popover open={openDate} onOpenChange={setOpenDate}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[200px] justify-between text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  `${format(date.from, "MMM dd, yyyy")} - ${format(date.to, "MMM dd, yyyy")}`
                ) : (
                  format(date.from, "MMM dd, yyyy")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
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
  );
};

export default JobsFilterPopovers;
