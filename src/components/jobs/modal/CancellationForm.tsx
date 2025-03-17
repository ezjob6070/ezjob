
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CancellationFormProps {
  cancellationReason: string;
  setCancellationReason: (reason: string) => void;
}

const CancellationForm: React.FC<CancellationFormProps> = ({
  cancellationReason,
  setCancellationReason,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="cancellationReason">Reason for Cancellation (Optional)</Label>
      <Textarea
        id="cancellationReason"
        placeholder="Enter reason for cancellation..."
        value={cancellationReason}
        onChange={(e) => setCancellationReason(e.target.value)}
        className="resize-none"
        rows={3}
      />
    </div>
  );
};

export default CancellationForm;
