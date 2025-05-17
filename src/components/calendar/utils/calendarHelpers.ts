
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
