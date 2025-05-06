
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Tabs } from "@/components/ui/tabs";

// Import dashboard components
import DashboardGreeting from "@/components/dashboard/DashboardGreeting";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import DashboardDateFilter from "@/components/dashboard/DashboardDateFilter";
import DashboardTabContent from "@/components/dashboard/DashboardTabContent";

// Import data 
import { dashboardTaskCounts, dashboardFinancialMetrics } from "@/data/dashboardData";
import { todaysAppointments } from "@/data/appointmentsData";

const Dashboard = () => {
  // Set default date range to current day
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: today,
    to: today
  });
  
  const [openDateFilter, setOpenDateFilter] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const formatDateRange = () => {
    if (!dateRange?.from) return "Custom Range";
    
    if (dateRange.to) {
      if (dateRange.from.toDateString() === dateRange.to.toDateString()) {
        return format(dateRange.from, "MMM d, yyyy");
      }
      return `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}`;
    }
    
    return format(dateRange.from, "MMM d, yyyy");
  };

  const totalTasks = Object.values(dashboardTaskCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-3 py-3">
      <div className="mb-4">
        <DashboardGreeting 
          name="Alex Johnson" 
          subtitle="Welcome to your Easy Job dashboard" 
        />
        
        <div className="mt-4 flex items-center gap-2">
          <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <DashboardDateFilter 
            openDateFilter={openDateFilter} 
            setOpenDateFilter={setOpenDateFilter}
            dateRange={dateRange}
            setDateRange={setDateRange}
            formatDateRange={formatDateRange}
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <DashboardTabContent
          financialMetrics={{
            totalRevenue: dashboardFinancialMetrics.totalRevenue,
            monthlyGrowth: dashboardFinancialMetrics.monthlyGrowth,
            avgJobValue: dashboardFinancialMetrics.avgJobValue
          }}
          taskCounts={dashboardTaskCounts}
          totalTasks={totalTasks}
          dateRangeFormatted={formatDateRange()}
          appointments={todaysAppointments}
        />
      </Tabs>
    </div>
  );
};

export default Dashboard;
