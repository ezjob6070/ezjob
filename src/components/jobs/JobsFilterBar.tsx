
import React, { useState } from "react";
import { useJobsContext } from "./context/JobsContext";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Users, DollarSign, CreditCard } from "lucide-react";
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
import AmountFilter from "./AmountFilter";
import PaymentMethodFilter from "./PaymentMethodFilter";
import JobSortFilter from "./filters/JobSortFilter";

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
    // Job source related
    sourcePopoverOpen,
    setSourcePopoverOpen,
    selectedJobSources,
    toggleJobSource,
    selectAllJobSources,
    deselectAllJobSources,
    // Contractor related
    contractorPopoverOpen,
    setContractorPopoverOpen,
    selectedContractors,
    toggleContractor,
    selectAllContractors,
    deselectAllContractors,
    // Amount and Payment method
    amountPopoverOpen,
    setAmountPopoverOpen,
    amountRange,
    setAmountRange,
    paymentPopoverOpen,
    setPaymentPopoverOpen,
    paymentMethod,
    setPaymentMethod,
    // Sort
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

  // Get unique job sources from jobs
  const availableJobSources = React.useMemo(() => {
    const sources = jobs
      .map(job => job.jobSourceName)
      .filter(Boolean) as string[];
    return [...new Set(sources)].sort();
  }, [jobs]);

  // Get unique contractors from jobs
  const availableContractors = React.useMemo(() => {
    const contractors = jobs
      .map(job => job.contractorName)
      .filter(Boolean) as string[];
    return [...new Set(contractors)].sort();
  }, [jobs]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 bg-gray-50 p-3 rounded-md border border-gray-100">
      <div className="flex flex-wrap items-center gap-2">
        {/* Sort Filter */}
        <div className="mr-1">
          <JobSortFilter sortBy={sortBy} setSortBy={setSortBy} />
        </div>
        
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
        
        {/* Contractor Filter */}
        <Popover open={contractorPopoverOpen} onOpenChange={setContractorPopoverOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              role="combobox" 
              aria-expanded={contractorPopoverOpen}
              className="flex gap-1"
              size="sm"
            >
              <Users className="h-4 w-4" />
              {selectedContractors.length > 0 ? (
                <span>
                  {selectedContractors.length} contractor{selectedContractors.length > 1 ? 's' : ''}
                </span>
              ) : (
                <span>Contractors</span>
              )}
              <ChevronDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[220px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search contractors..." />
              <CommandList>
                <CommandEmpty>No contractor found.</CommandEmpty>
                <CommandGroup>
                  {availableContractors.map((contractor) => (
                    <CommandItem
                      key={contractor}
                      onSelect={() => toggleContractor(contractor)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedContractors.includes(contractor) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {contractor}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <div className="border-t p-2 flex justify-between">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => selectAllContractors()}
                    className="text-xs"
                  >
                    Select all
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => deselectAllContractors()}
                    className="text-xs"
                  >
                    Clear
                  </Button>
                </div>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        
        {/* Job Source Filter */}
        <Popover open={sourcePopoverOpen} onOpenChange={setSourcePopoverOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              role="combobox" 
              aria-expanded={sourcePopoverOpen}
              className="flex gap-1"
              size="sm"
            >
              {selectedJobSources.length > 0 ? (
                <span>
                  {selectedJobSources.length} source{selectedJobSources.length > 1 ? 's' : ''}
                </span>
              ) : (
                <span>Job Sources</span>
              )}
              <ChevronDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[220px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search job sources..." />
              <CommandList>
                <CommandEmpty>No job source found.</CommandEmpty>
                <CommandGroup>
                  {availableJobSources.map((source) => (
                    <CommandItem
                      key={source}
                      onSelect={() => toggleJobSource(source)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedJobSources.includes(source) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {source}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <div className="border-t p-2 flex justify-between">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => selectAllJobSources()}
                    className="text-xs"
                  >
                    Select all
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => deselectAllJobSources()}
                    className="text-xs"
                  >
                    Clear
                  </Button>
                </div>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        
        {/* Amount Filter */}
        <Popover open={amountPopoverOpen} onOpenChange={setAmountPopoverOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              role="combobox" 
              aria-expanded={amountPopoverOpen}
              className="flex gap-1"
              size="sm"
            >
              <DollarSign className="h-4 w-4" />
              <span>
                {amountRange ? (
                  `$${amountRange.min || 0} - $${amountRange.max || '∞'}`
                ) : (
                  "Amount"
                )}
              </span>
              <ChevronDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[220px] p-4" align="start">
            <AmountFilter value={amountRange} onChange={setAmountRange} />
          </PopoverContent>
        </Popover>
        
        {/* Payment Method Filter */}
        <Popover open={paymentPopoverOpen} onOpenChange={setPaymentPopoverOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              role="combobox" 
              aria-expanded={paymentPopoverOpen}
              className="flex gap-1"
              size="sm"
            >
              <CreditCard className="h-4 w-4" />
              <span>
                {paymentMethod ? paymentMethod.replace('_', ' ') : "Payment"}
              </span>
              <ChevronDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[220px] p-4" align="start">
            <PaymentMethodFilter value={paymentMethod} onChange={setPaymentMethod} />
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
      
      <p className="text-sm text-muted-foreground">
        Showing {filteredJobs.length} of {jobs.length} jobs
      </p>
    </div>
  );
};

export default JobsFilterBar;
