
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { JobStatus } from "@/types/job";

interface StatusSelectionProps {
  status: string;
  onStatusChange: (value: string) => void;
  job: { status: string };
}

const StatusSelection: React.FC<StatusSelectionProps> = ({ 
  status, 
  onStatusChange,
  job
}) => {
  // Get available status options based on current job status
  const getStatusOptions = () => {
    const options: { value: string; label: string }[] = [];
    
    // Always add these options
    options.push({ value: "completed", label: "Completed" });
    options.push({ value: "cancelled", label: "Cancelled" });
    options.push({ value: "reschedule", label: "Reschedule" });
    options.push({ value: "estimate", label: "Send to Estimate" });
    
    // Only add in_progress if not already in that status
    // Support both versions for backward compatibility
    if (job.status !== "in_progress" && job.status !== "in-progress") {
      options.push({ value: "in_progress", label: "In Progress" });
    }
    
    // Only add scheduled if not already in that status
    if (job.status !== "scheduled") {
      options.push({ value: "scheduled", label: "Scheduled" });
    }
    
    return options;
  };

  return (
    <RadioGroup value={status} onValueChange={onStatusChange}>
      {getStatusOptions().map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <RadioGroupItem value={option.value} id={option.value} />
          <Label htmlFor={option.value}>{option.label}</Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default StatusSelection;
