
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserIcon, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { Job } from "@/components/jobs/JobTypes";
import JobStatusBadge from "./JobStatusBadge";
import JobActions from "./JobActions";
import JobFilters from "./JobFilters";
import { useJobFilters } from "./useJobFilters";
import CancelJobDialog from "./CancelJobDialog";

type JobsTableProps = {
  jobs: Job[];
  formatCurrency: (amount: number) => string;
  technicians: { id: string; name: string }[];
  onCancelJob: (jobId: string) => void;
};

const JobsTable = ({ jobs, formatCurrency, technicians, onCancelJob }: JobsTableProps) => {
  const { filters, setFilters, filteredJobs, resetFilters } = useJobFilters(jobs);
  const [jobToCancel, setJobToCancel] = useState<string | null>(null);
  
  const handleCancelConfirm = () => {
    if (jobToCancel) {
      onCancelJob(jobToCancel);
      setJobToCancel(null);
      toast({
        title: "Job Cancelled",
        description: "The job has been successfully cancelled",
      });
    }
  };

  return (
    <div className="space-y-4">
      <JobFilters 
        filters={filters}
        setFilters={setFilters}
        technicians={technicians}
        resetFilters={resetFilters}
      />
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.clientName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center">
                        <UserIcon className="h-3.5 w-3.5" />
                      </div>
                      {job.technicianName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      {format(new Date(job.scheduledDate), "MMM d, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(job.amount)}</TableCell>
                  <TableCell>
                    <JobStatusBadge status={job.status} />
                  </TableCell>
                  <TableCell>
                    <JobActions job={job} onCancelJob={setJobToCancel} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                  No jobs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <CancelJobDialog 
        jobId={jobToCancel}
        onOpenChange={() => setJobToCancel(null)}
        onConfirm={handleCancelConfirm}
      />
    </div>
  );
};

export default JobsTable;
