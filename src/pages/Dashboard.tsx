import { useState, useEffect } from "react";
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
  }>({
    open: false,
    status: '',
  });

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const { dateFilter, getFilteredJobs, currentIndustry } = useGlobalState();
  const filteredJobs = getFilteredJobs();
  
  // Calculate metrics based on filtered jobs
  const completedJobs = filteredJobs.filter(job => job.status === "completed").length;
  const rescheduledJobs = filteredJobs.filter(job => job.status === "rescheduled").length;
  const inProgressJobs = filteredJobs.filter(job => job.status === "in_progress").length;
  const canceledJobs = filteredJobs.filter(job => job.status === "canceled").length;
  
  const totalJobs = completedJobs + rescheduledJobs + inProgressJobs + canceledJobs;
  
  // Calculate revenue from jobs
  const jobRevenue = filteredJobs.reduce((sum, job) => {
    if (job.status === "completed" && job.actualAmount) {
      return sum + job.actualAmount;
    }
    return sum + (job.amount || 0);
  }, 0);
  
  const totalRevenue = dashboardFinancialMetrics.totalRevenue;

  const callsData = [
    { name: 'Jan', calls: 2400 },
    { name: 'Feb', calls: 1398 },
    { name: 'Mar', calls: 9800 },
    { name: 'Apr', calls: 3908 },
    { name: 'May', calls: 4800 },
    { name: 'Jun', calls: 3800 },
    { name: 'Jul', calls: 4300 },
    { name: 'Aug', calls: 2400 },
    { name: 'Sep', calls: 1398 },
    { name: 'Oct', calls: 9800 },
    { name: 'Nov', calls: 3908 },
    { name: 'Dec', calls: 4800 },
  ];

  // Create job status data for the circular visualization
  const jobStatusData = [
    { name: 'Completed', value: completedJobs || dashboardTaskCounts.completed, color: '#22c55e', gradientFrom: '#4ade80', gradientTo: '#16a34a' },
    { name: 'In Progress', value: inProgressJobs || dashboardTaskCounts.inProgress, color: '#3b82f6', gradientFrom: '#60a5fa', gradientTo: '#2563eb' },
    { name: 'Cancelled', value: canceledJobs || dashboardTaskCounts.canceled, color: '#ef4444', gradientFrom: '#f87171', gradientTo: '#dc2626' },
    { name: 'Rescheduled', value: rescheduledJobs || dashboardTaskCounts.rescheduled, color: '#ec4899', gradientFrom: '#f472b6', gradientTo: '#db2777' },
  ];

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
    { name: 'Repair', value: 42 },
    { name: 'Installation', value: 28 },
    { name: 'Maintenance', value: 18 },
    { name: 'Other', value: 12 },
  ];

  const openDetailDialog = (type: 'tasks' | 'leads' | 'clients' | 'revenue' | 'metrics', title: string, data: any[]) => {
    setActiveDialog({
      open: true,
      type,
      title,
      data
    });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleStatusClick = (status: string) => {
    setStatusDialog({ open: true, status });
  };

  const closeStatusDialog = () => {
    setStatusDialog({ open: false, status: '' });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'statistics':
        return (
          <div>
            <h2>Statistics Content</h2>
            {/* Add your statistics content here */}
          </div>
        );
      case 'analytics':
        return (
          <div>
            <h2>Analytics Content</h2>
            {/* Add your analytics content here */}
          </div>
        );
      default:
        return (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Job Status</CardTitle>
                  <BarChartIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <EnhancedDonutChart data={jobStatusData} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {jobStatusData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between p-2 rounded-md border border-gray-200">
                        <div className="flex items-center">
                          <div className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Calls</CardTitle>
                  <PhoneCall className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StatCard
                      title="Total Calls"
                      value="4,524"
                      icon={<PhoneIcon className="h-4 w-4" />}
                      description="Total number of calls received"
                      trend={{ value: "+12%", isPositive: true }}
                    />
                    <StatCard
                      title="Avg. Call Duration"
                      value="5m 32s"
                      icon={<ClockIcon className="h-4 w-4" />}
                      description="Average duration of calls"
                      trend={{ value: "-3%", isPositive: false }}
                    />
                    <StatCard
                      title="Calls Answered"
                      value="3,981"
                      icon={<CheckIcon className="h-4 w-4" />}
                      description="Number of calls answered"
                      trend={{ value: "+8%", isPositive: true }}
                    />
                    <StatCard
                      title="Calls Missed"
                      value="543"
                      icon={<CircleXIcon className="h-4 w-4" />}
                      description="Number of calls missed"
                      trend={{ value: "-5%", isPositive: false }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <ProjectsDashboardSection />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StatCard
                      title="Total Revenue"
                      value={formatCurrency(totalRevenue)}
                      icon={<DollarSignIcon className="h-4 w-4" />}
                      description="Total revenue generated"
                      trend={{ value: "+15%", isPositive: true }}
                    />
                    <StatCard
                      title="Job Revenue"
                      value={formatCurrency(jobRevenue)}
                      icon={<ClipboardIcon className="h-4 w-4" />}
                      description="Revenue from jobs"
                      trend={{ value: "+10%", isPositive: true }}
                    />
                    <StatCard
                      title="Avg. Job Value"
                      value={formatCurrency(jobRevenue / totalJobs)}
                      icon={<CalculatorIcon className="h-4 w-4" />}
                      description="Average value per job"
                      trend={{ value: "+5%", isPositive: true }}
                    />
                    <StatCard
                      title="Profit Margin"
                      value="65%"
                      icon={<TrendingUpIcon className="h-4 w-4" />}
                      description="Profit margin percentage"
                      trend={{ value: "+2%", isPositive: true }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Leads</CardTitle>
                  <UsersIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StatCard
                      title="Total Leads"
                      value="1,245"
                      icon={<UserIcon className="h-4 w-4" />}
                      description="Total number of leads"
                      trend={{ value: "+8%", isPositive: true }}
                    />
                    <StatCard
                      title="Qualified Leads"
                      value="872"
                      icon={<CheckIcon className="h-4 w-4" />}
                      description="Number of qualified leads"
                      trend={{ value: "+10%", isPositive: true }}
                    />
                    <StatCard
                      title="Conversion Rate"
                      value="70%"
                      icon={<TrendingUpIcon className="h-4 w-4" />}
                      description="Lead conversion rate"
                      trend={{ value: "+3%", isPositive: true }}
                    />
                    <StatCard
                      title="Avg. Lead Value"
                      value={formatCurrency(jobRevenue / 872)}
                      icon={<DollarSignIcon className="h-4 w-4" />}
                      description="Average value per lead"
                      trend={{ value: "+5%", isPositive: true }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Activity</CardTitle>
                  <ActivityIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StatCard
                      title="Total Activities"
                      value="3,456"
                      icon={<ActivityIcon className="h-4 w-4" />}
                      description="Total number of activities"
                      trend={{ value: "+12%", isPositive: true }}
                    />
                    <StatCard
                      title="New Activities"
                      value="567"
                      icon={<CalendarIcon className="h-4 w-4" />}
                      description="Number of new activities"
                      trend={{ value: "+5%", isPositive: true }}
                    />
                    <StatCard
                      title="Completed Activities"
                      value="2,889"
                      icon={<CheckIcon className="h-4 w-4" />}
                      description="Number of completed activities"
                      trend={{ value: "+15%", isPositive: true }}
                    />
                    <StatCard
                      title="Pending Activities"
                      value="567"
                      icon={<ClockIcon className="h-4 w-4" />}
                      description="Number of pending activities"
                      trend={{ value: "-3%", isPositive: false }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        );
    }
  };

  return (
    <div className="space-y-3 py-3">
      <DashboardHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {renderContent()}

      <DashboardDetailDialog
        open={activeDialog.open}
        onOpenChange={(open) => setActiveDialog({ ...activeDialog, open })}
        title={activeDialog.title}
        type={activeDialog.type}
        data={activeDialog.data}
      />
    </div>
  );
};

export default Dashboard;
