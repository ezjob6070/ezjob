
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CompletionFormProps {
  actualAmount: number;
  setActualAmount: (amount: number) => void;
  parts: string;
  setParts: (parts: string) => void;
}

const CompletionForm: React.FC<CompletionFormProps> = ({
  actualAmount,
  setActualAmount,
  parts,
  setParts,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="actualAmount">Actual Amount ($)</Label>
        <Input
          id="actualAmount"
          type="number"
          min="0"
          step="0.01"
          value={actualAmount}
          onChange={(e) => setActualAmount(Number(e.target.value))}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="parts">Parts Used (Optional)</Label>
        <Input
          id="parts"
          placeholder="e.g., AC filter, pipe fitting, etc."
          value={parts}
          onChange={(e) => setParts(e.target.value)}
        />
      </div>
    </div>
  );
};

export default CompletionForm;
