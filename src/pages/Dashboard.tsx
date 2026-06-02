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
  TrendingDown,
} from "lucide-react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatisticsTab from "@/components/dashboard/StatisticsTab";
import AnalyticsTab from "@/components/dashboard/AnalyticsTab";
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
import SearchBar from "@/components/finance/filters/SearchBar";

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
  const [searchTerm, setSearchTerm] = useState<string>("");
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

  const { jobs, currentIndustry, dateFilter } = useGlobalState();

  const financialDateLabel = (() => {
    if (!dateFilter?.from) return format(new Date(), "MMM d, yyyy");
    if (!dateFilter.to || dateFilter.from.toDateString() === dateFilter.to.toDateString()) {
      return format(dateFilter.from, "MMM d, yyyy");
    }
    return `${format(dateFilter.from, "MMM d")} - ${format(dateFilter.to, "MMM d, yyyy")}`;
  })();

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

  // Sample data for call tracking section
  const callsData = {
    total: 154,
    converted: 98,
    scheduled: 37,
    missed: 19,
    conversionRate: 63
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // In a real app, this would filter data based on search term
    if (value.length > 0) {
      toast({
        title: "Search initiated",
        description: `Searching for: ${value}`,
        duration: 3000
      });
    }
  };

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
        return <div className="animate-in fade-in-50 duration-200"><StatisticsTab /></div>;
      case 'analytics':
        return <div className="animate-in fade-in-50 duration-200"><AnalyticsTab /></div>;
      default: // Dashboard tab
        return (
          <>            
            {/* Search Bar */}
            <div className="mb-2">
              <SearchBar 
                searchTerm={searchTerm} 
                onSearchChange={handleSearchChange} 
                showIcons={true}
                placeholder="Search jobs, clients, technicians..."
                className="bg-white shadow-sm border border-gray-100 rounded-lg"
              />
            </div>
            

            {/* Compact Financial Strip */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3">
              {/* Revenue */}
              <Card className="bg-white border border-border shadow-sm rounded-xl hover:shadow-md transition-shadow">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-1.5 bg-blue-50 rounded-lg shrink-0">
                        <BadgeDollarSign className="h-4 w-4 text-blue-600" />
                      </div>
                      <h3 className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">Revenue</h3>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{financialDateLabel}</span>
                  </div>
                  <p className="text-base sm:text-xl font-semibold tabular-nums text-foreground truncate">{formatCurrency(totalRevenue)}</p>
                  <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '78%' }} />
                  </div>
                  <p className="hidden sm:block text-[11px] text-muted-foreground mt-1.5">78% of goal</p>
                </CardContent>
              </Card>

              {/* Net Profit */}
              <Card className="bg-white border border-border shadow-sm rounded-xl hover:shadow-md transition-shadow">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-1.5 bg-green-50 rounded-lg shrink-0">
                        <ChartBar className="h-4 w-4 text-green-600" />
                      </div>
                      <h3 className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">Profit</h3>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{financialDateLabel}</span>
                  </div>
                  <p className="text-base sm:text-xl font-semibold tabular-nums text-foreground truncate">{formatCurrency(companyProfit)}</p>
                  <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full rounded-full" style={{ width: `${Math.round((companyProfit / totalRevenue) * 100)}%` }} />
                  </div>
                  <p className="hidden sm:block text-[11px] text-muted-foreground mt-1.5">{Math.round((companyProfit / totalRevenue) * 100)}% margin</p>
                </CardContent>
              </Card>

              {/* Expenses */}
              <Card className="bg-white border border-border shadow-sm rounded-xl hover:shadow-md transition-shadow">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-1.5 bg-red-50 rounded-lg shrink-0">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      </div>
                      <h3 className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">Expenses</h3>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{financialDateLabel}</span>
                  </div>
                  <p className="text-base sm:text-xl font-semibold tabular-nums text-red-600 truncate">-{formatCurrency(totalExpenses)}</p>
                  <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="bg-red-400 h-full rounded-full" style={{ width: '40%' }} />
                  </div>
                  <p className="hidden sm:block text-[11px] text-muted-foreground mt-1.5">40% of revenue</p>
                </CardContent>
              </Card>
            </div>
            
            
            {/* Side-by-side Jobs + Projects donuts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-white border border-border shadow-sm rounded-xl h-full">
                <CardHeader className="pb-2 pt-4 px-4 sm:px-5">
                  <CardTitle className="text-base font-semibold">Jobs By Status</CardTitle>
                  <CardDescription className="text-xs">Tap a slice to view jobs</CardDescription>
                </CardHeader>
                <CardContent className="pb-6 pt-2 px-4 sm:px-5">
                  <div className="flex flex-col items-center">
                    <EnhancedDonutChart 
                      data={jobStatusData}
                      title={`${totalTasks}`}
                      subtitle="Total Jobs"
                      size={220} 
                      thickness={44}
                      gradients={true}
                      animation={true}
                      showLegend={false}
                      onCenterClick={() => openStatusDialog('all', 'All Jobs', [
                        ...jobsByStatus.completed,
                        ...jobsByStatus.inProgress,
                        ...jobsByStatus.canceled,
                        ...jobsByStatus.rescheduled,
                      ])}
                      onSegmentClick={(seg) => openStatusDialog(
                        seg.name.toLowerCase(),
                        `${seg.name} Jobs`,
                        seg.name === 'Completed' ? jobsByStatus.completed :
                        seg.name === 'In Progress' ? jobsByStatus.inProgress :
                        seg.name === 'Cancelled' ? jobsByStatus.canceled :
                        jobsByStatus.rescheduled
                      )}
                    />
                    <div className="mt-5 flex flex-wrap justify-center gap-2">
                      {jobStatusData.map((status) => (
                        <button
                          key={status.name}
                          type="button"
                          onClick={() => openStatusDialog(
                            status.name.toLowerCase(),
                            `${status.name} Jobs`,
                            status.name === 'Completed' ? jobsByStatus.completed :
                            status.name === 'In Progress' ? jobsByStatus.inProgress :
                            status.name === 'Cancelled' ? jobsByStatus.canceled :
                            jobsByStatus.rescheduled
                          )}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-white hover:bg-gray-50 text-xs transition-colors"
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ background: `linear-gradient(135deg, ${status.gradientFrom}, ${status.gradientTo})` }}
                          />
                          <span className="font-medium text-foreground">{status.name}</span>
                          <span className="text-muted-foreground tabular-nums">{status.value}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <ProjectsDashboardSection />
            </div>
            
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
    </div>
  );
};

export default Dashboard;
