
import { useState } from "react";
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

interface JobsTableProps {
  jobs: Job[];
  searchTerm: string;
}

const JobsTable = ({ jobs, searchTerm }: JobsTableProps) => {
  const [jobsData, setJobsData] = useState(jobs);

  // Filter jobs based on search term
  const filteredJobs = jobsData.filter(job =>
    job.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.technicianName?.toLowerCase().includes(searchTerm.toLowerCase() || '')
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Technician</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredJobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="font-medium">
                {job.clientName}
              </TableCell>
              <TableCell>
                {job.technicianName || "Unassigned"}
              </TableCell>
              <TableCell>
                {job.paymentMethod ? job.paymentMethod.replace("_", " ") : "Not specified"}
              </TableCell>
              <TableCell>{job.date.toLocaleDateString()}</TableCell>
              <TableCell>{formatCurrency(job.amount)}</TableCell>
              <TableCell className="text-right">
                <Badge className={getStatusBadgeColor(job.status)}>
                  {formatStatus(job.status)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
          {filteredJobs.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
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
