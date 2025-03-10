
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { initialJobs } from "@/data/jobs";
import { Employee } from "@/types/employee";
import { format } from "date-fns";

type EmployeeJobHistoryProps = {
  employee: Employee;
};

const EmployeeJobHistory: React.FC<EmployeeJobHistoryProps> = ({ employee }) => {
  // Filter jobs for this employee (by matching the employee name - in a real app would use ID)
  const employeeJobs = initialJobs.filter(
    (job) => job.technicianName === employee.name
  );

  // Sort jobs by date (most recent first)
  const sortedJobs = [...employeeJobs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Count completed and cancelled jobs
  const completedJobs = sortedJobs.filter((job) => job.status === "completed").length;
  const cancelledJobs = sortedJobs.filter((job) => job.status === "cancelled").length;

  if (sortedJobs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No job history available for this employee.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <div className="bg-green-50 text-green-800 px-3 py-2 rounded-md">
          <p className="text-sm font-medium">Completed Jobs</p>
          <p className="text-2xl font-bold">{completedJobs}</p>
        </div>
        <div className="bg-red-50 text-red-800 px-3 py-2 rounded-md">
          <p className="text-sm font-medium">Cancelled Jobs</p>
          <p className="text-2xl font-bold">{cancelledJobs}</p>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedJobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell>{format(new Date(job.date), "MMM d, yyyy")}</TableCell>
              <TableCell>{job.clientName}</TableCell>
              <TableCell>{job.title}</TableCell>
              <TableCell>${job.amount.toLocaleString()}</TableCell>
              <TableCell>
                <Badge 
                  variant={
                    job.status === "completed" ? "success" : 
                    job.status === "cancelled" ? "destructive" : 
                    job.status === "in_progress" ? "secondary" : 
                    "outline"
                  }
                >
                  {job.status === "cancelled" ? "Cancelled" : 
                    job.status.charAt(0).toUpperCase() + job.status.slice(1).replace("_", " ")}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeJobHistory;
