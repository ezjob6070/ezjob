
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

const IndexPage = () => {
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

  const taskCounts = {
    joby: 15,
    inProgress: 35,
    completed: 80,
    canceled: 10
  };

  const financialMetrics = {
    totalRevenue: 56000,
    totalJobs: 140,
    avgJobValue: 400,
    totalLeads: 200,
    conversionRate: 0.6,
    monthlyGrowth: 0.05
  };

  const leadSources = [
    { name: "Google", value: 80, percentage: 0.4 },
    { name: "Facebook", value: 70, percentage: 0.35 },
    { name: "Referral", value: 30, percentage: 0.15 },
    { name: "Other", value: 20, percentage: 0.1 }
  ];

  const jobTypePerformance = [
    { name: "Plumbing", value: 30, revenue: 12000, avgValue: 400 },
    { name: "Electrical", value: 40, revenue: 16000, avgValue: 400 },
    { name: "Carpentry", value: 25, revenue: 10000, avgValue: 400 },
    { name: "Painting", value: 45, revenue: 18000, avgValue: 400 }
  ];

  const topTechnicians = [
    { name: "John Smith", avatar: "/avatars/avatar-1.png", jobs: 45, revenue: 20000, rating: 4.8 },
    { name: "Emily Johnson", avatar: "/avatars/avatar-2.png", jobs: 35, revenue: 16000, rating: 4.6 },
    { name: "David Brown", avatar: "/avatars/avatar-3.png", jobs: 30, revenue: 14000, rating: 4.5 }
  ];

  const activities = [
    { id: "activity-1", type: "job-created", user: { name: "John Smith", initials: "JS" }, title: "Created a new job for plumbing at 123 Main St", time: "2 hours ago" },
    { id: "activity-2", type: "job-updated", user: { name: "Emily Johnson", initials: "EJ" }, title: "Updated the electrical job at 456 Oak Ave", time: "5 hours ago" },
    { id: "activity-3", type: "payment-received", user: { name: "David Brown", initials: "DB" }, title: "Received a payment of $500 for carpentry at 789 Pine Ln", time: "8 hours ago" }
  ];

  const events = [
    { id: "event-1", type: "meeting" as const, title: "Team Meeting", datetime: new Date("2024-07-15T10:00:00"), location: "Conference Room" },
    { id: "event-2", type: "meeting" as const, title: "Project Deadline", datetime: new Date("2024-07-20T17:00:00") }
  ];

  const totalTasks = Object.values(taskCounts).reduce((sum, count) => sum + count, 0);
  
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
      
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          
        </div>
        
        <div className="col-span-12 md:col-span-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <Card className="bg-white shadow-sm border border-gray-100">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium">Revenue</h3>
                  <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">+{financialMetrics.monthlyGrowth}%</span>
                </div>
                <div className="text-xl font-bold">{formatCurrency(financialMetrics.totalRevenue)}</div>
                <div className="text-xs text-gray-500 mt-1">
                  From {totalTasks} jobs • {dateRange?.from ? formatDateRange() : "All time"}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-sm border border-gray-100">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium">Job Completion</h3>
                  <span className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{Math.round((taskCounts.completed / totalTasks) * 100)}%</span>
                </div>
                <div className="text-xl font-bold">{taskCounts.completed}/{totalTasks}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {taskCounts.inProgress} in progress • {dateRange?.from ? formatDateRange() : "All time"}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-sm border border-gray-100">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium">Average Value</h3>
                  <span className="text-xs text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">Per Job</span>
                </div>
                <div className="text-xl font-bold">{formatCurrency(financialMetrics.avgJobValue)}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Conversion rate: {financialMetrics.conversionRate}% • {dateRange?.from ? formatDateRange() : "All time"}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricsOverview 
              financialMetrics={{
                totalRevenue: financialMetrics.totalRevenue,
                totalJobs: totalTasks,
                avgJobValue: financialMetrics.avgJobValue,
                totalLeads: leadSources.reduce((sum, source) => sum + source.value, 0),
                conversionRate: financialMetrics.conversionRate,
                monthlyGrowth: financialMetrics.monthlyGrowth,
                monthlyData: [
                  { name: "Jan", value: 12000 },
                  { name: "Feb", value: 15000 },
                  { name: "Mar", value: 18000 },
                  { name: "Apr", value: 14000 },
                  { name: "May", value: 21000 },
                  { name: "Jun", value: 25000 }
                ]
              }}
              formatCurrency={formatCurrency}
              dateRange={dateRange}
            />
            
            <TicketsStatusCard 
              taskCounts={{
                new: taskCounts.joby, 
                inProgress: taskCounts.inProgress, 
                completed: taskCounts.completed, 
                cancelled: taskCounts.canceled
              }}
              totalTasks={totalTasks}
              dateRange={dateRange}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PerformanceCard 
              leadSources={leadSources.map(source => ({
                name: source.name,
                count: source.value,
                percentage: source.percentage
              }))}
              jobTypePerformance={jobTypePerformance.map(performance => ({
                name: performance.name,
                completed: performance.value,
                total: performance.revenue / performance.avgValue
              }))}
              financialMetrics={{
                totalRevenue: financialMetrics.totalRevenue,
                totalJobs: totalTasks,
                avgJobValue: financialMetrics.avgJobValue,
                totalLeads: leadSources.reduce((sum, source) => sum + source.value, 0),
                conversionRate: financialMetrics.conversionRate,
                monthlyGrowth: financialMetrics.monthlyGrowth
              }}
              formatCurrency={formatCurrency}
              dateRange={dateRange}
            />
            
            <TopTechniciansCard 
              topTechnicians={topTechnicians.map(tech => ({
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
              dateRange={dateRange}
            />
          </div>
        </div>
        
        <div className="col-span-12 md:col-span-4 space-y-4">
          <ActivitySection 
            activities={activities.map(activity => ({
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
            events={events.map(event => ({
              id: event.id,
              title: event.title,
              type: "meeting",
              time: format(event.datetime, 'h:mm a'),
              date: format(event.datetime, 'MMM d, yyyy')
            }))}
            dateRange={dateRange}
          />
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
