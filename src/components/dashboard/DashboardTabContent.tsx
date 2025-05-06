
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import DashboardMetricCards from "@/components/dashboard/DashboardMetricCards";
import JobsStatusSection from "@/components/dashboard/JobsStatusSection";
import TodaysAppointmentsSection from "@/components/dashboard/TodaysAppointmentsSection";
import CallTrackingSection from "@/components/dashboard/CallTrackingSection";

interface DashboardTabContentProps {
  financialMetrics: {
    totalRevenue: number;
    monthlyGrowth: number;
    avgJobValue: number;
  };
  taskCounts: {
    completed: number;
    inProgress: number;
    canceled: number;
    rescheduled: number;
  };
  totalTasks: number;
  dateRangeFormatted: string;
  appointments: Array<{
    client: string;
    priority: 'high' | 'medium' | 'low';
    time: string;
    type: string;
    address: string;
  }>;
}

const DashboardTabContent: React.FC<DashboardTabContentProps> = ({
  financialMetrics,
  taskCounts,
  totalTasks,
  dateRangeFormatted,
  appointments
}) => {
  return (
    <>
      <TabsContent value="dashboard" className="mt-0 p-0">
        {/* Dashboard Metric Cards */}
        <DashboardMetricCards 
          financialMetrics={financialMetrics}
          taskCounts={taskCounts}
          totalTasks={totalTasks}
          dateRange={dateRangeFormatted}
        />
        
        {/* Two column layout - improved spacing and balance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-3">
          {/* Jobs Status Section - 2/3 width */}
          <div className="lg:col-span-2">
            <JobsStatusSection
              taskCounts={taskCounts}
              totalTasks={totalTasks}
              dateRangeText={dateRangeFormatted}
            />
          </div>
          
          {/* Right column with stacked sections */}
          <div className="lg:col-span-1 flex flex-col gap-3">
            {/* Today's Appointments - 1/3 width */}
            <TodaysAppointmentsSection
              appointments={appointments}
              dateRangeText={dateRangeFormatted}
            />
            
            {/* Call Tracking Section - moved to right column */}
            <CallTrackingSection 
              dateRangeText={dateRangeFormatted}
            />
          </div>
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
    </>
  );
};

export default DashboardTabContent;
