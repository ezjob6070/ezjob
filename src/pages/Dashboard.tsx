
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
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
} from "lucide-react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MetricsOverview from "@/components/dashboard/MetricsOverview";
import TicketsStatusCard from "@/components/dashboard/TicketsStatusCard";
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
import { DonutChart } from "@/components/DonutChart";
import StatCard from "@/components/StatCard";

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
    { month: 'Jun', calls: 27, jobs: 23, revenue: 5400 },
    { month: 'Jul', calls: 29, jobs: 26, revenue: 6100 },
    { month: 'Aug', calls: 33, jobs: 28, revenue: 6500 },
    { month: 'Sep', calls: 37, jobs: 32, revenue: 7200 },
    { month: 'Oct', calls: 42, jobs: 34, revenue: 7800 },
    { month: 'Nov', calls: 45, jobs: 36, revenue: 8200 },
    { month: 'Dec', calls: 48, jobs: 40, revenue: 9100 },
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
              <DonutChart
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

  const totalJobs = completedJobs.length + jobs.filter(job => job.status === "in_progress" || job.status === "scheduled").length;

  const renderContent = () => {
    switch (activeTab) {
      case 'statistics':
        return renderStatisticsContent();
      case 'analytics':
        return renderAnalyticsContent();
      default: // Dashboard tab
        return (
          <>
            {renderDashboardStats()}
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 mb-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white col-span-1">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-blue-100">Total Jobs</p>
                      <p className="text-3xl font-bold mt-1">{totalJobs}</p>
                      <p className="text-blue-100 text-sm mt-1">
                        {completedJobs.length} completed, {totalJobs - completedJobs.length} in progress
                      </p>
                    </div>
                    <BarChartIcon className="h-8 w-8 text-blue-100 opacity-80" />
                  </div>
                  <div className="mt-4 bg-white/20 h-1.5 rounded-full">
                    <div 
                      className="h-1.5 bg-white rounded-full" 
                      style={{ width: `${(completedJobs.length / totalJobs) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-blue-100 text-xs mt-2">
                    {Math.round((completedJobs.length / totalJobs) * 100)}% completion rate
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white col-span-1">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-purple-100">Total Revenue</p>
                      <p className="text-3xl font-bold mt-1">{formatCurrency(totalRevenue)}</p>
                      <p className="text-purple-100 text-sm mt-1">
                        {formatCurrency(dashboardFinancialMetrics.avgJobValue)} avg per job
                      </p>
                    </div>
                    <DollarSignIcon className="h-8 w-8 text-purple-100 opacity-80" />
                  </div>
                  <div className="mt-4 flex space-x-1">
                    <div className="h-8 bg-white/20 rounded flex-1 flex items-center justify-center text-xs font-medium">
                      Labor: {formatCurrency(totalRevenue * 0.4)}
                    </div>
                    <div className="h-8 bg-white/30 rounded flex-1 flex items-center justify-center text-xs font-medium">
                      Materials: {formatCurrency(totalRevenue * 0.3)}
                    </div>
                    <div className="h-8 bg-white/40 rounded flex-1 flex items-center justify-center text-xs font-medium">
                      Profit: {formatCurrency(totalRevenue * 0.3)}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white col-span-1">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-green-100">Customer Satisfaction</p>
                      <p className="text-3xl font-bold mt-1">96%</p>
                      <p className="text-green-100 text-sm mt-1">
                        Based on {totalJobs} job ratings
                      </p>
                    </div>
                    <UsersIcon className="h-8 w-8 text-green-100 opacity-80" />
                  </div>
                  <div className="mt-4 grid grid-cols-5 gap-1">
                    <div className="flex flex-col items-center">
                      <div className="h-12 bg-white/20 rounded w-full"></div>
                      <p className="text-xs mt-1">1★</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-12 bg-white/20 rounded w-full"></div>
                      <p className="text-xs mt-1">2★</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-12 bg-white/20 rounded w-full"></div>
                      <p className="text-xs mt-1">3★</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-12 bg-white/30 rounded w-full"></div>
                      <p className="text-xs mt-1">4★</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-12 bg-white/40 rounded w-full"></div>
                      <p className="text-xs mt-1">5★</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <DashboardCalendar date={date} setDate={setDate} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
              <TicketsStatusCard 
                taskCounts={dashboardTaskCounts}
                totalTasks={totalTasks}
                openDetailDialog={openDetailDialog}
                detailedTasksData={detailedTasksData}
              />
              
              <PerformanceCard 
                leadSources={dashboardLeadSources}
                jobTypePerformance={dashboardJobTypePerformance}
                financialMetrics={dashboardFinancialMetrics}
                formatCurrency={formatCurrency}
                openDetailDialog={openDetailDialog}
                detailedBusinessMetrics={detailedBusinessMetrics}
              />
            </div>

            <TopTechniciansCard 
              topTechnicians={dashboardTopTechnicians}
              formatCurrency={formatCurrency}
              openDetailDialog={openDetailDialog}
              detailedClientsData={detailedClientsData}
            />
            
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
