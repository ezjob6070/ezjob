
import React from "react";
import { PhoneCallIcon, BriefcaseIcon, CalculatorIcon, DollarSignIcon } from "lucide-react";
import DashboardMetricCard from "@/components/DashboardMetricCard";
import { DateRange } from "react-day-picker";
import { format, isWithinInterval } from "date-fns";
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
};

const MetricsOverview = ({ 
  financialMetrics, 
  formatCurrency, 
  openDetailDialog,
  detailedTasksData,
  detailedRevenueData,
  detailedBusinessMetrics,
}: MetricsOverviewProps) => {
  const { jobs, dateFilter } = useGlobalState();
  
  // Filter jobs based on the date filter
  const filteredJobs = dateFilter?.from 
    ? jobs.filter(job => {
        // If the job has a scheduled date, check if it's within the filter range
        if (job.scheduledDate) {
          const jobDate = new Date(job.scheduledDate);
          return dateFilter.to 
            ? isWithinInterval(jobDate, { start: dateFilter.from, end: dateFilter.to }) 
            : jobDate >= dateFilter.from;
        }
        return false;
      })
    : jobs;
  
  // Calculate metrics based on filtered jobs
  const completedJobs = filteredJobs.filter(job => job.status === "completed").length;
  const activeJobs = filteredJobs.filter(job => job.status === "in_progress" || job.status === "scheduled").length;
  
  // Calculate revenue and profit based on filtered jobs
  const periodRevenue = filteredJobs.reduce((sum, job) => {
    if (job.status === "completed") {
      return sum + (job.actualAmount || job.amount || 0);
    }
    return sum;
  }, 0);
  
  const periodProfit = periodRevenue * 0.6; // Assuming 60% profit margin

  // Calculate lifetime values from all jobs
  const lifetimeRevenue = financialMetrics.totalRevenue;
  const lifetimeProfit = financialMetrics.companysCut;

  // Format date range for the metrics cards
  const getDateRangeText = () => {
    if (!dateFilter?.from) return "All time";
    
    if (!dateFilter.to || dateFilter.from.toDateString() === dateFilter.to.toDateString()) {
      return format(dateFilter.from, "MMM d, yyyy");
    }
    
    return `${format(dateFilter.from, "MMM d")} - ${format(dateFilter.to, "MMM d, yyyy")}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <DashboardMetricCard
        title="Completed Jobs"
        value={completedJobs.toString()}
        icon={<PhoneCallIcon size={20} className="text-white" />}
        description={`For ${getDateRangeText()}`}
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
        description={`For ${getDateRangeText()}`}
        trend={{ value: "↑", isPositive: true }}
        className="bg-gradient-to-br from-yellow-400 to-yellow-500 cursor-pointer hover:shadow-lg transition-all duration-300"
        variant="vibrant"
        valueClassName="text-white text-2xl font-bold"
        onClick={() => openDetailDialog('tasks', 'Active Jobs', detailedTasksData.filter(t => t.status === 'in_progress' || t.status === 'scheduled'))}
      />
      <DashboardMetricCard
        title="Period Revenue"
        value={formatCurrency(periodRevenue)}
        icon={<CalculatorIcon size={20} className="text-white" />}
        description={`For ${getDateRangeText()}`}
        trend={{ value: "↑", isPositive: true }}
        className="bg-gradient-to-br from-blue-500 to-blue-600 cursor-pointer hover:shadow-lg transition-all duration-300"
        variant="vibrant"
        valueClassName="text-white text-2xl font-bold"
        onClick={() => openDetailDialog('revenue', 'Revenue Details', detailedRevenueData)}
      />
      <DashboardMetricCard
        title="Period Profit"
        value={formatCurrency(periodProfit)}
        icon={<DollarSignIcon size={20} className="text-white" />}
        description={`For ${getDateRangeText()}`}
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
