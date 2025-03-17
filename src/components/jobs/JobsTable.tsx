
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
import { AlarmClock, Clock, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface JobsTableProps {
  jobs: Job[];
  searchTerm: string;
  onOpenStatusModal: (job: Job) => void;
}

const JobsTable = ({ jobs, searchTerm, onOpenStatusModal }: JobsTableProps) => {
  const [jobsData, setJobsData] = useState(jobs);

  useEffect(() => {
    setJobsData(jobs);
  }, [jobs]);

  // Filter jobs based on search term
  const filteredJobs = jobsData.filter(job =>
    job.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (job.title && job.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    job.technicianName?.toLowerCase().includes(searchTerm.toLowerCase() || '') ||
    job.jobSourceName?.toLowerCase().includes(searchTerm.toLowerCase() || '')
  );

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

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatDateTime = (date: Date, isAllDay?: boolean) => {
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {job.status === "in_progress" && (
                      <DropdownMenuItem onClick={() => onOpenStatusModal(job)}>
                        Update Status
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {filteredJobs.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
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
