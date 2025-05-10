
import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown, Check, Filter } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import AmountFilter from "@/components/jobs/AmountFilter";
import PaymentMethodFilter from "@/components/jobs/PaymentMethodFilter";
import { DateRange } from "react-day-picker";
import { JobFiltersState } from "@/components/jobs/jobHookTypes";
import { AmountRange, PaymentMethod } from "@/components/jobs/JobTypes";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface JobsFilterBarProps {
  technicianNames: { id: string; name: string }[];
  jobSources: { id: string; name: string }[];
  categories: string[];
  filters: JobFiltersState;
  setFilters: (filters: JobFiltersState) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  selectAllTechnicians: () => void;
  deselectAllTechnicians: () => void;
  selectAllContractors: () => void;
  deselectAllContractors: () => void;
}

const JobsFilterBar: React.FC<JobsFilterBarProps> = ({
  technicianNames,
  jobSources,
  categories,
  filters,
  setFilters,
  onApplyFilters,
  onClearFilters,
  selectAllTechnicians,
  deselectAllTechnicians,
  selectAllContractors,
  deselectAllContractors
}) => {
  const [open, setOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("date");
  const [isAllTechniciansSelected, setIsAllTechniciansSelected] = useState(false);
  const [isAllContractorsSelected, setIsAllContractorsSelected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (technicianNames && filters.selectedTechnicians) {
      setIsAllTechniciansSelected(filters.selectedTechnicians.length === technicianNames.length);
    }
  }, [filters.selectedTechnicians, technicianNames]);

  const handleDateChange = (date: DateRange | undefined) => {
    setFilters({ ...filters, date });
  };

  const handleAmountRangeChange = (amountRange: AmountRange | null) => {
    setFilters({ ...filters, amountRange });
  };

  const handlePaymentMethodChange = (paymentMethod: PaymentMethod | null) => {
    setFilters({ ...filters, paymentMethod });
  };

  const handleTechnicianSelection = (technicianId: string) => {
    if (filters.selectedTechnicians.includes(technicianId)) {
      setFilters({
        ...filters,
        selectedTechnicians: filters.selectedTechnicians.filter((id) => id !== technicianId),
      });
    } else {
      setFilters({
        ...filters,
        selectedTechnicians: [...filters.selectedTechnicians, technicianId],
      });
    }
  };

  const handleCategorySelection = (category: string) => {
    if (filters.selectedCategories.includes(category)) {
      setFilters({
        ...filters,
        selectedCategories: filters.selectedCategories.filter((c) => c !== category),
      });
    } else {
      setFilters({
        ...filters,
        selectedCategories: [...filters.selectedCategories, category],
      });
    }
  };

  const handleJobSourceSelection = (jobSourceId: string) => {
    if (filters.selectedJobSources.includes(jobSourceId)) {
      setFilters({
        ...filters,
        selectedJobSources: filters.selectedJobSources.filter((id) => id !== jobSourceId),
      });
    } else {
      setFilters({
        ...filters,
        selectedJobSources: [...filters.selectedJobSources, jobSourceId],
      });
    }
  };

  const handleApplyFilters = () => {
    setFilters({ ...filters, appliedFilters: true });
    onApplyFilters();
    toast({
      title: "Filters Applied",
      description: "The filters have been successfully applied.",
    });
    setOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({
      selectedTechnicians: [],
      selectedCategories: [],
      selectedJobSources: [],
      date: undefined,
      amountRange: null,
      paymentMethod: null,
      appliedFilters: false,
    });
    onClearFilters();
    toast({
      title: "Filters Cleared",
      description: "All filters have been cleared.",
    });
    setOpen(false);
  };

  const handleSelectAllTechnicians = () => {
    if (isAllTechniciansSelected) {
      deselectAllTechnicians();
      setIsAllTechniciansSelected(false);
    } else {
      selectAllTechnicians();
      setIsAllTechniciansSelected(true);
    }
  };

  const handleSortChange = (value: string) => {
    setSortOption(value as SortOption);
  };

  return (
    <div className="flex items-center justify-between py-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
            Filters
            <Filter className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[600px] p-5" align="start">
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Technicians</h4>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                <div className="flex flex-col space-y-1">
                  <div className="pl-1 flex items-center space-x-2">
                    <Checkbox
                      id="select-all"
                      checked={isAllTechniciansSelected}
                      onCheckedChange={handleSelectAllTechnicians}
                    />
                    <Label htmlFor="select-all">Select All</Label>
                  </div>
                  {technicianNames.map((technician) => (
                    <div key={technician.id} className="pl-1 flex items-center space-x-2">
                      <Checkbox
                        id={technician.id}
                        checked={filters.selectedTechnicians.includes(technician.id)}
                        onCheckedChange={() => handleTechnicianSelection(technician.id)}
                      />
                      <Label htmlFor={technician.id}>{technician.name}</Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={filters.selectedCategories.includes(category) ? "default" : "secondary"}
                    onClick={() => handleCategorySelection(category)}
                    className="cursor-pointer"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Job Sources</h4>
              <ScrollArea className="h-[150px] w-full rounded-md border p-4">
                <div className="flex flex-col space-y-1">
                  {jobSources.map((jobSource) => (
                    <div key={jobSource.id} className="pl-1 flex items-center space-x-2">
                      <Checkbox
                        id={jobSource.id}
                        checked={filters.selectedJobSources.includes(jobSource.id)}
                        onCheckedChange={() => handleJobSourceSelection(jobSource.id)}
                      />
                      <Label htmlFor={jobSource.id}>{jobSource.name}</Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Date Range</h4>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !filters.date && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {filters.date?.from ? (
                      filters.date.to ? (
                        `${format(filters.date.from, "LLL dd, y")} - ${format(filters.date.to, "LLL dd, y")}`
                      ) : (
                        format(filters.date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <CalendarComponent
                    mode="range"
                    defaultMonth={filters.date?.from}
                    selected={filters.date}
                    onSelect={handleDateChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("2023-01-01")
                    }
                    numberOfMonths={2}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Amount Range</h4>
              <AmountFilter
                amountRange={filters.amountRange}
                onAmountRangeChange={handleAmountRangeChange}
              />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Payment Method</h4>
              <PaymentMethodFilter
                paymentMethod={filters.paymentMethod}
                onPaymentMethodChange={handlePaymentMethodChange}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleClearFilters}>
              Clear Filters
            </Button>
            <Button size="sm" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <Popover open={sortOpen} onOpenChange={setSortOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={sortOpen} className="w-[150px] justify-between">
            Sort By
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandList>
              <CommandGroup>
                <CommandItem
                  value="date"
                  onSelect={(value) => {
                    handleSortChange(value);
                    setSortOpen(false);
                  }}
                >
                  Date
                  {sortOption === "date" && <Check className="ml-auto h-4 w-4" />}
                </CommandItem>
                <CommandItem
                  value="amount"
                  onSelect={(value) => {
                    handleSortChange(value);
                    setSortOpen(false);
                  }}
                >
                  Amount
                  {sortOption === "amount" && <Check className="ml-auto h-4 w-4" />}
                </CommandItem>
                <CommandItem
                  value="status"
                  onSelect={(value) => {
                    handleSortChange(value);
                    setSortOpen(false);
                  }}
                >
                  Status
                  {sortOption === "status" && <Check className="ml-auto h-4 w-4" />}
                </CommandItem>
                <CommandItem
                  value="client"
                  onSelect={(value) => {
                    handleSortChange(value);
                    setSortOpen(false);
                  }}
                >
                  Client
                  {sortOption === "client" && <Check className="ml-auto h-4 w-4" />}
                </CommandItem>
                <CommandItem
                  value="technician"
                  onSelect={(value) => {
                    handleSortChange(value);
                    setSortOpen(false);
                  }}
                >
                  Technician
                  {sortOption === "technician" && <Check className="ml-auto h-4 w-4" />}
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default JobsFilterBar;

// Define the SortOption type or interface if it doesn't exist
type SortOption = "date" | "amount" | "status" | "client" | "technician";
