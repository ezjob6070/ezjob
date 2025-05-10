
import { CheckCircleIcon, ClockIcon, SendIcon } from "lucide-react";
import { EstimateStatus } from "@/types/estimate";
import { cn } from "@/lib/utils";

interface EstimateStatusBadgeProps {
  status: EstimateStatus;
  className?: string;
}

const EstimateStatusBadge = ({ status, className }: EstimateStatusBadgeProps) => {
  const statusConfig = {
    "sent": {
      icon: <SendIcon className="h-3 w-3" />,
      text: "Sent",
      classes: "bg-blue-50 text-blue-700 border-blue-200"
    },
    "in-process": {
      icon: <ClockIcon className="h-3 w-3" />,
      text: "In Process",
      classes: "bg-amber-50 text-amber-700 border-amber-200"
    },
    "completed": {
      icon: <CheckCircleIcon className="h-3 w-3" />,
      text: "Completed",
      classes: "bg-green-50 text-green-700 border-green-200"
    }
  };

  const config = statusConfig[status];

  return (
    <div className={cn(
      "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
      config.classes,
      className
    )}>
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
};

export default EstimateStatusBadge;
