
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
        <div>
          <h1 className="text-2xl font-bold">Hello, Alex Johnson</h1>
          <p className="text-muted-foreground">Welcome to your Easy Job dashboard</p>
        </div>
        
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
        <Card className="bg-blue-50 shadow-sm border border-blue-100">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium text-blue-900">Total Revenue</h3>
              <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">+{dashboardFinancialMetrics.monthlyGrowth}%</span>
            </div>
            <div className="text-xl font-bold text-blue-900">${formatCurrency(dashboardFinancialMetrics.totalRevenue)}</div>
            <div className="text-xs text-blue-600 mt-1">
              ${formatCurrency(dashboardFinancialMetrics.avgJobValue)} avg per job • {dateRange?.from ? formatDateRange() : "All time"}
            </div>
            <div className="w-full bg-blue-200 h-2 rounded-full mt-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: "78%" }}></div>
            </div>
            <div className="text-xs text-blue-600 mt-1">78% of quarterly target</div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 shadow-sm border border-green-100">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium text-green-900">Net Profit</h3>
              <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">60% profit margin</span>
            </div>
            <div className="text-xl font-bold text-green-900">${formatCurrency(dashboardFinancialMetrics.totalRevenue * 0.6)}</div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="bg-green-100 rounded p-1 text-center">
                <div className="text-xs text-green-700">$23,800</div>
                <div className="text-[10px] text-green-700">Labor</div>
              </div>
              <div className="bg-green-100 rounded p-1 text-center">
                <div className="text-xs text-green-700">$17,850</div>
                <div className="text-[10px] text-green-700">Materials</div>
              </div>
              <div className="bg-green-100 rounded p-1 text-center">
                <div className="text-xs text-green-700">$17,850</div>
                <div className="text-[10px] text-green-700">Operating</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 shadow-sm border border-purple-100">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium text-purple-900">Total Jobs</h3>
              <span className="text-xs text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">{totalTasks}</span>
            </div>
            <div className="text-xl font-bold text-purple-900">{totalTasks}</div>
            <div className="text-xs text-purple-600 mt-1">
              {dashboardTaskCounts.completed} completed, {dashboardTaskCounts.inProgress} in progress
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="bg-purple-100 rounded p-1 text-center">
                <div className="text-xs text-purple-700">53%</div>
                <div className="text-[10px] text-purple-700">Completion Rate</div>
              </div>
              <div className="bg-purple-100 rounded p-1 text-center">
                <div className="text-xs text-purple-700">24</div>
                <div className="text-[10px] text-purple-700">In Progress</div>
              </div>
              <div className="bg-purple-100 rounded p-1 text-center">
                <div className="text-xs text-purple-700">6</div>
                <div className="text-[10px] text-purple-700">Rescheduled</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Jobs By Status</CardTitle>
              <p className="text-xs text-muted-foreground">Overview of service requests and job status</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex items-center justify-center">
                  <svg width="200" height="200" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" strokeWidth="30" />
                    <circle 
                      cx="100" 
                      cy="100" 
                      r="80" 
                      fill="none" 
                      stroke="#22c55e" 
                      strokeWidth="30" 
                      strokeDasharray={`${2 * Math.PI * 80 * (dashboardTaskCounts.completed / totalTasks)} ${2 * Math.PI * 80}`}
                      strokeDashoffset={2 * Math.PI * 80 * 0.25}
                    />
                    <circle 
                      cx="100" 
                      cy="100" 
                      r="80" 
                      fill="none" 
                      stroke="#3b82f6" 
                      strokeWidth="30" 
                      strokeDasharray={`${2 * Math.PI * 80 * (dashboardTaskCounts.inProgress / totalTasks)} ${2 * Math.PI * 80}`}
                      strokeDashoffset={2 * Math.PI * 80 * (0.25 - dashboardTaskCounts.completed / totalTasks)}
                    />
                    <circle 
                      cx="100" 
                      cy="100" 
                      r="80" 
                      fill="none" 
                      stroke="#ef4444" 
                      strokeWidth="30" 
                      strokeDasharray={`${2 * Math.PI * 80 * (dashboardTaskCounts.canceled / totalTasks)} ${2 * Math.PI * 80}`}
                      strokeDashoffset={2 * Math.PI * 80 * (0.25 - dashboardTaskCounts.completed / totalTasks - dashboardTaskCounts.inProgress / totalTasks)}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <div className="text-3xl font-bold">{totalTasks}</div>
                    <div className="text-xs text-muted-foreground">Total Jobs</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2 w-full">
                  <div className="flex items-center justify-between p-2 rounded bg-green-50">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span>Completed</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{dashboardTaskCounts.completed}</span>
                      <div className="text-xs bg-green-100 px-2 py-0.5 rounded-full">
                        {Math.round((dashboardTaskCounts.completed / totalTasks) * 100)}%
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 px-2">View</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 rounded bg-blue-50">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span>In Progress</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{dashboardTaskCounts.inProgress}</span>
                      <div className="text-xs bg-blue-100 px-2 py-0.5 rounded-full">
                        {Math.round((dashboardTaskCounts.inProgress / totalTasks) * 100)}%
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 px-2">View</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 rounded bg-red-50">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <span>Cancelled</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{dashboardTaskCounts.canceled}</span>
                      <div className="text-xs bg-red-100 px-2 py-0.5 rounded-full">
                        {Math.round((dashboardTaskCounts.canceled / totalTasks) * 100)}%
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 px-2">View</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 rounded bg-purple-50">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                      <span>Rescheduled</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{dashboardTaskCounts.rescheduled}</span>
                      <div className="text-xs bg-purple-100 px-2 py-0.5 rounded-full">
                        {Math.round((dashboardTaskCounts.rescheduled / totalTasks) * 100)}%
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 px-2">View</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="bg-white shadow-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Today's Appointments</CardTitle>
              <p className="text-xs text-muted-foreground">Scheduled jobs for today</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3 p-3 border border-gray-100 rounded-md">
                  <div className="mt-1 w-1.5 rounded-full bg-red-500 h-12"></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Sarah Johnson</h4>
                      <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">high</span>
                    </div>
                    <div className="text-xs text-gray-500">09:30 AM - Installation</div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      123 Main St
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 p-3 border border-gray-100 rounded-md">
                  <div className="mt-1 w-1.5 rounded-full bg-yellow-500 h-12"></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">James Wilson</h4>
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">medium</span>
                    </div>
                    <div className="text-xs text-gray-500">11:00 AM - Repair</div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      456 Oak Ave
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 p-3 border border-gray-100 rounded-md">
                  <div className="mt-1 w-1.5 rounded-full bg-green-500 h-12"></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Emily Davis</h4>
                      <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">low</span>
                    </div>
                    <div className="text-xs text-gray-500">01:15 PM - Maintenance</div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      789 Pine Rd
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 p-3 border border-gray-100 rounded-md">
                  <div className="mt-1 w-1.5 rounded-full bg-yellow-500 h-12"></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Michael Brown</h4>
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">medium</span>
                    </div>
                    <div className="text-xs text-gray-500">03:30 PM - Inspection</div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      234 Elm St
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  View Full Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Call Tracking & Conversion</CardTitle>
          <p className="text-xs text-muted-foreground">Overview of incoming calls and customer conversion rate</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-md p-3 flex flex-col">
              <div className="text-xs text-blue-700 mb-1">Total Calls</div>
              <div className="text-2xl font-bold text-blue-900">154</div>
              <div className="text-xs text-blue-600 mt-auto">Last 30 days</div>
            </div>
            
            <div className="bg-green-50 rounded-md p-3 flex flex-col">
              <div className="text-xs text-green-700 mb-1">Converted</div>
              <div className="text-2xl font-bold text-green-900">98</div>
              <div className="text-xs text-green-600 mt-auto">New customers</div>
            </div>
            
            <div className="bg-amber-50 rounded-md p-3 flex flex-col">
              <div className="text-xs text-amber-700 mb-1">Scheduled</div>
              <div className="text-2xl font-bold text-amber-900">37</div>
              <div className="text-xs text-amber-600 mt-auto">Follow-up</div>
            </div>
            
            <div className="bg-red-50 rounded-md p-3 flex flex-col">
              <div className="text-xs text-red-700 mb-1">Missed</div>
              <div className="text-2xl font-bold text-red-900">19</div>
              <div className="text-xs text-red-600 mt-auto">Opportunities</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <div className="text-sm font-medium">Conversion Rate</div>
              <div className="text-xl font-bold">63%</div>
            </div>
            <div className="text-xs text-muted-foreground mb-2">Calls to customer conversion</div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: "63%" }}></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>0%</span>
              <span>Target: 70%</span>
              <span>100%</span>
            </div>
            <div className="flex items-center mt-2 text-xs text-amber-600">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Needs improvement - 7% below target
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
