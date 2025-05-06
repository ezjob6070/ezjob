
import React from "react";
import { Tabs } from "@/components/ui/tabs";
import DashboardGreeting from "@/components/dashboard/DashboardGreeting";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import DashboardDateFilter from "@/components/dashboard/DashboardDateFilter";
import DashboardTabContent from "@/components/dashboard/DashboardTabContent";
import { useDashboardDate } from "@/hooks/useDashboardDate";

// Import required data types
import { dashboardTaskCounts, dashboardFinancialMetrics } from "@/data/dashboardData";
import { todaysAppointments } from "@/data/appointmentsData";

interface DashboardContainerProps {
  name: string;
  subtitle?: string;
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({ 
  name, 
  subtitle 
}) => {
  const { 
    dateRange, 
    setDateRange, 
    openDateFilter, 
    setOpenDateFilter, 
    formatDateRange 
  } = useDashboardDate();
  
  const [activeTab, setActiveTab] = React.useState("dashboard");
  
  // Calculate the total tasks
  const totalTasks = Object.values(dashboardTaskCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-0 py-3">
      <div className="mb-4">
        <DashboardGreeting 
          name={name} 
          subtitle={subtitle} 
        />
        
        <div className="mt-3 flex items-center gap-2">
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

export default DashboardContainer;
