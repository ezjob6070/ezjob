
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CalendarRange } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import JobsDateFilter from "@/components/jobs/filters/JobsDateFilter";
import DashboardGreeting from "@/components/dashboard/DashboardGreeting";
import DashboardMetricCards from "@/components/dashboard/DashboardMetricCards";
import JobsStatusSection from "@/components/dashboard/JobsStatusSection";
import TodaysAppointmentsSection from "@/components/dashboard/TodaysAppointmentsSection";
import CallTrackingSection from "@/components/dashboard/CallTrackingSection";

import {
  dashboardTaskCounts,
  dashboardFinancialMetrics
} from "@/data/dashboardData";

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [openDateFilter, setOpenDateFilter] = useState(false);
  
  const formatDateRange = () => {
    if (!dateRange?.from) return "All Time";
    
    if (dateRange.to) {
      if (dateRange.from.toDateString() === dateRange.to.toDateString()) {
        return format(dateRange.from, "MMM d, yyyy");
      }
      return `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}`;
    }
    
    return format(dateRange.from, "MMM d, yyyy");
  };

  const totalTasks = Object.values(dashboardTaskCounts).reduce((sum, count) => sum + count, 0);

  const todaysAppointments = [
    {
      client: "Sarah Johnson",
      priority: "high" as const,
      time: "09:30 AM",
      type: "Installation",
      address: "123 Main St"
    },
    {
      client: "James Wilson",
      priority: "medium" as const,
      time: "11:00 AM", 
      type: "Repair",
      address: "456 Oak Ave"
    },
    {
      client: "Emily Davis",
      priority: "low" as const,
      time: "01:15 PM",
      type: "Maintenance",
      address: "789 Pine Rd"
    },
    {
      client: "Michael Brown",
      priority: "medium" as const,
      time: "03:30 PM",
      type: "Inspection",
      address: "234 Elm St"
    }
  ];

  return (
    <div className="space-y-3 py-3">
      <div className="flex justify-between items-center mb-4">
        <DashboardGreeting name="Alex Johnson" />
        
        <Popover open={openDateFilter} onOpenChange={setOpenDateFilter}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="h-8 px-3 text-sm flex items-center gap-1 bg-white border-blue-100 shadow-sm"
            >
              <CalendarRange className="h-3.5 w-3.5 text-blue-500" />
              <span className="font-medium text-xs">{formatDateRange()}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <JobsDateFilter date={dateRange} setDate={setDateRange} />
          </PopoverContent>
        </Popover>
      </div>
      
      <DashboardMetricCards 
        financialMetrics={dashboardFinancialMetrics}
        taskCounts={{
          completed: dashboardTaskCounts.completed,
          inProgress: dashboardTaskCounts.inProgress,
          rescheduled: dashboardTaskCounts.rescheduled
        }}
        totalTasks={totalTasks}
        dateRange={dateRange?.from ? formatDateRange() : undefined}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <JobsStatusSection 
            taskCounts={dashboardTaskCounts}
            totalTasks={totalTasks} 
          />
        </div>
        
        <div className="lg:col-span-1">
          <TodaysAppointmentsSection 
            appointments={todaysAppointments}
          />
        </div>
      </div>
      
      <CallTrackingSection />
    </div>
  );
};

export default Dashboard;
