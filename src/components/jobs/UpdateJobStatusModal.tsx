
import React, { useState } from "react";
import { Job } from "./JobTypes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";

interface UpdateJobStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
  onCancel: (jobId: string) => void;
  onComplete: (jobId: string, actualAmount: number) => void;
}

const UpdateJobStatusModal: React.FC<UpdateJobStatusModalProps> = ({
  open,
  onOpenChange,
  job,
  onCancel,
  onComplete,
}) => {
  const [status, setStatus] = useState<"completed" | "cancelled">("completed");
  const [actualAmount, setActualAmount] = useState<number>(job?.amount || 0);

  if (!job) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (status === "completed") {
      onComplete(job.id, actualAmount);
    } else {
      onCancel(job.id);
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Update Job Status</DialogTitle>
            <DialogDescription>
              Mark this job as completed or cancelled.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">Job Details</h4>
              <p className="text-sm text-muted-foreground">Client: {job.clientName}</p>
              <p className="text-sm text-muted-foreground">
                Technician: {job.technicianName || "Unassigned"}
              </p>
              <p className="text-sm text-muted-foreground">
                Initial Estimate: {job.amount ? formatCurrency(job.amount) : "No estimate provided"}
              </p>
              {job.notes && (
                <p className="text-sm text-muted-foreground">
                  Special Notes: {job.notes}
                </p>
              )}
              {job.jobSourceName && (
                <p className="text-sm text-muted-foreground">
                  Source: {job.jobSourceName}
                </p>
              )}
            </div>

            <RadioGroup value={status} onValueChange={(value) => setStatus(value as "completed" | "cancelled")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="completed" id="completed" />
                <Label htmlFor="completed">Completed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cancelled" id="cancelled" />
                <Label htmlFor="cancelled">Cancelled</Label>
              </div>
            </RadioGroup>

            {status === "completed" && (
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
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Status</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateJobStatusModal;
