
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
import DashboardCalendar from "@/components/dashboard/DashboardCalendar";
import IndustrySelector from "@/components/IndustrySelector";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";
import DashboardMetricCard from "@/components/DashboardMetricCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EnhancedDonutChart } from "@/components/EnhancedDonutChart";
import StatCard from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";

import {
  dashboardTaskCounts,
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

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const { jobs, currentIndustry } = useGlobalState();

  const completedJobs = jobs.filter(job => 
    job.status === "completed" && 
    (!date?.from || (job.scheduledDate && new Date(job.scheduledDate) >= date.from)) && 
    (!date?.to || (job.scheduledDate && new Date(job.scheduledDate) <= date.to))
  );

  const totalRevenue = completedJobs.reduce((sum, job) => sum + (job.actualAmount || job.amount || 0), 0);
  const totalExpenses = totalRevenue * 0.4;
  const companyProfit = totalRevenue - totalExpenses;

  const avgJobValue = completedJobs.length > 0 
    ? totalRevenue / completedJobs.length 
    : 0;

  const monthlyGrowth = 5.2;
  const conversionRate = 75.5;

  const dashboardFinancialMetrics = {
    totalRevenue: totalRevenue,
    totalExpenses: totalExpenses,
    companysCut: companyProfit,
    profitMargin: totalRevenue > 0 ? (companyProfit / totalRevenue) * 100 : 0,
    avgJobValue: avgJobValue,
    monthlyGrowth: monthlyGrowth,
    conversionRate: conversionRate
  };

  const totalTasks = Object.values(dashboardTaskCounts).reduce((sum, count) => sum + count, 0);

  const openDetailDialog = (type: 'tasks' | 'leads' | 'clients' | 'revenue' | 'metrics', title: string, data: any[]) => {
    setActiveDialog({
      open: true,
      type,
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
    { name: 'Jan', revenue: 4000, target: 2400 },
    { name: 'Feb', revenue: 3000, target: 2800 },
    { name: 'Mar', revenue: 2000, target: 3200 },
    { name: 'Apr', revenue: 2780, target: 3500 },
    { name: 'May', revenue: 1890, target: 3800 },
    { name: 'Jun', revenue: 2390, target: 4000 },
    { name: 'Jul', revenue: 3490, target: 4200 },
    { name: 'Aug', revenue: 4200, target: 4400 },
    { name: 'Sep', revenue: 4800, target: 4600 },
    { name: 'Oct', revenue: 5200, target: 4800 },
    { name: 'Nov', revenue: 5600, target: 5000 },
    { name: 'Dec', revenue: 6100, target: 5200 },
  ];

  const jobTypeData = [
    { name: 'Repair', value: 42, color: '#4f46e5' },
    { name: 'Installation', value: 28, color: '#0ea5e9' },
    { name: 'Maintenance', value: 18, color: '#10b981' },
    { name: 'Other', value: 12, color: '#f59e0b' },
  ];

  const COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b'];

  // Sample analytics data
  const performanceData = [
    { month: 'Jan', calls: 24, jobs: 18, revenue: 4200 },
    { month: 'Feb', calls: 28, jobs: 22, revenue: 5100 },
    { month: 'Mar', calls: 32, jobs: 24, revenue: 5800 },
    { month: 'Apr', calls: 35, jobs: 28, revenue: 6200 },
    { month: 'May', calls: 30, jobs: 25, revenue: 5900 },
    { name: 'Jun', calls: 27, jobs: 23, revenue: 5400 },
    { name: 'Jul', calls: 29, jobs: 26, revenue: 6100 },
    { name: 'Aug', calls: 33, jobs: 28, revenue: 6500 },
    { name: 'Sep', calls: 37, jobs: 32, revenue: 7200 },
    { name: 'Oct', calls: 42, jobs: 34, revenue: 7800 },
    { name: 'Nov', calls: 45, jobs: 36, revenue: 8200 },
    { name: 'Dec', calls: 48, jobs: 40, revenue: 9100 },
  ];

  const totalJobs = completedJobs.length + jobs.filter(job => job.status === "in_progress" || job.status === "scheduled").length;

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
          value="75.5%"
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
                    {revenueData.map((month, index) => (
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
                <div key={data.month || data.name} className="col-span-1">
                  <div className="flex flex-col items-center">
                    <div className="relative w-full mb-1 h-32">
                      <div 
                        className="absolute bottom-0 w-full bg-blue-500 rounded-t"
                        style={{ height: `${(data.jobs / 50) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{data.month || data.name}</span>
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
                <div key={data.month || data.name} className="col-span-1">
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
                    <span className="text-xs text-gray-500">{data.month || data.name}</span>
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
                        {formatCurrency(dashboardFinancialMetrics.avgJobValue)} avg per job
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
                        {Math.round(dashboardFinancialMetrics.profitMargin)}% profit margin
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
                        {completedJobs.length} completed, {totalJobs - completedJobs.length} in progress
                      </p>
                    </div>
                    <div className="p-3 bg-white/60 rounded-full shadow-sm">
                      <ClipboardIcon className="h-6 w-6 text-purple-500" />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <div className="p-2 bg-purple-200/50 rounded flex-1 text-center text-xs font-medium text-purple-700">
                      <span className="block text-sm font-semibold">{Math.round(completedJobs.length / totalJobs * 100)}%</span>
                      Completion Rate
                    </div>
                    <div className="p-2 bg-purple-200/50 rounded flex-1 text-center text-xs font-medium text-purple-700">
                      <span className="block text-sm font-semibold">{jobs.filter(job => job.status === "scheduled").length}</span>
                      Scheduled
                    </div>
                    <div className="p-2 bg-purple-200/50 rounded flex-1 text-center text-xs font-medium text-purple-700">
                      <span className="block text-sm font-semibold">{jobs.filter(job => job.status === "in_progress").length}</span>
                      In Progress
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
            
            {/* Jobs Status Summary and Calendar View */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              <Card className="md:col-span-2 bg-white border-0 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Jobs By Status</CardTitle>
                  <CardDescription>Overview of service requests and job status</CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="flex flex-col p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-sm">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-md flex items-center justify-center bg-blue-500 mr-3">
                          <ClipboardIcon className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium text-blue-700">New Jobs</span>
                      </div>
                      <span className="text-2xl font-bold text-blue-900">{dashboardTaskCounts.joby}</span>
                      <span className="text-xs text-blue-600 mt-1">12% of total requests</span>
                      {date?.from && (
                        <span className="text-xs text-blue-600 mt-1">Period: {getDateRangeText()}</span>
                      )}
                    </div>
                    
                    <div className="flex flex-col p-4 rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 shadow-sm">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-md flex items-center justify-center bg-indigo-500 mr-3">
                          <ClockIcon className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium text-indigo-700">In Progress</span>
                      </div>
                      <span className="text-2xl font-bold text-indigo-900">{dashboardTaskCounts.inProgress}</span>
                      <span className="text-xs text-indigo-600 mt-1">28% of total requests</span>
                      {date?.from && (
                        <span className="text-xs text-indigo-600 mt-1">Period: {getDateRangeText()}</span>
                      )}
                    </div>
                    
                    <div className="flex flex-col p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200 shadow-sm">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-md flex items-center justify-center bg-green-500 mr-3">
                          <CheckCircleIcon className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium text-green-700">Completed</span>
                      </div>
                      <span className="text-2xl font-bold text-green-900">{dashboardTaskCounts.completed}</span>
                      <span className="text-xs text-green-600 mt-1">48% of total requests</span>
                      {date?.from && (
                        <span className="text-xs text-green-600 mt-1">Period: {getDateRangeText()}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col p-3 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-amber-700 text-sm">Submitted</span>
                        <span className="text-sm font-bold text-amber-900">{dashboardTaskCounts.submitted}</span>
                      </div>
                      <div className="w-full h-1.5 bg-amber-200 rounded-full mt-1">
                        <div className="h-1.5 bg-amber-500 rounded-full" style={{ width: `${(dashboardTaskCounts.submitted / totalTasks) * 100}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col p-3 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-orange-700 text-sm">Draft</span>
                        <span className="text-sm font-bold text-orange-900">{dashboardTaskCounts.draft}</span>
                      </div>
                      <div className="w-full h-1.5 bg-orange-200 rounded-full mt-1">
                        <div className="h-1.5 bg-orange-500 rounded-full" style={{ width: `${(dashboardTaskCounts.draft / totalTasks) * 100}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col p-3 rounded-lg bg-gradient-to-br from-red-50 to-red-100 border border-red-200 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-red-700 text-sm">Canceled</span>
                        <span className="text-sm font-bold text-red-900">{dashboardTaskCounts.canceled}</span>
                      </div>
                      <div className="w-full h-1.5 bg-red-200 rounded-full mt-1">
                        <div className="h-1.5 bg-red-500 rounded-full" style={{ width: `${(dashboardTaskCounts.canceled / totalTasks) * 100}%` }}></div>
                      </div>
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
              
              <Card className="bg-white border-0 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Job Type Distribution</CardTitle>
                  <CardDescription>Service breakdown by category</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center pb-6">
                  <EnhancedDonutChart
                    data={jobTypeData}
                    title={`${totalJobs}`}
                    subtitle="Total Jobs"
                    size={220}
                    thickness={30}
                    gradients={true}
                    animation={true}
                  />
                  {date?.from && (
                    <div className="text-xs text-center text-gray-500 mt-2">
                      Period: {getDateRangeText()}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
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
    <div className="space-y-5 py-4">
      <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Date filter section at the top */}
      <div className="flex justify-end mb-4">
        <DashboardCalendar date={date} setDate={setDate} />
      </div>
      
      {renderContent()}
      
      <DashboardDetailDialog
        open={activeDialog.open}
        onOpenChange={(open) => setActiveDialog({...activeDialog, open})}
        title={activeDialog.title}
        type={activeDialog.type}
        data={activeDialog.data}
      />
    </div>
  );
};

export default Dashboard;
