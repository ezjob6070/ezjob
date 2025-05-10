import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AmountRange } from "@/components/jobs/AmountFilter";
import { PaymentMethod } from "@/components/jobs/JobTypes";

interface CustomFilterDialogContentProps {
  selectedTechnicians: string[];
  setSelectedTechnicians: (technicians: string[]) => void;
  technicianNames: { id: string; name: string }[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  categoryNames: string[];
  selectedJobSources: string[];
  setSelectedJobSources: (jobSources: string[]) => void;
  jobSourceNames: { id: string; name: string }[];
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  amountRange: AmountRange | null;
  setAmountRange: (range: AmountRange | null) => void;
  paymentMethod: PaymentMethod | null;
  setPaymentMethod: (method: PaymentMethod | null) => void;
  selectAllTechnicians: () => void;
  deselectAllTechnicians: () => void;
  selectAllCategories: () => void;
  deselectAllCategories: () => void;
  selectAllJobSources: () => void;
  deselectAllJobSources: () => void;
}

const CustomFilterDialogContent: React.FC<CustomFilterDialogContentProps> = ({
  selectedTechnicians,
  setSelectedTechnicians,
  technicianNames,
  selectedCategories,
  setSelectedCategories,
  categoryNames,
  selectedJobSources,
  setSelectedJobSources,
  jobSourceNames,
  date,
  setDate,
  amountRange,
  setAmountRange,
  paymentMethod,
  setPaymentMethod,
  selectAllTechnicians,
  deselectAllTechnicians,
  selectAllCategories,
  deselectAllCategories,
  selectAllJobSources,
  deselectAllJobSources,
}) => {
  const [localAmountRange, setLocalAmountRange] = useState<number[]>([0, 5000]);

  useEffect(() => {
    if (amountRange) {
      setLocalAmountRange([amountRange.min, amountRange.max]);
    }
  }, [amountRange]);

  const handleAmountRangeChange = (values: number[]) => {
    setLocalAmountRange(values);
    setAmountRange({
      min: values[0],
      max: values[1],
    });
  };

  const handleTechnicianChange = (technicianId: string, checked: boolean) => {
    if (checked) {
      setSelectedTechnicians([...selectedTechnicians, technicianId]);
    } else {
      setSelectedTechnicians(
        selectedTechnicians.filter((id) => id !== technicianId)
      );
    }
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((c) => c !== category)
      );
    }
  };

  const handleJobSourceChange = (jobSourceId: string, checked: boolean) => {
    if (checked) {
      setSelectedJobSources([...selectedJobSources, jobSourceId]);
    } else {
      setSelectedJobSources(
        selectedJobSources.filter((id) => id !== jobSourceId)
      );
    }
  };

  const handlePaymentMethodChange = (method: PaymentMethod, checked: boolean) => {
    if (checked) {
      setPaymentMethod(method);
    } else {
      setPaymentMethod(null);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Filter by Technician</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={selectAllTechnicians}
            className="h-8 text-xs"
          >
            Select All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={deselectAllTechnicians}
            className="h-8 text-xs"
          >
            Clear All
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {technicianNames.map((technician) => (
            <div key={technician.id} className="flex items-center space-x-2">
              <Checkbox
                id={`technician-${technician.id}`}
                checked={selectedTechnicians.includes(technician.id)}
                onCheckedChange={(checked) =>
                  handleTechnicianChange(technician.id, checked === true)
                }
              />
              <Label
                htmlFor={`technician-${technician.id}`}
                className="text-sm"
              >
                {technician.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Filter by Category</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={selectAllCategories}
            className="h-8 text-xs"
          >
            Select All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={deselectAllCategories}
            className="h-8 text-xs"
          >
            Clear All
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {categoryNames.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) =>
                  handleCategoryChange(category, checked === true)
                }
              />
              <Label
                htmlFor={`category-${category}`}
                className="text-sm"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Filter by Job Source</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={selectAllJobSources}
            className="h-8 text-xs"
          >
            Select All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={deselectAllJobSources}
            className="h-8 text-xs"
          >
            Clear All
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {jobSourceNames.map((jobSource) => (
            <div key={jobSource.id} className="flex items-center space-x-2">
              <Checkbox
                id={`jobSource-${jobSource.id}`}
                checked={selectedJobSources.includes(jobSource.id)}
                onCheckedChange={(checked) =>
                  handleJobSourceChange(jobSource.id, checked === true)
                }
              />
              <Label
                htmlFor={`jobSource-${jobSource.id}`}
                className="text-sm"
              >
                {jobSource.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Filter by Date Range</h3>
        <div className="grid gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
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
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={(value) => {
                  const dateRange = {
                    from: value?.from ? new Date(value.from) : undefined,
                    to: value?.to ? new Date(value.to) : undefined
                  };
                  setDate(dateRange);
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Filter by Amount</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>${localAmountRange[0]}</span>
            <span>${localAmountRange[1]}</span>
          </div>
          <Slider
            defaultValue={[0, 5000]}
            min={0}
            max={5000}
            step={100}
            value={localAmountRange}
            onValueChange={handleAmountRangeChange}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Filter by Payment Method</h3>
        <div className="grid grid-cols-2 gap-2">
          {["cash", "credit", "check", "online"].map((method) => (
            <div key={method} className="flex items-center space-x-2">
              <Checkbox
                id={`payment-${method}`}
                checked={paymentMethod === method}
                onCheckedChange={(checked) =>
                  handlePaymentMethodChange(method as PaymentMethod, checked === true)
                }
              />
              <Label
                htmlFor={`payment-${method}`}
                className="text-sm capitalize"
              >
                {typeof method === "function" ? method(checked) : method}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomFilterDialogContent;
