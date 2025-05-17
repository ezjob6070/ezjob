
import { isSameDay } from "date-fns";
import { Job } from "@/components/jobs/JobTypes";

export const getDayColorBasedOnJobs = (day: Date, jobs: Job[]): string => {
  const dayJobs = jobs.filter(job => isSameDay(job.date, day));
  
  if (!dayJobs.length) return "";
  
  if (dayJobs.some(job => job.status === "scheduled")) {
    return "bg-blue-100 text-blue-800";
  } else if (dayJobs.some(job => job.status === "in_progress")) {
    return "bg-yellow-100 text-yellow-800";
  } else if (dayJobs.some(job => job.status === "completed")) {
    return "bg-green-100 text-green-800";
  } else if (dayJobs.some(job => job.status === "cancelled")) {
    return "bg-red-100 text-red-800";
  }
  
  return "";
};

// Added helper for getting task status colors
export const getTaskStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-500 hover:bg-green-600";
    case "in progress":
      return "bg-blue-500 hover:bg-blue-600";
    case "scheduled":
      return "bg-purple-500 hover:bg-purple-600";
    case "overdue":
      return "bg-red-500 hover:bg-red-600";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
};

// Added helper for getting priority badge colors
export const getPriorityBadgeColor = (priority?: string): string => {
  switch (priority) {
    case "urgent":
      return "bg-red-600 hover:bg-red-700";
    case "high":
      return "bg-red-500 hover:bg-red-600";
    case "medium":
      return "bg-yellow-500 hover:bg-yellow-600";
    case "low":
      return "bg-green-500 hover:bg-green-600";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
};
