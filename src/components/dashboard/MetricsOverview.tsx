
import React from "react";
import { PhoneCallIcon, BriefcaseIcon, CalculatorIcon, DollarSignIcon } from "lucide-react";
import DashboardMetricCard from "@/components/DashboardMetricCard";

type MetricsOverviewProps = {
  financialMetrics: {
    totalRevenue: number;
    companysCut: number;
    [key: string]: any;
  };
  formatCurrency: (amount: number) => string;
  openDetailDialog: (type: 'tasks' | 'leads' | 'clients' | 'revenue' | 'metrics', title: string, data: any[]) => void;
  detailedTasksData: any[];
  detailedRevenueData: any[];
  detailedBusinessMetrics: any[];
};

const MetricsOverview = ({ 
  financialMetrics, 
  formatCurrency, 
  openDetailDialog,
  detailedTasksData,
  detailedRevenueData,
  detailedBusinessMetrics
}: MetricsOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardMetricCard
        title="Calls"
        value="28"
        icon={<PhoneCallIcon size={20} />}
        description="Total calls this month"
        trend={{ value: "12%", isPositive: true }}
        className="bg-white"
        onClick={() => openDetailDialog('tasks', 'Call Activity Details', detailedTasksData.filter(t => t.title.includes('call')))}
      />
      <DashboardMetricCard
        title="Jobs"
        value="68"
        icon={<BriefcaseIcon size={20} />}
        description="Active jobs in progress"
        trend={{ value: "8%", isPositive: true }}
        className="bg-white"
        onClick={() => openDetailDialog('tasks', 'Job Details', detailedTasksData)}
      />
      <DashboardMetricCard
        title="Total Revenue"
        value={formatCurrency(financialMetrics.totalRevenue)}
        icon={<CalculatorIcon size={20} />}
        description="Revenue this month"
        trend={{ value: "5%", isPositive: false }}
        className="bg-white"
        onClick={() => openDetailDialog('revenue', 'Revenue Details', detailedRevenueData)}
      />
      <DashboardMetricCard
        title="Company's Cut"
        value={formatCurrency(financialMetrics.companysCut)}
        icon={<DollarSignIcon size={20} />}
        description="Commission earned"
        trend={{ value: "7%", isPositive: true }}
        className="bg-white"
        onClick={() => openDetailDialog('metrics', 'Financial Metrics', detailedBusinessMetrics)}
      />
    </div>
  );
};

export default MetricsOverview;
