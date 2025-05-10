
import { Badge } from "@/components/ui/badge";
import { EstimateStatus } from "@/types/estimate";
import { CheckCircle, Clock, Send } from "lucide-react";

interface EstimateStatusBadgeProps {
  status: EstimateStatus;
}

const EstimateStatusBadge = ({ status }: EstimateStatusBadgeProps) => {
  switch (status) {
    case "sent":
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 flex gap-1 items-center">
          <Send size={12} />
          <span>Sent</span>
        </Badge>
      );
    case "in-process":
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 flex gap-1 items-center">
          <Clock size={12} />
          <span>In Process</span>
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 flex gap-1 items-center">
          <CheckCircle size={12} />
          <span>Completed</span>
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default EstimateStatusBadge;
