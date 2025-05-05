
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MetricsOverview from "@/components/dashboard/MetricsOverview";
import TicketsStatusCard from "@/components/dashboard/TicketsStatusCard";
import PerformanceCard from "@/components/dashboard/PerformanceCard";
import TopTechniciansCard from "@/components/dashboard/TopTechniciansCard";
import ActivitySection from "@/components/dashboard/ActivitySection";
import { useGlobalDateRange } from "@/components/GlobalDateRangeFilter";
import { Button } from "@/components/ui/button";
import { CalendarRange } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import JobsDateFilter from "@/components/jobs/filters/JobsDateFilter";

import {
  dashboardTaskCounts,
  dashboardFinancialMetrics,
  dashboardLeadSources,
  dashboardJobTypePerformance,
  dashboardTopTechnicians,
  dashboardActivities,
  dashboardEvents,
  detailedTasksData,
  detailedLeadsData,
  detailedRevenueData,
  detailedClientsData,
  detailedBusinessMetrics
} from "@/data/dashboardData";

import { formatCurrency } from "@/components/dashboard/DashboardUtils";

const Dashboard = () => {
  // Use the global date range context
  const { dateRange, setDateRange } = useGlobalDateRange();
  const [openDateFilter, setOpenDateFilter] = useState(false);
  
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

  return (
    <div className="space-y-3 py-3">
      <div className="flex justify-between items-center mb-4">
        <DashboardHeader />
        
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium">Revenue</h3>
              <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">+{dashboardFinancialMetrics.monthlyGrowth}%</span>
            </div>
            <div className="text-xl font-bold">{formatCurrency(dashboardFinancialMetrics.totalRevenue)}</div>
            <div className="text-xs text-gray-500 mt-1">
              From {totalTasks} jobs • {dateRange?.from ? formatDateRange() : "All time"}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium">Job Completion</h3>
              <span className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{Math.round((dashboardTaskCounts.completed / totalTasks) * 100)}%</span>
            </div>
            <div className="text-xl font-bold">{dashboardTaskCounts.completed}/{totalTasks}</div>
            <div className="text-xs text-gray-500 mt-1">
              {dashboardTaskCounts.inProgress} in progress • {dateRange?.from ? formatDateRange() : "All time"}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium">Average Value</h3>
              <span className="text-xs text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">Per Job</span>
            </div>
            <div className="text-xl font-bold">{formatCurrency(dashboardFinancialMetrics.avgJobValue)}</div>
            <div className="text-xs text-gray-500 mt-1">
              Conversion rate: {dashboardFinancialMetrics.conversionRate}% • {dateRange?.from ? formatDateRange() : "All time"}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <MetricsOverview 
            financialMetrics={dashboardFinancialMetrics}
            formatCurrency={formatCurrency}
            detailedTasksData={detailedTasksData}
            detailedRevenueData={detailedRevenueData}
            detailedBusinessMetrics={detailedBusinessMetrics}
            dateRange={dateRange}
          />
          
          <TicketsStatusCard 
            taskCounts={dashboardTaskCounts}
            totalTasks={totalTasks}
            detailedTasksData={detailedTasksData}
            dateRange={dateRange}
          />
          
          <PerformanceCard 
            leadSources={dashboardLeadSources}
            jobTypePerformance={dashboardJobTypePerformance}
            financialMetrics={dashboardFinancialMetrics}
            formatCurrency={formatCurrency}
            detailedBusinessMetrics={detailedBusinessMetrics}
            dateRange={dateRange}
          />
        </div>
        
        <div className="lg:col-span-2 space-y-4">
          <TopTechniciansCard 
            topTechnicians={dashboardTopTechnicians}
            formatCurrency={formatCurrency}
            detailedClientsData={detailedClientsData}
            dateRange={dateRange}
          />
          
          <ActivitySection 
            activities={dashboardActivities}
            events={dashboardEvents}
            dateRange={dateRange}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
