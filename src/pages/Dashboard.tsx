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
  Phone as PhoneIcon,
  User as UserIcon,
  MessageCircle as MessageCircleIcon,
  Check as CheckIcon,
  XCircle as CircleXIcon,
  BadgeDollarSign,
  ChartBar,
  PhoneCall,
} from "lucide-react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MetricsOverview from "@/components/dashboard/MetricsOverview";
import PerformanceCard from "@/components/dashboard/PerformanceCard";
import TopTechniciansCard from "@/components/dashboard/TopTechniciansCard";
import ActivitySection from "@/components/dashboard/ActivitySection";
import DashboardDetailDialog from "@/components/DashboardDetailDialog";
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
import ProjectsDashboardSection from "@/components/dashboard/ProjectsDashboardSection";

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

  const { dateFilter, jobs, currentIndustry } = useGlobalState();
  
  // Filter jobs based on date range
  const filteredJobs = jobs.filter(job => {
    if (!dateFilter?.from) return true;
    
    // Handle both string dates and Date objects
    const jobDate = job.scheduledDate ? 
      (job.scheduledDate instanceof Date ? job.scheduledDate : new Date(job.scheduledDate)) : 
      job.date instanceof Date ? job.date : new Date(job.date);
    
    if (dateFilter.to) {
      return jobDate >= dateFilter.from && jobDate <= dateFilter.to;
    }
    
    // If only from date is specified, filter for that specific day
    return jobDate.toDateString() === dateFilter.from.toDateString();
  });
  
  // Calculate metrics based on filtered jobs
  const completedJobs = filteredJobs.filter(job => job.status === "completed").length;
  const rescheduledJobs = filteredJobs.filter(job => job.status === "rescheduled").length;
  const inProgressJobs = filteredJobs.filter(job => job.status === "in_progress").length;
  const canceledJobs = filteredJobs.filter(job => job.status === "cancelled").length;
  
  const totalJobs = completedJobs + rescheduledJobs + inProgressJobs + canceledJobs;
  
  // Calculate revenue from filtered jobs
  const jobRevenue = filteredJobs
    .filter(job => job.status === "completed")
    .reduce((sum, job) => sum + (job.actualAmount || job.amount || 0), 0);
  
  // Use dynamic revenue or fall back to sample data when no filtered jobs available
  const totalRevenue = jobRevenue > 0 ? jobRevenue : dashboardFinancialMetrics.totalRevenue;
  
  // Calculate expenses as 40% of revenue for completed jobs
  const totalExpenses = totalRevenue * 0.4;
  
  // Calculate profit as revenue minus expenses
  const companyProfit = totalRevenue - totalExpenses;
  
  // Calculate average job value
  const avgJobValue = completedJobs > 0 
    ? jobRevenue / completedJobs 
    : dashboardFinancialMetrics.avgJobValue;
  
  // Use other metrics from sample data
  const monthlyGrowth = dashboardFinancialMetrics.monthlyGrowth;
  const conversionRate = dashboardFinancialMetrics.conversionRate;

  // Generate call data based on filtered jobs (estimate more calls than jobs)
  const callsData = {
    total: Math.max(154, Math.round(totalJobs * 1.6)),
    converted: Math.max(98, Math.round(completedJobs * 1.3)),
    scheduled: Math.max(37, Math.round(totalJobs * 0.4)),
    missed: Math.max(19, Math.round(totalJobs * 0.2)),
    conversionRate: totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 63
  };

  // Job status data for visualization
  const jobStatusData = [
    { name: 'Completed', value: completedJobs || dashboardTaskCounts.completed, color: '#22c55e', gradientFrom: '#4ade80', gradientTo: '#16a34a' },
    { name: 'In Progress', value: inProgressJobs || dashboardTaskCounts.inProgress, color: '#3b82f6', gradientFrom: '#60a5fa', gradientTo: '#2563eb' },
    { name: 'Cancelled', value: canceledJobs || dashboardTaskCounts.canceled, color: '#ef4444', gradientFrom: '#f87171', gradientTo: '#dc2626' },
    { name: 'Rescheduled', value: rescheduledJobs || dashboardTaskCounts.rescheduled, color: '#ec4899', gradientFrom: '#f472b6', gradientTo: '#db2777' },
  ];

  // Sample statistics data for charts
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

  // Format date range for display in metrics
  const getDateRangeText = () => {
    if (!dateFilter?.from) return "All time";
    
    if (dateFilter.to) {
      if (dateFilter.from.toDateString() === dateFilter.to.toDateString()) {
        return format(dateFilter.from, "MMM d, yyyy");
      }
      return `${format(dateFilter.from, "MMM d")} - ${format(dateFilter.to, "MMM d, yyyy")}`;
    }
    
    return format(dateFilter.from, "MMM d, yyyy");
  };

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
            {/* Professional Metric Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              {/* Revenue Card */}
              <Card className="bg-white border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 rounded-full">
                          <BadgeDollarSign className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-600">Revenue</h3>
                      </div>
                      <p className="text-2xl font-bold mt-2 text-gray-900">{formatCurrency(totalRevenue)}</p>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-full mb-1">
                        {getDateRangeText()}
                      </span>
                      <span className="text-xs font-medium text-blue-600">
                        78% of goal
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 flex flex-col gap-1 mt-2">
                    <div className="flex justify-between items-center">
                      <span>Average per job</span>
                      <span className="font-medium text-gray-700">{formatCurrency(avgJobValue)}</span>
                    </div>
                    <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Net Profit Card */}
              <Card className="bg-white border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-green-100 rounded-full">
                          <ChartBar className="h-5 w-5 text-green-600" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-600">Net Profit</h3>
                      </div>
                      <p className="text-2xl font-bold mt-2 text-gray-900">{formatCurrency(companyProfit)}</p>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-medium px-2 py-1 bg-green-50 text-green-600 rounded-full mb-1">
                        {getDateRangeText()}
                      </span>
                      <span className="text-xs font-medium text-green-600">
                        {Math.round((companyProfit / totalRevenue) * 100)}% margin
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 flex flex-col gap-1 mt-2">
                    <div className="flex justify-between items-center">
                      <span>Labor costs</span>
                      <span className="font-medium text-gray-700">{formatCurrency(totalExpenses * 0.6)}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-0.5">
                      <div className="bg-green-500 h-1 rounded-l"></div>
                      <div className="bg-green-300 h-1"></div>
                      <div className="bg-green-100 h-1 rounded-r"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Total Calls Card */}
              <Card className="bg-white border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-purple-100 rounded-full">
                          <PhoneCall className="h-5 w-5 text-purple-600" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-600">Total Calls</h3>
                      </div>
                      <p className="text-2xl font-bold mt-2 text-gray-900">{callsData.total}</p>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-medium px-2 py-1 bg-purple-50 text-purple-600 rounded-full mb-1">
                        {getDateRangeText()}
                      </span>
                      <span className="text-xs font-medium text-purple-600">
                        {callsData.conversionRate}% conversion
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 flex flex-col gap-1 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-1"></span>
                        <span>Converted</span>
                      </span>
                      <span className="font-medium text-gray-700">{callsData.converted}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                        <span>Missed</span>
                      </span>
                      <span className="font-medium text-gray-700">{callsData.missed}</span>
                    </div>
                    <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: `${callsData.conversionRate}%` }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Job Status Overview */}
            <Card className="bg-white shadow-sm mb-6">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg font-semibold">Job Status Overview</CardTitle>
                    <CardDescription>
                      Job distribution for {getDateRangeText()}
                    </CardDescription>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-7"
                    onClick={() => openStatusDialog("all", "All Jobs", jobsByStatus)}
                  >
                    View All Jobs
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row items-center justify-around py-6">
                <div className="w-48 h-48 mb-6 md:mb-0">
                  <EnhancedDonutChart
                    data={jobStatusData}
                    title={`${totalJobs}`}
                    subtitle="Total Jobs"
                    size={180}
                    thickness={30}
                  />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-4">
                  <div 
                    className="flex flex-col cursor-pointer hover:bg-green-50 p-3 rounded-lg transition-colors"
                    onClick={() => openStatusDialog("completed", "Completed Jobs", jobsByStatus.filter(j => j.status === "completed"))}
                  >
                    <div className="flex items-center mb-1">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                    <div className="text-xl font-bold">{completedJobs}</div>
                    <div className="text-xs text-gray-500">
                      {completedJobs > 0 ? `${formatCurrency(jobRevenue)}` : 'No revenue yet'}
                    </div>
                  </div>
                  
                  <div 
                    className="flex flex-col cursor-pointer hover:bg-blue-50 p-3 rounded-lg transition-colors"
                    onClick={() => openStatusDialog("in_progress", "In Progress Jobs", jobsByStatus.filter(j => j.status === "in_progress"))}
                  >
                    <div className="flex items-center mb-1">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm font-medium">In Progress</span>
                    </div>
                    <div className="text-xl font-bold">{inProgressJobs}</div>
                    <div className="text-xs text-gray-500">
                      {Math.round(inProgressJobs / (totalJobs || 1) * 100)}% of total
                    </div>
                  </div>
                  
                  <div 
                    className="flex flex-col cursor-pointer hover:bg-red-50 p-3 rounded-lg transition-colors"
                    onClick={() => openStatusDialog("cancelled", "Cancelled Jobs", jobsByStatus.filter(j => j.status === "cancelled"))}
                  >
                    <div className="flex items-center mb-1">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-sm font-medium">Cancelled</span>
                    </div>
                    <div className="text-xl font-bold">{canceledJobs}</div>
                    <div className="text-xs text-gray-500">
                      {Math.round(canceledJobs / (totalJobs || 1) * 100)}% of total
                    </div>
                  </div>
                  
                  <div 
                    className="flex flex-col cursor-pointer hover:bg-pink-50 p-3 rounded-lg transition-colors"
                    onClick={() => openStatusDialog("rescheduled", "Rescheduled Jobs", jobsByStatus.filter(j => j.status === "rescheduled"))}
                  >
                    <div className="flex items-center mb-1">
                      <div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div>
                      <span className="text-sm font-medium">Rescheduled</span>
                    </div>
                    <div className="text-xl font-bold">{rescheduledJobs}</div>
                    <div className="text-xs text-gray-500">
                      {Math.round(rescheduledJobs / (totalJobs || 1) * 100)}% of total
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <ProjectsDashboardSection />
            
            <JobStatusDialog 
              open={statusDialog.open}
              onOpenChange={(open) => setStatusDialog({...statusDialog, open})}
              status={statusDialog.status}
              title={statusDialog.title}
              data={statusDialog.data}
            />
            
            <DashboardDetailDialog
              open={activeDialog.open}
              onOpenChange={(open) => setActiveDialog({...activeDialog, open})}
              title={activeDialog.title}
              type={activeDialog.type}
              data={activeDialog.data}
            />
          </>
        );
    }
  };

  return (
    <div className="space-y-3 py-3">
      <DashboardHeader 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
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
