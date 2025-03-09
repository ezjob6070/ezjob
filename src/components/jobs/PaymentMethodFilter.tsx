
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export type PaymentMethod = "credit_card" | "check" | "cash" | "zelle" | "other" | string;

interface PaymentMethodFilterProps {
  selectedMethod: PaymentMethod | null;
  onMethodChange: (method: PaymentMethod | null) => void;
}

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "credit_card", label: "Credit Card" },
  { value: "check", label: "Check" },
  { value: "cash", label: "Cash" },
  { value: "zelle", label: "Zelle" },
  { value: "other", label: "Other" }
];

const PaymentMethodFilter: React.FC<PaymentMethodFilterProps> = ({
  selectedMethod,
  onMethodChange
}) => {
  const [customMethod, setCustomMethod] = useState<string>("");
  const [isCustom, setIsCustom] = useState(false);

  const handleRadioChange = (value: string) => {
    if (value === "custom") {
      setIsCustom(true);
    } else {
      setIsCustom(false);
      onMethodChange(value as PaymentMethod);
    }
  };

  const handleCustomApply = () => {
    if (customMethod.trim()) {
      onMethodChange(customMethod.trim());
    }
  };

  const handleClearMethod = () => {
    onMethodChange(null);
    setCustomMethod("");
    setIsCustom(false);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-auto justify-between px-3 py-5 text-base font-medium"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          {selectedMethod ? 
            PAYMENT_METHODS.find(m => m.value === selectedMethod)?.label || selectedMethod : 
            "Payment Method"}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px]" align="start">
        <div className="space-y-4">
          <h4 className="font-medium">Payment Method</h4>
          
          <RadioGroup 
            value={isCustom ? "custom" : selectedMethod || ""}
            onValueChange={handleRadioChange}
          >
            {PAYMENT_METHODS.map((method) => (
              <div key={method.value} className="flex items-center space-x-2">
                <RadioGroupItem value={method.value} id={`method-${method.value}`} />
                <Label htmlFor={`method-${method.value}`} className="flex-grow cursor-pointer">
                  {method.label}
                </Label>
              </div>
            ))}

            <div className="flex items-center space-x-2 pt-2">
              <RadioGroupItem value="custom" id="custom-method" />
              <Label htmlFor="custom-method" className="cursor-pointer">Custom method</Label>
            </div>
          </RadioGroup>

          {isCustom && (
            <div className="space-y-2 pt-2">
              <div className="flex gap-2 items-center">
                <Input
                  type="text"
                  placeholder="Enter payment method"
                  value={customMethod}
                  onChange={(e) => setCustomMethod(e.target.value)}
                />
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

          {selectedMethod && (
            <Button 
              onClick={handleClearMethod} 
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

export default PaymentMethodFilter;
