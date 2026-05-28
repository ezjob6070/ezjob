
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
import { Job } from "./JobTypes";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import JobActions from "./JobActions";
import { useIsMobile } from "@/hooks/use-mobile";

interface JobsTableProps {
  jobs: Job[];
  onUpdateStatus: (job: Job, initialStatus?: string) => void;
  onSendToEstimate?: (job: Job) => void;
  searchTerm?: string;
}

const JobsTable = ({ jobs, onUpdateStatus, onSendToEstimate, searchTerm = '' }: JobsTableProps) => {
  const [jobsData, setJobsData] = useState(jobs);
  const isMobile = useIsMobile();

  useEffect(() => {
    setJobsData(jobs);
  }, [jobs]);

  const filteredJobs = jobsData.filter(job =>
    (job.clientName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    ((job.title || '')?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    ((job.technicianName || '')?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    ((job.jobSourceName || '')?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    ((job.category || '')?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-yellow-500 hover:bg-yellow-600";
      case "in_progress": return "bg-black hover:bg-gray-800 text-white";
      case "completed": return "bg-green-500 hover:bg-green-600";
      case "cancelled": return "bg-red-500 hover:bg-red-600";
      default: return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getCategoryBadgeColor = (category?: string) => {
    if (!category) return "bg-gray-200 text-gray-800";
    switch (category.toLowerCase()) {
      case "hvac": return "bg-blue-100 text-blue-800";
      case "plumbing": return "bg-cyan-100 text-cyan-800";
      case "electrical": return "bg-amber-100 text-amber-800";
      case "remodeling": return "bg-emerald-100 text-emerald-800";
      case "security": return "bg-violet-100 text-violet-800";
      case "smart home": return "bg-indigo-100 text-indigo-800";
      case "renewable energy": return "bg-green-100 text-green-800";
      case "landscape": return "bg-lime-100 text-lime-800";
      case "interior design": return "bg-fuchsia-100 text-fuchsia-800";
      default: return "bg-gray-200 text-gray-800";
    }
  };

  const formatStatus = (status: string) =>
    status.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());

  const formatDateTime = (dateInput: Date | string | null | undefined, isAllDay?: boolean) => {
    if (!dateInput) return <span>No date specified</span>;
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(date.getTime())) return <span>Invalid date</span>;
    if (isAllDay) {
      return (
        <div className="flex items-center flex-wrap gap-1">
          <span>{date.toLocaleDateString()}</span>
          <Badge variant="outline" className="text-xs">All Day</Badge>
        </div>
      );
    }
    return (
      <div className="flex items-center flex-wrap gap-1">
        <span>{date.toLocaleDateString()}</span>
        <Badge variant="outline" className="text-xs flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Badge>
      </div>
    );
  };

  // Mobile card view
  if (isMobile) {
    if (filteredJobs.length === 0) {
      return (
        <div className="rounded-md border bg-white p-6 text-center text-gray-500">
          No jobs found.
        </div>
      );
    }
    return (
      <div className="space-y-3">
        {filteredJobs.map((job) => (
          <div key={job.id} className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-gray-900 truncate">
                  {job.clientName || "No client name"}
                </div>
                <div className="text-sm text-gray-600 truncate">
                  {job.title || "No title specified"}
                </div>
              </div>
              <Badge className={`${getStatusBadgeColor(job.status)} shrink-0`}>
                {formatStatus(job.status)}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
              {job.category && (
                <div className="col-span-2">
                  <Badge className={getCategoryBadgeColor(job.category)}>
                    {job.category}
                  </Badge>
                  {job.serviceType && (
                    <span className="ml-2 text-gray-500">{job.serviceType}</span>
                  )}
                </div>
              )}
              <div>
                <div className="text-gray-400 uppercase tracking-wide text-[10px]">Technician</div>
                <div className="text-gray-700 truncate">{job.technicianName || "Unassigned"}</div>
              </div>
              <div>
                <div className="text-gray-400 uppercase tracking-wide text-[10px]">Source</div>
                <div className="text-gray-700 truncate">{job.jobSourceName || "—"}</div>
              </div>
              <div className="col-span-2">
                <div className="text-gray-400 uppercase tracking-wide text-[10px]">Date</div>
                <div className="text-gray-700">{formatDateTime(job.date, job.isAllDay)}</div>
              </div>
              <div className="col-span-2">
                <div className="text-gray-400 uppercase tracking-wide text-[10px]">Amount</div>
                <div className="text-gray-900 font-medium">
                  {job.actualAmount
                    ? formatCurrency(job.actualAmount)
                    : job.amount
                      ? `${formatCurrency(job.amount)} (est.)`
                      : "Not specified"}
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t pt-2">
              <JobActions
                job={job}
                onUpdateStatus={onUpdateStatus}
                onSendToEstimate={onSendToEstimate}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop table view
  return (
    <div className="rounded-md border overflow-x-auto">
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
              <TableCell className="font-medium">{job.clientName || "No client name"}</TableCell>
              <TableCell>{job.title || "No title specified"}</TableCell>
              <TableCell>
                {job.category ? (
                  <div className="flex items-center space-x-2">
                    <Badge className={getCategoryBadgeColor(job.category)}>{job.category}</Badge>
                    {job.serviceType && <span className="text-xs text-gray-500">{job.serviceType}</span>}
                  </div>
                ) : "Uncategorized"}
              </TableCell>
              <TableCell>{job.technicianName || "Unassigned"}</TableCell>
              <TableCell>{job.jobSourceName || "Not specified"}</TableCell>
              <TableCell>{formatDateTime(job.date, job.isAllDay)}</TableCell>
              <TableCell>
                {job.actualAmount
                  ? formatCurrency(job.actualAmount)
                  : job.amount
                    ? formatCurrency(job.amount) + " (est.)"
                    : "Not specified"}
              </TableCell>
              <TableCell className="text-right">
                <Badge className={getStatusBadgeColor(job.status)}>{formatStatus(job.status)}</Badge>
              </TableCell>
              <TableCell>
                <JobActions
                  job={job}
                  onUpdateStatus={onUpdateStatus}
                  onSendToEstimate={onSendToEstimate}
                />
              </TableCell>
            </TableRow>
          ))}
          {filteredJobs.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4">No jobs found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default JobsTable;
