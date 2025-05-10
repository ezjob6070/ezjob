
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface AmountRange {
  min?: number;
  max?: number;
}

export interface AmountFilterProps {
  value: AmountRange | null;
  onChange: (range: AmountRange | null) => void;
}

const AmountFilter = ({ value, onChange }: AmountFilterProps) => {
  const [minAmount, setMinAmount] = useState<string>(value?.min?.toString() || "");
  const [maxAmount, setMaxAmount] = useState<string>(value?.max?.toString() || "");
  
  useEffect(() => {
    setMinAmount(value?.min?.toString() || "");
    setMaxAmount(value?.max?.toString() || "");
  }, [value]);

  const handleApply = () => {
    const min = minAmount ? parseInt(minAmount) : undefined;
    const max = maxAmount ? parseInt(maxAmount) : undefined;
    
    if (min === undefined && max === undefined) {
      onChange(null);
    } else {
      onChange({ min, max });
    }
  };

  const handleClear = () => {
    setMinAmount("");
    setMaxAmount("");
    onChange(null);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="min-amount">Minimum Amount ($)</Label>
        <Input
          id="min-amount"
          type="number"
          min="0"
          placeholder="Min amount"
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="max-amount">Maximum Amount ($)</Label>
        <Input
          id="max-amount"
          type="number"
          min="0"
          placeholder="Max amount"
          value={maxAmount}
          onChange={(e) => setMaxAmount(e.target.value)}
        />
      </div>
      
      <div className="flex justify-between gap-2">
        <Button 
          variant="outline" 
          size="sm"
          className="flex-1"
          onClick={handleClear}
        >
          Clear
        </Button>
        <Button 
          size="sm"
          className="flex-1"
          onClick={handleApply}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default AmountFilter;
