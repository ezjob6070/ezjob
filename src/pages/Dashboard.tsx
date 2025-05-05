
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MetricsOverview from "@/components/dashboard/MetricsOverview";
import TicketsStatusCard from "@/components/dashboard/TicketsStatusCard";
import PerformanceCard from "@/components/dashboard/PerformanceCard";
import TopTechniciansCard from "@/components/dashboard/TopTechniciansCard";
import ActivitySection from "@/components/dashboard/ActivitySection";
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
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
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
            financialMetrics={{
              totalRevenue: dashboardFinancialMetrics.totalRevenue,
              totalJobs: totalTasks, 
              avgJobValue: dashboardFinancialMetrics.avgJobValue,
              totalLeads: dashboardLeadSources.reduce((sum, source) => sum + source.value, 0),
              conversionRate: dashboardFinancialMetrics.conversionRate,
              monthlyGrowth: dashboardFinancialMetrics.monthlyGrowth,
              monthlyData: detailedRevenueData.map(item => ({ 
                name: item.date.substring(0, 7), // Using date instead of month
                value: item.amount // Using amount instead of revenue
              }))
            }}
            formatCurrency={formatCurrency}
            detailedTasksData={detailedTasksData}
            detailedRevenueData={detailedRevenueData}
            detailedBusinessMetrics={detailedBusinessMetrics}
            dateRange={dateRange}
          />
          
          <TicketsStatusCard 
            taskCounts={{
              new: dashboardTaskCounts.joby, // Using joby instead of new
              inProgress: dashboardTaskCounts.inProgress,
              completed: dashboardTaskCounts.completed,
              cancelled: dashboardTaskCounts.canceled // Using canceled instead of cancelled
            }}
            totalTasks={totalTasks}
            detailedTasksData={detailedTasksData}
            dateRange={dateRange}
          />
          
          <PerformanceCard 
            leadSources={dashboardLeadSources.map(source => ({
              name: source.name,
              count: source.value,
              percentage: source.percentage
            }))}
            jobTypePerformance={dashboardJobTypePerformance.map(performance => ({
              name: performance.name,
              completed: performance.value,
              total: performance.revenue / performance.avgValue
            }))}
            financialMetrics={{
              totalRevenue: dashboardFinancialMetrics.totalRevenue,
              totalJobs: totalTasks,
              avgJobValue: dashboardFinancialMetrics.avgJobValue,
              totalLeads: dashboardLeadSources.reduce((sum, source) => sum + source.value, 0),
              conversionRate: dashboardFinancialMetrics.conversionRate,
              monthlyGrowth: dashboardFinancialMetrics.monthlyGrowth
            }}
            formatCurrency={formatCurrency}
            detailedBusinessMetrics={detailedBusinessMetrics}
            dateRange={dateRange}
          />
        </div>
        
        <div className="lg:col-span-2 space-y-4">
          <TopTechniciansCard 
            topTechnicians={dashboardTopTechnicians.map(tech => ({
              id: `tech-${tech.name.toLowerCase().replace(/\s+/g, '-')}`,
              name: tech.name,
              avatar: tech.avatar,
              initials: tech.name.split(' ').map(n => n[0]).join(''),
              completedJobs: tech.jobs,
              revenue: tech.revenue,
              rating: tech.rating,
              status: Math.random() > 0.5 ? 'available' : (Math.random() > 0.5 ? 'busy' : 'offline')
            }))}
            formatCurrency={formatCurrency}
            detailedClientsData={detailedClientsData}
            dateRange={dateRange}
          />
          
          <ActivitySection 
            activities={dashboardActivities.map(activity => ({
              id: activity.id,
              type: activity.type,
              user: {
                name: activity.user.name,
                avatar: undefined,
                initials: activity.user.initials
              },
              description: activity.title,
              timestamp: activity.time
            }))}
            events={dashboardEvents.map(event => {
              // Handle the event type conversion properly
              let eventType: "meeting" | "job" | "call" = "meeting"; // Default to "meeting"
              
              if (event.type === "job") {
                eventType = "job";
              } else if (event.type === "call") {
                eventType = "call";
              }
              
              return {
                id: event.id,
                title: event.title,
                type: eventType,
                time: format(event.datetime, 'h:mm a'),
                date: format(event.datetime, 'MMM d, yyyy')
              };
            })}
            dateRange={dateRange}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
