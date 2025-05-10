
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface AmountRange {
  min?: number;
  max?: number;
}

export interface AmountFilterProps {
  amountRange: AmountRange | null;
  onAmountRangeChange: (amountRange: AmountRange | null) => void;
}

export const AmountFilter = ({ amountRange, onAmountRangeChange }: AmountFilterProps) => {
  const [minAmount, setMinAmount] = useState<string>(amountRange?.min?.toString() || "");
  const [maxAmount, setMaxAmount] = useState<string>(amountRange?.max?.toString() || "");

  const handleApply = () => {
    onAmountRangeChange({
      min: minAmount ? parseInt(minAmount) : undefined,
      max: maxAmount ? parseInt(maxAmount) : undefined
    });
  };

  const handleClear = () => {
    setMinAmount("");
    setMaxAmount("");
    onAmountRangeChange(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-medium mb-1 block">Min Amount</label>
          <Input
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            type="number"
            placeholder="Min"
            className="h-8"
          />
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">Max Amount</label>
          <Input
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            type="number"
            placeholder="Max"
            className="h-8"
          />
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          className="w-full"
          onClick={handleClear}
        >
          Clear
        </Button>
        <Button 
          size="sm"
          className="w-full"
          onClick={handleApply}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};
