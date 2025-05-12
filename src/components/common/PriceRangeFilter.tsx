
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { DollarSign } from "lucide-react";

interface PriceRangeFilterProps {
  minAmount: number;
  maxAmount: number;
  onRangeChange: (min: number, max: number) => void;
  label?: string;
  compact?: boolean;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  minAmount,
  maxAmount,
  onRangeChange,
  label = "Price Range",
  compact = false
}) => {
  const [min, setMin] = useState<string>(minAmount.toString());
  const [max, setMax] = useState<string>(maxAmount.toString());
  
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMin(e.target.value);
  };
  
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMax(e.target.value);
  };
  
  const handleApply = () => {
    onRangeChange(
      min ? parseFloat(min) : 0, 
      max ? parseFloat(max) : Number.MAX_SAFE_INTEGER
    );
  };

  const formatLabel = () => {
    if (minAmount === 0 && maxAmount === Number.MAX_SAFE_INTEGER) {
      return label;
    } else if (minAmount === 0) {
      return `Up to $${maxAmount.toLocaleString()}`;
    } else if (maxAmount === Number.MAX_SAFE_INTEGER) {
      return `$${minAmount.toLocaleString()}+`;
    } else {
      return `$${minAmount.toLocaleString()} - $${maxAmount.toLocaleString()}`;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size={compact ? "sm" : "default"}
          className="flex items-center gap-1"
        >
          <DollarSign className="h-4 w-4 opacity-50" />
          {formatLabel()}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-4">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Price Range</h4>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <Input 
                type="number" 
                placeholder="Min"
                className="pl-6"
                value={min}
                onChange={handleMinChange}
              />
            </div>
            <span className="text-muted-foreground">to</span>
            <div className="relative flex-1">
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <Input 
                type="number" 
                placeholder="Max"
                className="pl-6"
                value={max}
                onChange={handleMaxChange}
              />
            </div>
          </div>
          <Button 
            className="w-full" 
            onClick={handleApply}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PriceRangeFilter;
