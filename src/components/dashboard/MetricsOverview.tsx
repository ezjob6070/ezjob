
import React from "react";
import { PhoneCallIcon, BriefcaseIcon, CalculatorIcon, DollarSignIcon } from "lucide-react";
import DashboardMetricCard from "@/components/DashboardMetricCard";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";

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
  dateRange?: DateRange;
};

const MetricsOverview = ({ 
  financialMetrics, 
  formatCurrency, 
  openDetailDialog,
  detailedTasksData,
  detailedRevenueData,
  detailedBusinessMetrics,
  dateRange
}: MetricsOverviewProps) => {
  const { jobs } = useGlobalState();
  
  // Calculate total metrics from all jobs data regardless of date
  const allJobs = jobs;
  const completedJobs = allJobs.filter(job => job.status === "completed").length;
  const activeJobs = allJobs.filter(job => job.status === "in_progress" || job.status === "scheduled").length;
  
  // Calculate lifetime values
  const lifetimeRevenue = financialMetrics.totalRevenue;
  const lifetimeProfit = financialMetrics.companysCut;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <DashboardMetricCard
        title="Total Completed Jobs"
        value={completedJobs.toString()}
        icon={<PhoneCallIcon size={20} className="text-white" />}
        description="All time completed jobs"
        trend={{ value: "↑", isPositive: true }}
        className="bg-gradient-to-br from-purple-500 to-violet-600 cursor-pointer hover:shadow-lg transition-all duration-300"
        variant="vibrant"
        valueClassName="text-white text-2xl font-bold"
        onClick={() => openDetailDialog('tasks', 'Completed Jobs', detailedTasksData.filter(t => t.status === 'completed'))}
      />
      <DashboardMetricCard
        title="Active Jobs"
        value={activeJobs.toString()}
        icon={<BriefcaseIcon size={20} className="text-white" />}
        description="Currently in progress"
        trend={{ value: "↑", isPositive: true }}
        className="bg-gradient-to-br from-yellow-400 to-yellow-500 cursor-pointer hover:shadow-lg transition-all duration-300"
        variant="vibrant"
        valueClassName="text-white text-2xl font-bold"
        onClick={() => openDetailDialog('tasks', 'Active Jobs', detailedTasksData.filter(t => t.status === 'in_progress' || t.status === 'scheduled'))}
      />
      <DashboardMetricCard
        title="Lifetime Revenue"
        value={formatCurrency(lifetimeRevenue)}
        icon={<CalculatorIcon size={20} className="text-white" />}
        description="Total revenue earned"
        trend={{ value: "↑", isPositive: true }}
        className="bg-gradient-to-br from-blue-500 to-blue-600 cursor-pointer hover:shadow-lg transition-all duration-300"
        variant="vibrant"
        valueClassName="text-white text-2xl font-bold"
        onClick={() => openDetailDialog('revenue', 'Revenue Details', detailedRevenueData)}
      />
      <DashboardMetricCard
        title="Lifetime Net Profit"
        value={formatCurrency(lifetimeProfit)}
        icon={<DollarSignIcon size={20} className="text-white" />}
        description="Total profit earned"
        trend={{ value: "↑", isPositive: true }}
        className="bg-gradient-to-br from-green-500 to-green-600 cursor-pointer hover:shadow-lg transition-all duration-300"
        variant="vibrant"
        valueClassName="text-white text-2xl font-bold"
        onClick={() => openDetailDialog('metrics', 'Financial Metrics', detailedBusinessMetrics)}
      />
    </div>
  );
};

export default MetricsOverview;
