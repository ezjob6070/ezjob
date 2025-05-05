
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CalendarRange, BarChart3, Activity } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import JobsDateFilter from "@/components/jobs/filters/JobsDateFilter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import dashboard components
import DashboardGreeting from "@/components/dashboard/DashboardGreeting";
import DashboardMetricCards from "@/components/dashboard/DashboardMetricCards";
import JobsStatusSection from "@/components/dashboard/JobsStatusSection";
import TodaysAppointmentsSection from "@/components/dashboard/TodaysAppointmentsSection";
import CallTrackingSection from "@/components/dashboard/CallTrackingSection";

// Import data 
import { dashboardTaskCounts, dashboardFinancialMetrics } from "@/data/dashboardData";

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [openDateFilter, setOpenDateFilter] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  
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
        <DashboardGreeting 
          name="Alex Johnson" 
          subtitle="Welcome to your Easy Job dashboard" 
        />
        
        <div className="flex items-center gap-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mr-2">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="statistics" className="flex items-center gap-1">
                <BarChart3 className="h-3.5 w-3.5" />
                Statistics
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-1">
                <Activity className="h-3.5 w-3.5" />
                Analytics
              </TabsTrigger>
            </TabsList>
          </Tabs>

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
      </div>
      
      <TabsContent value="dashboard" className="mt-0 p-0">
        {/* Dashboard Metric Cards */}
        <DashboardMetricCards 
          financialMetrics={{
            totalRevenue: 148750,
            monthlyGrowth: 5,
            avgJobValue: 3542
          }}
          taskCounts={dashboardTaskCounts}
          totalTasks={totalTasks}
          dateRange={formatDateRange()}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <div className="lg:col-span-2">
            {/* Jobs Status Section */}
            <JobsStatusSection
              taskCounts={dashboardTaskCounts}
              totalTasks={totalTasks}
            />
          </div>
          
          <div className="lg:col-span-1">
            {/* Today's Appointments */}
            <TodaysAppointmentsSection
              appointments={todaysAppointments}
            />
          </div>
        </div>
        
        <div className="mt-4">
          {/* Call Tracking Section */}
          <CallTrackingSection />
        </div>
      </TabsContent>
      
      <TabsContent value="statistics" className="mt-0 p-0">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Detailed Statistics</h2>
          <p className="text-gray-500">This section will display detailed statistical information.</p>
        </div>
      </TabsContent>
      
      <TabsContent value="analytics" className="mt-0 p-0">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Performance Analytics</h2>
          <p className="text-gray-500">This section will display detailed analytics information.</p>
        </div>
      </TabsContent>
    </div>
  );
};

export default Dashboard;
