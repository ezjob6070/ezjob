
import { ScheduleEvent } from "./types";
import { 
  BellRing, Calendar, Clock, FileText, Check
} from "lucide-react";

export const getEventTypeIcon = (type: string) => {
  switch (type) {
    case "reminder":
      return <BellRing className="h-4 w-4" />;
    case "meeting":
      return <Calendar className="h-4 w-4" />;
    case "deadline":
      return <Clock className="h-4 w-4" />;
    case "milestone":
      return <Check className="h-4 w-4" />;
    case "inspection":
      return <FileText className="h-4 w-4" />;
    case "task":
      return <FileText className="h-4 w-4" />;
    default:
      return <Calendar className="h-4 w-4" />;
  }
};

export const getEventTypeBadgeColor = (type: string) => {
  switch (type) {
    case "reminder":
      return "bg-purple-100 text-purple-800";
    case "meeting":
      return "bg-blue-100 text-blue-800";
    case "deadline":
      return "bg-red-100 text-red-800";
    case "milestone":
      return "bg-green-100 text-green-800";
    case "inspection":
      return "bg-amber-100 text-amber-800";
    case "task":
      return "bg-indigo-100 text-indigo-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getEventStatusBadgeColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-blue-100 text-blue-800";
  }
};
