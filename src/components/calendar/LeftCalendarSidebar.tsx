
import { useState, useEffect } from "react";
import { isSameDay, addMonths, subMonths } from "date-fns";
import { Job } from "@/components/jobs/JobTypes";
import { initialJobs } from "@/data/jobs";
import { Task } from "./types";
import { mockTasks } from "./data/mockTasks";
import SidebarHeader from "./components/SidebarHeader";
import CalendarWidget from "./components/CalendarWidget";
import DaySummary from "./components/DaySummary";

// Remove the sidebar component entirely as requested
const LeftCalendarSidebar = ({ isOpen }: { isOpen: boolean }) => {
  // Return null to effectively remove the sidebar
  return null;
};

export default LeftCalendarSidebar;
