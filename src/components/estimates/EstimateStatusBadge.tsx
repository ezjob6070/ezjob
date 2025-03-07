
import { CheckCircleIcon, ClockIcon, SendIcon } from "lucide-react";
import { EstimateStatus } from "@/types/estimate";

interface EstimateStatusBadgeProps {
  status: EstimateStatus;
}

const EstimateStatusBadge = ({ status }: EstimateStatusBadgeProps) => {
  const statusIcons = {
    "sent": <SendIcon className="h-4 w-4 text-blue-500" />,
    "in-process": <ClockIcon className="h-4 w-4 text-yellow-500" />,
    "completed": <CheckCircleIcon className="h-4 w-4 text-green-500" />
  };

  const statusText = {
    "sent": "Sent",
    "in-process": "In Process",
    "completed": "Completed"
  };

  return (
    <div className="flex items-center gap-1 text-sm">
      {statusIcons[status]}
      <span>{statusText[status]}</span>
    </div>
  );
};

export default EstimateStatusBadge;
