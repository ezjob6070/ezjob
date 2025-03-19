
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MetricsOverview from "@/components/dashboard/MetricsOverview";
import TopTechniciansCard from "@/components/dashboard/TopTechniciansCard";
import PerformanceCard from "@/components/dashboard/PerformanceCard";
import TicketsStatusCard from "@/components/dashboard/TicketsStatusCard";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";

import {
  dashboardFinancialMetrics,
  dashboardTopTechnicians,
  detailedTasksData,
  detailedRevenueData,
  detailedBusinessMetrics,
  detailedClientsData
} from "@/data/dashboardData";

const Index = () => {
  const openDetailDialog = () => {
    // This is just a placeholder - in a real app, this would open a dialog
    console.log("Would open detail dialog here");
  };

  // Sample data for Performance Card
  const leadSources = [
    { name: "Facebook", value: 45 },
    { name: "Google", value: 32 },
    { name: "Referrals", value: 15 },
    { name: "Other", value: 8 }
  ];

  const jobTypePerformance = [
    { name: "HVAC Repair", value: 38 },
    { name: "Installation", value: 30 },
    { name: "Maintenance", value: 22 },
    { name: "Consultation", value: 10 }
  ];

  // Sample data for Tickets Status
  const taskCounts = {
    joby: 25,
    inProgress: 18,
    submitted: 12,
    draft: 8,
    completed: 42,
    canceled: 5
  };

  const totalTasks = Object.values(taskCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-6 py-4">
      <DashboardHeader />
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Overview</h2>
        <MetricsOverview 
          financialMetrics={dashboardFinancialMetrics}
          formatCurrency={formatCurrency}
          openDetailDialog={openDetailDialog}
          detailedTasksData={detailedTasksData}
          detailedRevenueData={detailedRevenueData}
          detailedBusinessMetrics={detailedBusinessMetrics}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <TicketsStatusCard 
            taskCounts={taskCounts} 
            totalTasks={totalTasks}
            openDetailDialog={openDetailDialog}
            detailedTasksData={detailedTasksData}
          />
        </div>
        
        <div className="space-y-6">
          <PerformanceCard 
            leadSources={leadSources}
            jobTypePerformance={jobTypePerformance}
            financialMetrics={dashboardFinancialMetrics}
            formatCurrency={formatCurrency}
            openDetailDialog={openDetailDialog}
            detailedBusinessMetrics={detailedBusinessMetrics}
          />
        </div>
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Performers</h2>
        <TopTechniciansCard 
          topTechnicians={dashboardTopTechnicians}
          formatCurrency={formatCurrency}
          openDetailDialog={openDetailDialog}
          detailedClientsData={detailedClientsData}
        />
      </div>
    </div>
  );
};

export default Index;
