
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MetricsOverview from "@/components/dashboard/MetricsOverview";
import TopTechniciansCard from "@/components/dashboard/TopTechniciansCard";
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

  return (
    <div className="space-y-4 py-4">
      <DashboardHeader />
      
      <MetricsOverview 
        financialMetrics={dashboardFinancialMetrics}
        formatCurrency={formatCurrency}
        openDetailDialog={openDetailDialog}
        detailedTasksData={detailedTasksData}
        detailedRevenueData={detailedRevenueData}
        detailedBusinessMetrics={detailedBusinessMetrics}
      />

      <TopTechniciansCard 
        topTechnicians={dashboardTopTechnicians}
        formatCurrency={formatCurrency}
        openDetailDialog={openDetailDialog}
        detailedClientsData={detailedClientsData}
      />
    </div>
  );
};

export default Index;
