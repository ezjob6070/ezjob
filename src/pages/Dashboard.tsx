import { useState } from "react";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { IndustryType } from "@/components/sidebar/sidebarTypes";
import {
  BarChartIcon,
  TrendingUpIcon,
  UsersIcon,
  ClockIcon,
  CalendarIcon,
  ActivityIcon,
  PieChartIcon,
  DollarSignIcon,
  BuildingIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClipboardIcon,
  AlertCircleIcon,
} from "lucide-react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MetricsOverview from "@/components/dashboard/MetricsOverview";
import PerformanceCard from "@/components/dashboard/PerformanceCard";
import TopTechniciansCard from "@/components/dashboard/TopTechniciansCard";
import ActivitySection from "@/components/dashboard/ActivitySection";
import DashboardDetailDialog from "@/components/DashboardDetailDialog";
import EnhancedDateRangeFilter from "@/components/dashboard/EnhancedDateRangeFilter";
import IndustrySelector from "@/components/IndustrySelector";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";
import DashboardMetricCard from "@/components/DashboardMetricCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EnhancedDonutChart } from "@/components/EnhancedDonutChart";
import StatCard from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import JobStatusDialog from "@/components/JobStatusDialog";

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
  detailedBusinessMetrics,
  jobsByStatus
} from "@/data/dashboardData";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [activeDialog, setActiveDialog] = useState<{
    open: boolean;
    type: 'tasks' | 'leads' | 'clients' | 'revenue' | 'metrics';
    title: string;
    data: any[];
  }>({
    open: false,
    type: 'tasks',
    title: '',
    data: []
  });

  const [statusDialog, setStatusDialog] = useState<{
    open: boolean;
    status: string;
    title: string;
    data: any[];
  }>({
    open: false,
    status: '',
    title: '',
    data: []
  });

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const { jobs, currentIndustry } = useGlobalState();

  // Use our predefined fake data
  const totalTasks = Object.values(dashboardTaskCounts).reduce((sum, count) => sum + count, 0);
  const completedJobs = dashboardTaskCounts.completed;
  const rescheduledJobs = dashboardTaskCounts.rescheduled; 
  const totalRevenue = dashboardFinancialMetrics.totalRevenue;
  const totalExpenses = totalRevenue * 0.4;
  const companyProfit = totalRevenue - totalExpenses;
  const avgJobValue = dashboardFinancialMetrics.avgJobValue;
  const monthlyGrowth = dashboardFinancialMetrics.monthlyGrowth;
  const conversionRate = dashboardFinancialMetrics.conversionRate;
  const totalJobs = totalTasks;

  const openDetailDialog = (type: 'tasks' | 'leads' | 'clients' | 'revenue' | 'metrics', title: string, data: any[]) => {
    setActiveDialog({
      open: true,
      type,
      title,
      data
    });
  };

  const openStatusDialog = (status: string, title: string, data: any[]) => {
    setStatusDialog({
      open: true,
      status,
      title,
      data
    });
  };

  // Format date range for display
  const getDateRangeText = () => {
    if (!date?.from) return "All time";
    
    if (!date.to) {
      return format(date.from, "MMM d, yyyy");
    }
    
    return `${format(date.from, "MMM d")} - ${format(date.to, "MMM d, yyyy")}`;
  };

  // Sample statistics data
  const revenueData = [
    { name: 'Jan', revenue: 78000, target: 72000 },
    { name: 'Feb', revenue: 82000, target: 75000 },
    { name: 'Mar', revenue: 95000, target: 79000 },
    { name: 'Apr', revenue: 89000, target: 82000 },
    { name: 'May', revenue: 102000, target: 86000 },
    { name: 'Jun', revenue: 115000, target: 90000 },
    { name: 'Jul', revenue: 128000, target: 95000 },
    { name: 'Aug', revenue: 142000, target: 100000 },
    { name: 'Sep', revenue: 135000, target: 105000 },
    { name: 'Oct', revenue: 152000, target: 110000 },
    { name: 'Nov', revenue: 165000, target: 115000 },
    { name: 'Dec', revenue: 178000, target: 120000 },
  ];

  const jobTypeData = [
    { name: 'Repair', value: 42, color: '#4f46e5', gradientFrom: '#6366f1', gradientTo: '#4338ca' },
    { name: 'Installation', value: 28, color: '#0ea5e9', gradientFrom: '#38bdf8', gradientTo: '#0284c7' },
    { name: 'Maintenance', value: 18, color: '#10b981', gradientFrom: '#34d399', gradientTo: '#059669' },
    { name: 'Other', value: 12, color: '#f59e0b', gradientFrom: '#fbbf24', gradientTo: '#d97706' },
  ];

  // Create job status data for the circular visualization with enhanced colors and gradients
  const jobStatusData = [
    { name: 'Completed', value: dashboardTaskCounts.completed, color: '#22c55e', gradientFrom: '#4ade80', gradientTo: '#16a34a' },
    { name: 'In Progress', value: dashboardTaskCounts.inProgress, color: '#3b82f6', gradientFrom: '#60a5fa', gradientTo: '#2563eb' },
    { name: 'Cancelled', value: dashboardTaskCounts.canceled, color: '#ef4444', gradientFrom: '#f87171', gradientTo: '#dc2626' },
    { name: 'Rescheduled', value: dashboardTaskCounts.rescheduled, color: '#ec4899', gradientFrom: '#f472b6', gradientTo: '#db2777' },
  ];

  // Sample analytics data
  const performanceData = [
    { month: 'Jan', calls: 64, jobs: 42, revenue: 78000 },
    { month: 'Feb', calls: 68, jobs: 46, revenue: 82000 },
    { month: 'Mar', calls: 72, jobs: 52, revenue: 95000 },
    { month: 'Apr', calls: 75, jobs: 48, revenue: 89000 },
    { month: 'May', calls: 80, jobs: 55, revenue: 102000 },
    { month: 'Jun', calls: 87, jobs: 63, revenue: 115000 },
    { month: 'Jul', calls: 92, jobs: 68, revenue: 128000 },
    { month: 'Aug', calls: 98, jobs: 74, revenue: 142000 },
    { month: 'Sep', calls: 90, jobs: 72, revenue: 135000 },
    { month: 'Oct', calls: 105, jobs: 82, revenue: 152000 },
    { month: 'Nov', calls: 112, jobs: 88, revenue: 165000 },
    { month: 'Dec', calls: 124, jobs: 98, revenue: 178000 },
  ];

  // Today's appointments data
  const todaysAppointments = [
    { clientName: "Sarah Johnson", time: "09:30 AM", jobType: "Installation", address: "123 Main St", priority: "high" },
    { clientName: "James Wilson", time: "11:00 AM", jobType: "Repair", address: "456 Oak Ave", priority: "medium" },
    { clientName: "Emily Davis", time: "01:15 PM", jobType: "Maintenance", address: "789 Pine Rd", priority: "low" },
    { clientName: "Michael Brown", time: "03:30 PM", jobType: "Inspection", address: "234 Elm St", priority: "medium" },
  ];

  const renderDashboardStats = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        <StatCard
          title="Total Active Clients"
          value="124"
          icon={<UsersIcon className="h-4 w-4" />}
          description="5 new this week"
          trend={{ value: "12% increase", isPositive: true }}
          className="bg-white"
        />
        <StatCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          icon={<TrendingUpIcon className="h-4 w-4" />}
          description="From lead to client"
          trend={{ value: "3.2% increase", isPositive: true }}
          className="bg-white"
        />
        <StatCard
          title="Average Response Time"
          value="3.2h"
          icon={<ClockIcon className="h-4 w-4" />}
          description="For new service requests"
          trend={{ value: "0.5h improvement", isPositive: true }}
          className="bg-white"
        />
        <StatCard
          title="Customer Satisfaction"
          value="96%"
          icon={<ActivityIcon className="h-4 w-4" />}
          description="Based on 482 reviews"
          trend={{ value: "2% increase", isPositive: true }}
          className="bg-white"
        />
      </div>
    );
  };

  const renderStatisticsContent = () => {
    return (
      <div className="space-y-6">
        {renderDashboardStats()}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Annual Revenue vs Target</CardTitle>
              <CardDescription>Revenue performance against monthly targets</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-80">
                <div className="flex flex-col h-full justify-center">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm">Actual Revenue: {formatCurrency(totalRevenue)}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">Target Revenue: {formatCurrency(totalRevenue * 1.2)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-3">
                    {revenueData.map((month) => (
                      <div key={month.name} className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{month.name}</span>
                          <span>{formatCurrency(month.revenue)}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div
                            className="bg-blue-500 h-2.5 rounded-full"
                            style={{ width: `${(month.revenue / (month.target * 1.5)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Job Type Distribution</CardTitle>
              <CardDescription>Service breakdown by category</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center">
              <EnhancedDonutChart
                data={jobTypeData}
                title={`${totalJobs}`}
                subtitle="Total Jobs"
                size={220}
                thickness={30}
              />
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Monthly Job Completion Rate</CardTitle>
            <CardDescription>Tracking job success and efficiency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-12 gap-2 mt-2">
              {performanceData.map((data) => (
                <div key={data.month} className="col-span-1">
                  <div className="flex flex-col items-center">
                    <div className="relative w-full mb-1 h-32">
                      <div 
                        className="absolute bottom-0 w-full bg-blue-500 rounded-t"
                        style={{ height: `${(data.jobs / 50) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{data.month}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-xs text-gray-500">Completed Jobs</span>
              </div>
              <div className="text-sm font-medium">Average: 27.5 jobs/month</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderAnalyticsContent = () => {
    return (
      <div className="space-y-6">
        {renderDashboardStats()}
        
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Performance Metrics</CardTitle>
            <CardDescription>Key service performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-12 gap-2 mt-2">
              {performanceData.map((data) => (
                <div key={data.month} className="col-span-1">
                  <div className="flex flex-col items-center">
                    <div className="relative w-full mb-1 h-32">
                      <div 
                        className="absolute bottom-0 w-full bg-green-400 rounded-t"
                        style={{ height: `${(data.revenue / 10000) * 100}%` }}
                      ></div>
                      <div 
                        className="absolute bottom-0 w-1/2 bg-blue-500 rounded-t"
                        style={{ height: `${(data.calls / 50) * 100}%`, left: '25%' }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{data.month}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                  <span className="text-xs text-gray-500">Revenue</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-xs text-gray-500">Service Calls</span>
                </div>
              </div>
              <div className="text-sm font-medium">Total Revenue: {formatCurrency(totalRevenue)}</div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardMetricCard
            title="Conversion Rate"
            value="84%"
            description="Calls to Jobs Conversion"
            icon={<PieChartIcon size={20} className="text-white" />}
            trend={{ value: "4.2% from last month", isPositive: true }}
            className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white"
            variant="vibrant"
            valueClassName="text-white text-2xl font-bold"
          />
          
          <DashboardMetricCard
            title="Avg. Job Value"
            value={formatCurrency(avgJobValue)}
            description="Per completed job"
            icon={<DollarSignIcon size={20} className="text-white" />}
            trend={{ value: "2.8% from last month", isPositive: true }}
            className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white"
            variant="vibrant"
            valueClassName="text-white text-2xl font-bold"
          />
          
          <DashboardMetricCard
            title="Technician Efficiency"
            value="92%"
            description="On-time completion rate"
            icon={<ClockIcon size={20} className="text-white" />}
            trend={{ value: "1.5% from last month", isPositive: true }}
            className="bg-gradient-to-br from-amber-500 to-amber-600 text-white"
            variant="vibrant"
            valueClassName="text-white text-2xl font-bold"
          />
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'statistics':
        return renderStatisticsContent();
      case 'analytics':
        return renderAnalyticsContent();
      default: // Dashboard tab
        return (
          <>            
            {/* Business Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-md">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-blue-600 font-medium">Total Revenue</p>
                      <p className="text-3xl font-bold text-blue-800 mt-1">{formatCurrency(totalRevenue)}</p>
                      <p className="text-blue-600 text-sm mt-1">
                        {formatCurrency(avgJobValue)} avg per job
                      </p>
                    </div>
                    <div className="p-3 bg-white/60 rounded-full shadow-sm">
                      <DollarSignIcon className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                  <div className="mt-4 h-1.5 bg-blue-200 rounded-full">
                    <div 
                      className="h-1.5 bg-blue-500 rounded-full" 
                      style={{ width: '78%' }}
                    ></div>
                  </div>
                  <p className="text-blue-600 text-xs mt-2">
                    78% of quarterly target
                  </p>
                  {date?.from && (
                    <p className="text-blue-600 text-xs mt-2">
                      Period: {getDateRangeText()}
                    </p>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-md">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-emerald-600 font-medium">Net Profit</p>
                      <p className="text-3xl font-bold text-emerald-800 mt-1">{formatCurrency(companyProfit)}</p>
                      <p className="text-emerald-600 text-sm mt-1">
                        {Math.round((companyProfit / totalRevenue) * 100)}% profit margin
                      </p>
                    </div>
                    <div className="p-3 bg-white/60 rounded-full shadow-sm">
                      <PieChartIcon className="h-6 w-6 text-emerald-500" />
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-1">
                    <div className="p-2 bg-emerald-200/50 rounded text-center text-xs font-medium text-emerald-700">
                      <span className="block text-sm font-semibold">{formatCurrency(totalExpenses * 0.4)}</span>
                      Labor
                    </div>
                    <div className="p-2 bg-emerald-200/50 rounded text-center text-xs font-medium text-emerald-700">
                      <span className="block text-sm font-semibold">{formatCurrency(totalExpenses * 0.3)}</span>
                      Materials
                    </div>
                    <div className="p-2 bg-emerald-200/70 rounded text-center text-xs font-medium text-emerald-700">
                      <span className="block text-sm font-semibold">{formatCurrency(totalExpenses * 0.3)}</span>
                      Operating
                    </div>
                  </div>
                  {date?.from && (
                    <p className="text-emerald-600 text-xs mt-2">
                      Period: {getDateRangeText()}
                    </p>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-md">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-purple-600 font-medium">Total Jobs</p>
                      <p className="text-3xl font-bold text-purple-800 mt-1">{totalJobs}</p>
                      <p className="text-purple-600 text-sm mt-1">
                        {completedJobs} completed, {totalJobs - completedJobs} in progress
                      </p>
                    </div>
                    <div className="p-3 bg-white/60 rounded-full shadow-sm">
                      <ClipboardIcon className="h-6 w-6 text-purple-500" />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <div className="p-2 bg-purple-200/50 rounded flex-1 text-center text-xs font-medium text-purple-700">
                      <span className="block text-sm font-semibold">{Math.round(completedJobs / totalJobs * 100)}%</span>
                      Completion Rate
                    </div>
                    <div className="p-2 bg-purple-200/50 rounded flex-1 text-center text-xs font-medium text-purple-700">
                      <span className="block text-sm font-semibold">{dashboardTaskCounts.inProgress}</span>
                      In Progress
                    </div>
                    <div className="p-2 bg-purple-200/50 rounded flex-1 text-center text-xs font-medium text-purple-700">
                      <span className="block text-sm font-semibold">{dashboardTaskCounts.rescheduled}</span>
                      Rescheduled
                    </div>
                  </div>
                  {date?.from && (
                    <p className="text-purple-600 text-xs mt-2">
                      Period: {getDateRangeText()}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Enhanced Jobs Status Section - Now Full Width with more vibrant colors */}
            <Card className="bg-white border-0 shadow-lg mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Jobs By Status</CardTitle>
                <CardDescription>Overview of service requests and job status</CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="flex-1 mb-4 md:mb-0 flex justify-center">
                    <EnhancedDonutChart 
                      data={jobStatusData}
                      title={`${totalTasks}`}
                      subtitle="Total Jobs"
                      size={320} 
                      thickness={60}
                      gradients={true}
                      animation={true}
                      showLegend={false}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-3">
                      {jobStatusData.map((status, index) => (
                        <div 
                          key={index} 
                          className="flex flex-col p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => openStatusDialog(status.name.toLowerCase(), `${status.name} Jobs`, 
                            status.name === 'Completed' ? jobsByStatus.completed :
                            status.name === 'In Progress' ? jobsByStatus.inProgress :
                            status.name === 'Cancelled' ? jobsByStatus.canceled :
                            jobsByStatus.rescheduled
                          )}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div 
                                className="w-5 h-5 rounded-full mr-2 shadow-sm" 
                                style={{ 
                                  background: `linear-gradient(135deg, ${status.gradientFrom}, ${status.gradientTo})` 
                                }}
                              ></div>
                              <span className="font-medium text-gray-700">{status.name}</span>
                            </div>
                            <span className="text-sm font-bold text-gray-900">{status.value}</span>
                          </div>
                          <div className="w-full h-3 bg-gray-100 rounded-full mt-1 overflow-hidden">
                            <div 
                              className="h-3 rounded-full transition-all duration-1000 ease-out"
                              style={{ 
                                width: `${(status.value / totalTasks) * 100}%`,
                                background: `linear-gradient(90deg, ${status.gradientFrom}, ${status.gradientTo})`,
                                boxShadow: 'inset 0px 0px 3px rgba(255, 255, 255, 0.5)'
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <Badge
                              variant="outline"
                              className="text-xs"
                              style={{ 
                                color: status.color, 
                                borderColor: status.color,
                                backgroundColor: `${status.color}10`
                              }}
                            >
                              {((status.value / totalTasks) * 100).toFixed(0)}%
                            </Badge>
                            <span className="text-xs text-gray-500">
                              View all
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {date?.from && (
                      <div className="text-xs text-center text-gray-500 mt-4 p-2 bg-gray-50 rounded-md border border-gray-100">
                        <CalendarIcon className="h-3 w-3 inline mr-1" />
                        Period: {getDateRangeText()}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-5 text-center">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                    onClick={() => openDetailDialog('tasks', 'All Jobs', detailedTasksData)}
                  >
                    <ClipboardIcon className="h-4 w-4 mr-2" />
                    View Detailed Job Report
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Today's Appointments section */}
            <Card className="bg-white border-0 shadow-md mb-6">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-medium">Today's Appointments</CardTitle>
                    <CardDescription>Scheduled visits and service calls</CardDescription>
                  </div>
                  <Button variant="outline" className="h-8 gap-1">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    <span className="text-xs">View Calendar</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {todaysAppointments.map((apt, index) => (
                    <div key={index} className="flex p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                      <div className={`w-1 self-stretch rounded-full mr-3 ${
                        apt.priority === 'high' ? 'bg-red-500' : 
                        apt.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-gray-900">{apt.clientName}</h4>
                          <span className="text-sm font-medium text-blue-600">{apt.time}</span>
                        </div>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs h-5 bg-blue-100 text-blue-800">
                            {apt.jobType}
                          </Badge>
                          <span className="text-xs text-gray-500">{apt.address}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
              <PerformanceCard 
                leadSources={dashboardLeadSources}
                jobTypePerformance={dashboardJobTypePerformance}
                financialMetrics={dashboardFinancialMetrics}
                formatCurrency={formatCurrency}
                openDetailDialog={openDetailDialog}
                detailedBusinessMetrics={detailedBusinessMetrics}
              />
              
              <TopTechniciansCard 
                topTechnicians={dashboardTopTechnicians}
                formatCurrency={formatCurrency}
                openDetailDialog={openDetailDialog}
                detailedClientsData={detailedClientsData}
              />
            </div>
            
            <ActivitySection 
              activities={dashboardActivities}
              events={dashboardEvents}
            />
          </>
        );
    }
  };

  return (
    <div className="space-y-4 py-4">
      <DashboardHeader activeTab={activeTab} onTabChange={handleTabChange} />
      
      {/* Enhanced Date Range Filter - Moved to the top and styled better */}
      <div className="mb-6">
        <EnhancedDateRangeFilter date={date} setDate={setDate} />
      </div>
      
      {renderContent()}
      
      <DashboardDetailDialog
        open={activeDialog.open}
        onOpenChange={(open) => setActiveDialog({...activeDialog, open})}
        title={activeDialog.title}
        type={activeDialog.type}
        data={activeDialog.data}
      />

      <JobStatusDialog
        open={statusDialog.open}
        onOpenChange={(open) => setStatusDialog({...statusDialog, open})}
        title={statusDialog.title}
        status={statusDialog.status}
        data={statusDialog.data}
      />
    </div>
  );
};

export default Dashboard;
