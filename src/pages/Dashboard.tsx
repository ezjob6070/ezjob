
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CalendarRange, BarChart3, Activity } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import JobsDateFilter from "@/components/jobs/filters/JobsDateFilter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EnhancedDonutChart from "@/components/EnhancedDonutChart";

import {
  dashboardTaskCounts,
  dashboardFinancialMetrics
} from "@/data/dashboardData";

// Import components
import CallTrackingSection from "@/components/dashboard/CallTrackingSection";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [openDateFilter, setOpenDateFilter] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  
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

  const todaysAppointments = [
    {
      client: "Sarah Johnson",
      priority: "high" as const,
      time: "09:30 AM",
      type: "Installation",
      address: "123 Main St"
    },
    {
      client: "James Wilson",
      priority: "medium" as const,
      time: "11:00 AM", 
      type: "Repair",
      address: "456 Oak Ave"
    },
    {
      client: "Emily Davis",
      priority: "low" as const,
      time: "01:15 PM",
      type: "Maintenance",
      address: "789 Pine Rd"
    },
    {
      client: "Michael Brown",
      priority: "medium" as const,
      time: "03:30 PM",
      type: "Inspection",
      address: "234 Elm St"
    }
  ];

  const statusData = [
    { 
      name: "Completed", 
      value: dashboardTaskCounts.completed, 
      color: "#22c55e", 
      gradientFrom: "#22c55e", 
      gradientTo: "#4ade80" 
    },
    { 
      name: "In Progress", 
      value: dashboardTaskCounts.inProgress, 
      color: "#3b82f6", 
      gradientFrom: "#3b82f6", 
      gradientTo: "#60a5fa" 
    },
    { 
      name: "Canceled", 
      value: dashboardTaskCounts.canceled, 
      color: "#ef4444", 
      gradientFrom: "#ef4444", 
      gradientTo: "#f87171" 
    },
    { 
      name: "Rescheduled", 
      value: dashboardTaskCounts.rescheduled, 
      color: "#a855f7", 
      gradientFrom: "#a855f7", 
      gradientTo: "#c084fc" 
    }
  ];

  return (
    <div className="space-y-3 py-3">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Hello, Alex Johnson</h1>
          <p className="text-muted-foreground">Welcome to your Easy Job dashboard</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mr-2">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="statistics" className="flex items-center gap-1">
                <BarChart3 className="h-3.5 w-3.5" />
                Statistics
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-1">
                <Activity className="h-3.5 w-3.5" />
                Analytics
              </TabsTrigger>
            </TabsList>
          </Tabs>

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
      </div>
      
      <TabsContent value="dashboard" className="mt-0 p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <Card className="bg-blue-50 shadow-sm border border-blue-100">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-medium text-blue-900">Total Revenue</h3>
                <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">+{dashboardFinancialMetrics.monthlyGrowth}%</span>
              </div>
              <div className="text-xl font-bold text-blue-900">${formatCurrency(dashboardFinancialMetrics.totalRevenue)}</div>
              <div className="text-xs text-blue-600 mt-1">
                ${formatCurrency(dashboardFinancialMetrics.avgJobValue)} avg per job • {formatDateRange()}
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
                  <div className="text-xs text-purple-700">{dashboardTaskCounts.inProgress}</div>
                  <div className="text-[10px] text-purple-700">In Progress</div>
                </div>
                <div className="bg-purple-100 rounded p-1 text-center">
                  <div className="text-xs text-purple-700">{dashboardTaskCounts.rescheduled}</div>
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
                  <div className="relative">
                    <EnhancedDonutChart 
                      data={statusData}
                      title={`${totalTasks}`}
                      subtitle="Total Jobs"
                      size={240}
                      thickness={40}
                      animation={true}
                      showLegend={false}
                    />
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
                  {todaysAppointments.map((appointment, index) => (
                    <div key={index} className="flex gap-3 p-3 border border-gray-100 rounded-md">
                      <div className={`mt-1 w-1.5 rounded-full ${
                        appointment.priority === 'high' ? 'bg-red-500' : 
                        appointment.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      } h-12`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{appointment.client}</h4>
                          <span className={`text-xs bg-${
                            appointment.priority === 'high' ? 'red' : 
                            appointment.priority === 'medium' ? 'yellow' : 'green'
                          }-100 text-${
                            appointment.priority === 'high' ? 'red' : 
                            appointment.priority === 'medium' ? 'yellow' : 'green'
                          }-700 px-1.5 py-0.5 rounded`}>
                            {appointment.priority}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">{appointment.time} - {appointment.type}</div>
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {appointment.address}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" size="sm" className="w-full">
                    View Full Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-4">
          <CallTrackingSection />
        </div>
      </TabsContent>
      
      <TabsContent value="statistics" className="mt-0 p-0">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Detailed Statistics</h2>
          <p className="text-gray-500">This section will display detailed statistical information.</p>
        </div>
      </TabsContent>
      
      <TabsContent value="analytics" className="mt-0 p-0">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Performance Analytics</h2>
          <p className="text-gray-500">This section will display detailed analytics information.</p>
        </div>
      </TabsContent>
    </div>
  );
};

export default Dashboard;
