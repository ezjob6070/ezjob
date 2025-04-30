import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CalendarIcon, Check, ChevronsUpDown, Filter, PlusCircle, Search, Settings } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { JOB_CATEGORIES, SERVICE_TYPES } from "./constants";

interface JobCategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onToggle: (categoryName: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

const JobCategoryFilter: React.FC<JobCategoryFilterProps> = ({
  categories,
  selectedCategories,
  onToggle,
  onSelectAll,
  onDeselectAll,
}) => {
  const allSelected = categories.every((category) =>
    selectedCategories.includes(category)
  );

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold">Job Categories</h4>
        <Button variant="ghost" size="sm" onClick={allSelected ? onDeselectAll : onSelectAll}>
          {allSelected ? "Deselect All" : "Select All"}
        </Button>
      </div>
      <ScrollArea className="max-h-48">
        {categories.map((category) => (
          <div key={category} className="flex items-center space-x-2 py-1">
            <Checkbox
              id={`category-${category}`}
              checked={selectedCategories.includes(category)}
              onCheckedChange={() => onToggle(category)}
            />
            <label
              htmlFor={`category-${category}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {category}
            </label>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

interface JobServiceTypeFilterProps {
  serviceTypes: string[];
  selectedServiceTypes: string[];
  onToggle: (serviceTypeName: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

const JobServiceTypeFilter: React.FC<JobServiceTypeFilterProps> = ({
  serviceTypes,
  selectedServiceTypes,
  onToggle,
  onSelectAll,
  onDeselectAll,
}) => {
  const allSelected = serviceTypes.every((serviceType) =>
    selectedServiceTypes.includes(serviceType)
  );

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold">Service Types</h4>
        <Button variant="ghost" size="sm" onClick={allSelected ? onDeselectAll : onSelectAll}>
          {allSelected ? "Deselect All" : "Select All"}
        </Button>
      </div>
      <ScrollArea className="max-h-48">
        {serviceTypes.map((serviceType) => (
          <div key={serviceType} className="flex items-center space-x-2 py-1">
            <Checkbox
              id={`serviceType-${serviceType}`}
              checked={selectedServiceTypes.includes(serviceType)}
              onCheckedChange={() => onToggle(serviceType)}
            />
            <label
              htmlFor={`serviceType-${serviceType}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {serviceType}
            </label>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

interface JobSourceFilterProps {
  jobSources: string[];
  selectedSources: string[];
  onToggle: (sourceName: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

const JobSourceFilter: React.FC<JobSourceFilterProps> = ({
  jobSources,
  selectedSources,
  onToggle,
  onSelectAll,
  onDeselectAll,
}) => {
  const allSelected = jobSources.every((source) =>
    selectedSources.includes(source)
  );

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold">Job Sources</h4>
        <Button variant="ghost" size="sm" onClick={allSelected ? onDeselectAll : onSelectAll}>
          {allSelected ? "Deselect All" : "Select All"}
        </Button>
      </div>
      <ScrollArea className="max-h-48">
        {jobSources.map((source) => (
          <div key={source} className="flex items-center space-x-2 py-1">
            <Checkbox
              id={`source-${source}`}
              checked={selectedSources.includes(source)}
              onCheckedChange={() => onToggle(source)}
            />
            <label
              htmlFor={`source-${source}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {source}
            </label>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

interface DateRangePickerProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ date, setDate }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[300px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
};

interface JobsFilterPopoversProps {
  categories: string[];
  selectedCategories: string[];
  toggleCategory: (categoryName: string) => void;
  selectAllCategories: () => void;
  deselectAllCategories: () => void;
  serviceTypes: string[];
  selectedServiceTypes: string[];
  toggleServiceType: (serviceTypeName: string) => void;
  selectAllServiceTypes: () => void;
  deselectAllServiceTypes: () => void;
  jobSources: string[];
  selectedSources: string[];
  toggleSource: (sourceName: string) => void;
  selectAllSources: () => void;
  deselectAllSources: () => void;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}

const JobsFilterPopovers: React.FC<JobsFilterPopoversProps> = ({
  categories,
  selectedCategories,
  toggleCategory,
  selectAllCategories,
  deselectAllCategories,
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
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={false}>
            <Filter className="mr-2 h-4 w-4" />
            Categories
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <JobCategoryFilter
            categories={categories}
            selectedCategories={selectedCategories}
            onToggle={toggleCategory}
            onSelectAll={selectAllCategories}
            onDeselectAll={deselectAllCategories}
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={false}>
            <Settings className="mr-2 h-4 w-4" />
            Service Types
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <JobServiceTypeFilter
            serviceTypes={serviceTypes}
            selectedServiceTypes={selectedServiceTypes}
            onToggle={toggleServiceType}
            onSelectAll={selectAllServiceTypes}
            onDeselectAll={deselectAllServiceTypes}
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={false}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Sources
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <JobSourceFilter
            jobSources={jobSources}
            selectedSources={selectedSources}
            onToggle={toggleSource}
            onSelectAll={selectAllSources}
            onDeselectAll={deselectAllSources}
          />
        </PopoverContent>
      </Popover>

      <DateRangePicker date={date} setDate={setDate} />
    </div>
  );
};

export default JobsFilterPopovers;
