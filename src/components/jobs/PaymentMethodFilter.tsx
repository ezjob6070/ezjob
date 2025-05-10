
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { PaymentMethod } from './JobTypes';

export interface PaymentMethodFilterProps {
  paymentMethod: PaymentMethod | null;
  onPaymentMethodChange: (paymentMethod: PaymentMethod | null) => void;
}

export const PaymentMethodFilter: React.FC<PaymentMethodFilterProps> = ({ paymentMethod, onPaymentMethodChange }) => {
  
  return (
    <Card>
      <CardContent className="p-4">
        <RadioGroup
          value={paymentMethod || ''}
          onValueChange={(value) => onPaymentMethodChange(value as PaymentMethod || null)}
        >
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="cash" id="cash" />
            <Label htmlFor="cash">Cash</Label>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="creditCard" id="creditCard" />
            <Label htmlFor="creditCard">Credit Card</Label>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="check" id="check" />
            <Label htmlFor="check">Check</Label>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="bankTransfer" id="bankTransfer" />
            <Label htmlFor="bankTransfer">Bank Transfer</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mobile" id="mobile" />
            <Label htmlFor="mobile">Mobile Payment</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodFilter;
