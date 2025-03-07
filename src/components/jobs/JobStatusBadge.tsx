
import { Badge } from "@/components/ui/badge";
import { JobStatus } from "./JobTypes";

type JobStatusBadgeProps = {
  status: JobStatus;
};

const JobStatusBadge = ({ status }: JobStatusBadgeProps) => {
  const statusColors = {
    "scheduled": "bg-blue-100 text-blue-800",
    "in-progress": "bg-yellow-100 text-yellow-800",
    "completed": "bg-green-100 text-green-800",
    "cancelled": "bg-red-100 text-red-800",
  };

  const displayText = status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");

  return (
    <Badge variant="outline" className={statusColors[status]}>
      {displayText}
    </Badge>
  );
};

export default JobStatusBadge;
