import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Button } from "@/components/ui/button";
import { Job } from "./JobTypes";
import { Badge } from "@/components/ui/badge";
import { AlarmClock, Clock, ExternalLink, MoreHorizontal } from "lucide-react";
import JobActions from "./JobActions";
import { useToast } from "@/components/ui/use-toast";

interface JobsTableProps {
  jobs: Job[];
  searchTerm: string;
  onOpenStatusModal: (job: Job) => void;
  onSendToEstimate?: (job: Job) => void;
}

const JobsTable = ({ 
  jobs, 
  searchTerm, 
  onOpenStatusModal,
  onSendToEstimate
}: JobsTableProps) => {
  const [jobsData, setJobsData] = useState(jobs);
  const { toast } = useToast();

  useEffect(() => {
    setJobsData(jobs);
  }, [jobs]);

  // Filter jobs based on search term
  const filteredJobs = jobsData.filter(job =>
    job.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (job.title && job.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    job.technicianName?.toLowerCase().includes(searchTerm.toLowerCase() || '') ||
    job.jobSourceName?.toLowerCase().includes(searchTerm.toLowerCase() || '') ||
    job.category?.toLowerCase().includes(searchTerm.toLowerCase() || '')
  );

  const handleSendToEstimate = (job: Job) => {
    if (onSendToEstimate) {
      onSendToEstimate(job);
    } else {
      toast({
        title: "Converting job to estimate",
        description: `Job for ${job.clientName} is being converted to an estimate.`
      });
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "in_progress":
        return "bg-black hover:bg-gray-800 text-white";
      case "completed":
        return "bg-green-500 hover:bg-green-600";
      case "cancelled":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getCategoryBadgeColor = (category?: string) => {
    if (!category) return "bg-gray-200 text-gray-800";
    
    switch (category.toLowerCase()) {
      case "hvac":
        return "bg-blue-100 text-blue-800";
      case "plumbing":
        return "bg-cyan-100 text-cyan-800";
      case "electrical":
        return "bg-amber-100 text-amber-800";
      case "remodeling":
        return "bg-emerald-100 text-emerald-800";
      case "security":
        return "bg-violet-100 text-violet-800";
      case "smart home":
        return "bg-indigo-100 text-indigo-800";
      case "renewable energy":
        return "bg-green-100 text-green-800";
      case "landscape":
        return "bg-lime-100 text-lime-800";
      case "interior design":
        return "bg-fuchsia-100 text-fuchsia-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Modified function to handle potential non-Date values
  const formatDateTime = (dateInput: Date | string | null | undefined, isAllDay?: boolean) => {
    // Check if dateInput exists and create a valid Date object
    if (!dateInput) {
      return <span>No date specified</span>;
    }
    
    // Ensure we're working with a Date object
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    
    // Validate the date is valid
    if (isNaN(date.getTime())) {
      return <span>Invalid date</span>;
    }
    
    if (isAllDay) {
      return (
        <div className="flex items-center">
          <span>{date.toLocaleDateString()}</span>
          <Badge variant="outline" className="ml-2 text-xs">All Day</Badge>
        </div>
      );
    }
    
    return (
      <div className="flex items-center">
        <span>{date.toLocaleDateString()}</span>
        <Badge variant="outline" className="ml-2 text-xs flex items-center">
          <Clock className="h-3 w-3 mr-1" /> 
          {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Badge>
      </div>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Job</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Technician</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Date/Time</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredJobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="font-medium">
                {job.clientName}
              </TableCell>
              <TableCell>
                {job.title || "No title specified"}
              </TableCell>
              <TableCell>
                {job.category ? (
                  <div className="flex items-center space-x-2">
                    <Badge className={getCategoryBadgeColor(job.category)}>
                      {job.category}
                    </Badge>
                    {job.serviceType && (
                      <span className="text-xs text-gray-500">{job.serviceType}</span>
                    )}
                  </div>
                ) : "Uncategorized"}
              </TableCell>
              <TableCell>
                {job.technicianName || "Unassigned"}
              </TableCell>
              <TableCell>
                {job.jobSourceName || "Not specified"}
              </TableCell>
              <TableCell>
                {formatDateTime(job.date, job.isAllDay)}
              </TableCell>
              <TableCell>
                {job.actualAmount 
                  ? formatCurrency(job.actualAmount) 
                  : job.amount 
                    ? formatCurrency(job.amount) + " (est.)" 
                    : "Not specified"}
              </TableCell>
              <TableCell className="text-right">
                <Badge className={getStatusBadgeColor(job.status)}>
                  {formatStatus(job.status)}
                </Badge>
              </TableCell>
              <TableCell>
                <JobActions 
                  job={job} 
                  onCancelJob={() => {}} 
                  onUpdateStatus={onOpenStatusModal}
                  onSendToEstimate={handleSendToEstimate}
                />
              </TableCell>
            </TableRow>
          ))}
          {filteredJobs.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4">
                No jobs found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default JobsTable;
