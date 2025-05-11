
import React from "react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";

// Define a more complete Job interface locally to resolve the missing properties issue
interface Job {
  id: string;
  clientName: string;
  amount?: number;
  status: string;
  technicianName?: string;
  notes?: string;
  jobSourceName?: string; // Add this property
  [key: string]: any; // Allow additional properties
}

interface JobDetailsSectionProps {
  job: Job;
}

const JobDetailsSection: React.FC<JobDetailsSectionProps> = ({ job }) => {
  return (
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
      <div className="text-sm text-muted-foreground">
        Current Status: <span className="ml-1"><Badge variant="outline">{job.status.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())}</Badge></span>
      </div>
    </div>
  );
};

export default JobDetailsSection;
