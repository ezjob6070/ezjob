
import { Job } from "@/components/jobs/JobTypes";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500 hover:bg-blue-600";
      case "in-progress":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "completed":
        return "bg-green-500 hover:bg-green-600";
      case "cancelled":
      case "canceled":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-3 pb-1">
        <div className="flex justify-between items-start">
          <CardTitle className="text-md">{job.title || job.description || `Job for ${job.clientName}`}</CardTitle>
          <Badge className={getStatusBadgeColor(job.status)}>
            {job.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-1">
        <div className="text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Client:</span>
            <span className="font-medium">{job.clientName}</span>
          </div>
          {job.technicianName && (
            <div className="flex justify-between mt-1">
              <span className="text-muted-foreground">Technician:</span>
              <span className="font-medium">{job.technicianName}</span>
            </div>
          )}
          <div className="flex justify-between mt-1">
            <span className="text-muted-foreground">Amount:</span>
            <span className="font-medium">${job.amount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
