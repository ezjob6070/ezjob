
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { AmountRange } from './JobTypes';

export interface AmountFilterProps {
  amountRange: AmountRange | null;
  onAmountRangeChange: (amountRange: AmountRange | null) => void;
}

export const AmountFilter: React.FC<AmountFilterProps> = ({ amountRange, onAmountRangeChange }) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const min = e.target.value ? Number(e.target.value) : undefined;
    onAmountRangeChange({ ...(amountRange || {}), min });
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const max = e.target.value ? Number(e.target.value) : undefined;
    onAmountRangeChange({ ...(amountRange || {}), max });
  };

  return (
    <Card>
      <CardContent className="p-4 grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="min-amount">Min Amount</Label>
          <Input
            id="min-amount"
            type="number"
            placeholder="0"
            value={amountRange?.min || ''}
            onChange={handleMinChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="max-amount">Max Amount</Label>
          <Input
            id="max-amount"
            type="number"
            placeholder="Any"
            value={amountRange?.max || ''}
            onChange={handleMaxChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AmountFilter;
