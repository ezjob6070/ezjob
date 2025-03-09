
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DollarSign, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export interface AmountRange {
  min?: number;
  max?: number;
  label: string;
}

const DEFAULT_RANGES: AmountRange[] = [
  { max: 100, label: "Up to $100" },
  { min: 100, max: 500, label: "$100 - $500" },
  { min: 500, max: 1000, label: "$500 - $1,000" },
  { min: 1000, max: 2000, label: "$1,000 - $2,000" },
  { min: 2000, label: "Above $2,000" },
];

interface AmountFilterProps {
  selectedRange: AmountRange | null;
  onRangeChange: (range: AmountRange | null) => void;
}

const AmountFilter: React.FC<AmountFilterProps> = ({ 
  selectedRange, 
  onRangeChange 
}) => {
  const [customMin, setCustomMin] = useState<string>("");
  const [customMax, setCustomMax] = useState<string>("");
  const [isCustom, setIsCustom] = useState(false);

  const handlePresetSelect = (range: AmountRange) => {
    onRangeChange(range);
    setIsCustom(false);
  };

  const handleCustomApply = () => {
    const min = customMin ? parseInt(customMin, 10) : undefined;
    const max = customMax ? parseInt(customMax, 10) : undefined;
    
    if (min !== undefined || max !== undefined) {
      onRangeChange({
        min,
        max,
        label: `${min !== undefined ? `$${min}` : '$0'} - ${max !== undefined ? `$${max}` : 'Any'}`
      });
    }
  };

  const handleClearRange = () => {
    onRangeChange(null);
    setCustomMin("");
    setCustomMax("");
    setIsCustom(false);
  };

  const handleRadioChange = (value: string) => {
    if (value === "custom") {
      setIsCustom(true);
    } else {
      setIsCustom(false);
      const selectedPreset = DEFAULT_RANGES.find((_, index) => index.toString() === value);
      if (selectedPreset) {
        onRangeChange(selectedPreset);
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-auto justify-between px-3 py-5 text-base font-medium"
        >
          <DollarSign className="mr-2 h-4 w-4" />
          {selectedRange ? selectedRange.label : "Filter by Amount"}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px]" align="start">
        <div className="space-y-4">
          <h4 className="font-medium">Amount Range</h4>
          
          <RadioGroup 
            value={isCustom ? "custom" : selectedRange ? DEFAULT_RANGES.findIndex(r => 
              r.min === selectedRange.min && r.max === selectedRange.max).toString() : ""}
            onValueChange={handleRadioChange}
          >
            {DEFAULT_RANGES.map((range, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`range-${index}`} />
                <Label htmlFor={`range-${index}`} className="flex-grow cursor-pointer">
                  {range.label}
                </Label>
              </div>
            ))}

            <div className="flex items-center space-x-2 pt-2">
              <RadioGroupItem value="custom" id="custom-range" />
              <Label htmlFor="custom-range" className="cursor-pointer">Custom range</Label>
            </div>
          </RadioGroup>

          {isCustom && (
            <div className="space-y-2 pt-2">
              <div className="flex gap-2 items-center">
                <div className="flex-1">
                  <Label htmlFor="min-amount">Min ($)</Label>
                  <Input
                    id="min-amount"
                    type="number"
                    placeholder="Min"
                    value={customMin}
                    onChange={(e) => setCustomMin(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="max-amount">Max ($)</Label>
                  <Input
                    id="max-amount"
                    type="number"
                    placeholder="Max"
                    value={customMax}
                    onChange={(e) => setCustomMax(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                onClick={handleCustomApply} 
                className="w-full" 
                variant="default"
              >
                Apply
              </Button>
            </div>
          )}

          {selectedRange && (
            <Button 
              onClick={handleClearRange} 
              variant="outline" 
              className="w-full mt-2"
            >
              Clear
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AmountFilter;
