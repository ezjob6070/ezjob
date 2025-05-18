
import { ScheduleEvent } from "./types";

export const getEventTypeIcon = (type: string) => {
  switch (type) {
    case "reminder":
      return "BellRing";
    case "meeting":
      return "Calendar";
    case "deadline":
      return "Clock";
    case "milestone":
      return "Check";
    case "inspection":
      return "FileText";
    case "task":
      return "FileText";
    default:
      return "Calendar";
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
