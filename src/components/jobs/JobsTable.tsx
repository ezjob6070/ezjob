
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Client / Title / Technician</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredJobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="font-medium">
                <div>
                  <span className="font-semibold">{job.clientName}</span> • 
                  <span className="mx-2">{job.title}</span> • 
                  <span className="text-muted-foreground">{job.technicianName}</span>
                </div>
              </TableCell>
              <TableCell>{job.date.toLocaleDateString()}</TableCell>
              <TableCell>{formatCurrency(job.amount)}</TableCell>
              <TableCell className="text-right">{job.status}</TableCell>
            </TableRow>
          ))}
          {filteredJobs.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
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
