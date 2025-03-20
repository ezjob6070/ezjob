
import React from "react";
import { PhoneCallIcon, BriefcaseIcon, CalculatorIcon, DollarSignIcon } from "lucide-react";
import DashboardMetricCard from "@/components/DashboardMetricCard";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

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
  // Format the date range for display
  const dateRangeText = () => {
    if (!dateRange?.from) return "";
    
    if (dateRange.to) {
      if (dateRange.from.toDateString() === dateRange.to.toDateString()) {
        return `for ${format(dateRange.from, "MMM d, yyyy")}`;
      }
      return `for ${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}`;
    }
    
    return `for ${format(dateRange.from, "MMM d, yyyy")}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <DashboardMetricCard
        title="Calls"
        value="28"
        icon={<PhoneCallIcon size={20} className="text-white" />}
        description="Total calls this month"
        trend={{ value: "12%", isPositive: true }}
        className="bg-gradient-to-br from-purple-500 to-violet-600"
        variant="vibrant"
        valueClassName="text-white text-2xl font-bold"
        onClick={() => openDetailDialog('tasks', 'Call Activity Details', detailedTasksData.filter(t => t.title.includes('call')))}
        dateRangeText={dateRangeText()}
      />
      <DashboardMetricCard
        title="Jobs"
        value="68"
        icon={<BriefcaseIcon size={20} className="text-white" />}
        description="Active jobs in progress"
        trend={{ value: "8%", isPositive: true }}
        className="bg-gradient-to-br from-blue-500 to-indigo-600"
        variant="vibrant"
        valueClassName="text-white text-2xl font-bold"
        onClick={() => openDetailDialog('tasks', 'Job Details', detailedTasksData)}
        dateRangeText={dateRangeText()}
      />
      <DashboardMetricCard
        title="Total Revenue"
        value={formatCurrency(financialMetrics.totalRevenue)}
        icon={<CalculatorIcon size={20} className="text-white" />}
        description="Revenue this month"
        trend={{ value: "5%", isPositive: false }}
        className="bg-gradient-to-br from-teal-500 to-emerald-600"
        variant="vibrant"
        valueClassName="text-white text-2xl font-bold"
        onClick={() => openDetailDialog('revenue', 'Revenue Details', detailedRevenueData)}
        dateRangeText={dateRangeText()}
      />
      <DashboardMetricCard
        title="Company's Cut"
        value={formatCurrency(financialMetrics.companysCut)}
        icon={<DollarSignIcon size={20} className="text-white" />}
        description="Commission earned"
        trend={{ value: "7%", isPositive: true }}
        className="bg-gradient-to-br from-amber-500 to-orange-600"
        variant="vibrant"
        valueClassName="text-white text-2xl font-bold"
        onClick={() => openDetailDialog('metrics', 'Financial Metrics', detailedBusinessMetrics)}
        dateRangeText={dateRangeText()}
      />
    </div>
  );
};

export default MetricsOverview;
