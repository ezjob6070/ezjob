
import React from "react";
import { Badge } from "@/components/ui/badge";
import { LeadStatus } from "@/types/lead";
import { CircleAlert, Phone, Check, FileText, Handshake, Trophy, CircleX, Briefcase, Clock, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface LeadStatusFilterProps {
  selectedStatuses: LeadStatus[];
  onStatusToggle: (status: LeadStatus) => void;
  counts: Record<string, number>;
}

interface StatusOption {
  value: LeadStatus;
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const statusOptions: StatusOption[] = [
  {
    value: "new",
    label: "New",
    icon: <CircleAlert className="h-4 w-4" />,
    color: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200",
    description: "Recently added leads that need initial contact"
  },
  {
    value: "contacted",
    label: "Contacted",
    icon: <Phone className="h-4 w-4" />,
    color: "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200",
    description: "Leads that have been reached out to"
  },
  {
    value: "qualified",
    label: "Qualified",
    icon: <Check className="h-4 w-4" />,
    color: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-indigo-200",
    description: "Leads that fit your customer profile"
  },
  {
    value: "proposal",
    label: "Proposal",
    icon: <FileText className="h-4 w-4" />,
    color: "bg-pink-100 text-pink-800 hover:bg-pink-200 border-pink-200",
    description: "Proposal sent, awaiting response"
  },
  {
    value: "negotiation",
    label: "Negotiation",
    icon: <Handshake className="h-4 w-4" />,
    color: "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200",
    description: "In active negotiation process"
  },
  {
    value: "won",
    label: "Won",
    icon: <Trophy className="h-4 w-4" />,
    color: "bg-green-100 text-green-800 hover:bg-green-200 border-green-200",
    description: "Successfully converted to a customer"
  },
  {
    value: "lost",
    label: "Lost",
    icon: <CircleX className="h-4 w-4" />,
    color: "bg-red-100 text-red-800 hover:bg-red-200 border-red-200",
    description: "Opportunity closed without success"
  },
  {
    value: "active",
    label: "Active",
    icon: <Briefcase className="h-4 w-4" />,
    color: "bg-green-100 text-green-800 hover:bg-green-200 border-green-200",
    description: "Currently engaged with your business"
  },
  {
    value: "inactive",
    label: "Inactive",
    icon: <Clock className="h-4 w-4" />,
    color: "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200",
    description: "No recent engagement"
  },
  {
    value: "converted",
    label: "Converted",
    icon: <Trophy className="h-4 w-4" />,
    color: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200",
    description: "Successfully converted to customer"
  },
  {
    value: "follow",
    label: "Follow-up",
    icon: <Filter className="h-4 w-4" />,
    color: "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200",
    description: "Scheduled for future follow-up"
  }
];

export const getStatusInfo = (status: LeadStatus): StatusOption | undefined => {
  return statusOptions.find(option => option.value === status);
};

const LeadStatusFilter = ({ selectedStatuses, onStatusToggle, counts }: LeadStatusFilterProps) => {
  const groupedStatuses = {
    active: ["new", "contacted", "qualified", "proposal", "negotiation", "active", "follow"],
    completed: ["won", "converted"],
    inactive: ["inactive", "lost"]
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-3">Lead Pipeline Status</h3>
        <div className="flex flex-wrap gap-2">
          {statusOptions
            .filter(status => groupedStatuses.active.includes(status.value))
            .map(status => (
              <Badge
                key={status.value}
                variant="outline"
                className={cn(
                  "flex items-center gap-1 cursor-pointer transition-all py-1.5 px-3",
                  status.color,
                  selectedStatuses.includes(status.value as LeadStatus) && "ring-2 ring-offset-1"
                )}
                onClick={() => onStatusToggle(status.value)}
              >
                {status.icon}
                <span>{status.label}</span>
                <span className="ml-1 bg-white/30 text-xs px-1.5 rounded-full">
                  {counts[status.value] || 0}
                </span>
              </Badge>
            ))}
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium mb-3">Completed</h3>
          <div className="flex flex-wrap gap-2">
            {statusOptions
              .filter(status => groupedStatuses.completed.includes(status.value))
              .map(status => (
                <Badge
                  key={status.value}
                  variant="outline"
                  className={cn(
                    "flex items-center gap-1 cursor-pointer transition-all py-1.5 px-3",
                    status.color,
                    selectedStatuses.includes(status.value as LeadStatus) && "ring-2 ring-offset-1"
                  )}
                  onClick={() => onStatusToggle(status.value)}
                >
                  {status.icon}
                  <span>{status.label}</span>
                  <span className="ml-1 bg-white/30 text-xs px-1.5 rounded-full">
                    {counts[status.value] || 0}
                  </span>
                </Badge>
              ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Inactive</h3>
          <div className="flex flex-wrap gap-2">
            {statusOptions
              .filter(status => groupedStatuses.inactive.includes(status.value))
              .map(status => (
                <Badge
                  key={status.value}
                  variant="outline"
                  className={cn(
                    "flex items-center gap-1 cursor-pointer transition-all py-1.5 px-3",
                    status.color,
                    selectedStatuses.includes(status.value as LeadStatus) && "ring-2 ring-offset-1"
                  )}
                  onClick={() => onStatusToggle(status.value)}
                >
                  {status.icon}
                  <span>{status.label}</span>
                  <span className="ml-1 bg-white/30 text-xs px-1.5 rounded-full">
                    {counts[status.value] || 0}
                  </span>
                </Badge>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadStatusFilter;
