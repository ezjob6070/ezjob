
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PaymentMethod } from "./JobTypes";

export interface PaymentMethodFilterProps {
  value: PaymentMethod | null;
  onChange: (method: PaymentMethod | null) => void;
}

const PaymentMethodFilter = ({ value, onChange }: PaymentMethodFilterProps) => {
  const handleClear = () => {
    onChange(null);
  };

  return (
    <div className="space-y-4">
      <RadioGroup value={value || ""} onValueChange={(val) => onChange(val as PaymentMethod || null)}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="credit_card" id="credit_card" />
          <Label htmlFor="credit_card">Credit Card</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="cash" id="cash" />
          <Label htmlFor="cash">Cash</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="check" id="check" />
          <Label htmlFor="check">Check</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="zelle" id="zelle" />
          <Label htmlFor="zelle">Zelle</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="venmo" id="venmo" />
          <Label htmlFor="venmo">Venmo</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="paypal" id="paypal" />
          <Label htmlFor="paypal">PayPal</Label>
        </div>
      </RadioGroup>
      
      <Button 
        variant="outline" 
        size="sm"
        className="w-full"
        onClick={handleClear}
      >
        Clear
      </Button>
    </div>
  );
};

export default PaymentMethodFilter;
