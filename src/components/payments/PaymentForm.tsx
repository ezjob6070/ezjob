
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCardIcon } from "lucide-react";

const PaymentForm = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    clientName: "",
    jobDescription: "",
    amount: "",
    cardNumber: "",
    expiryDate: "",
    cvc: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would connect to Stripe API
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Payment Successful",
        description: `$${paymentData.amount} has been charged successfully.`,
        variant: "default",
      });
      
      // Reset form
      setPaymentData({
        clientName: "",
        jobDescription: "",
        amount: "",
        cardNumber: "",
        expiryDate: "",
        cvc: ""
      });
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="clientName">Client Name</Label>
        <select 
          id="clientName"
          name="clientName"
          value={paymentData.clientName}
          onChange={handleChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          required
        >
          <option value="" disabled>Select a client</option>
          <option value="Acme Corp">Acme Corp</option>
          <option value="Tech Solutions Inc.">Tech Solutions Inc.</option>
          <option value="Global Industries">Global Industries</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="jobDescription">Job Description</Label>
        <Input 
          id="jobDescription"
          name="jobDescription"
          value={paymentData.jobDescription}
          onChange={handleChange}
          placeholder="HVAC Maintenance"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount ($)</Label>
        <Input 
          id="amount"
          name="amount"
          type="number"
          value={paymentData.amount}
          onChange={handleChange}
          placeholder="0.00"
          required
        />
      </div>

      <div className="pt-4 border-t">
        <h3 className="text-sm font-medium mb-4">Payment Information</h3>
        
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input 
            id="cardNumber"
            name="cardNumber"
            value={paymentData.cardNumber}
            onChange={handleChange}
            placeholder="4242 4242 4242 4242"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input 
              id="expiryDate"
              name="expiryDate"
              value={paymentData.expiryDate}
              onChange={handleChange}
              placeholder="MM/YY"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvc">CVC</Label>
            <Input 
              id="cvc"
              name="cvc"
              value={paymentData.cvc}
              onChange={handleChange}
              placeholder="123"
              required
            />
          </div>
        </div>
      </div>

      <Button 
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 mt-4"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <CreditCardIcon className="h-4 w-4" />
            Process Payment
          </span>
        )}
      </Button>
    </form>
  );
};

export default PaymentForm;
