import { useState } from "react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MetricsOverview from "@/components/dashboard/MetricsOverview";
import StatisticsSection from "@/components/dashboard/StatisticsSection";
import TicketsStatusCard from "@/components/dashboard/TicketsStatusCard";
import PerformanceCard from "@/components/dashboard/PerformanceCard";
import TopTechniciansCard from "@/components/dashboard/TopTechniciansCard";
import ActivitySection from "@/components/dashboard/ActivitySection";
import DashboardDetailDialog from "@/components/DashboardDetailDialog";
import DashboardCalendar from "@/components/dashboard/DashboardCalendar";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
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
  detailedBusinessMetrics
} from "@/data/dashboardData";

const Index = () => {
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
    { name: 'Repair', value: 42 },
    { name: 'Installation', value: 28 },
    { name: 'Maintenance', value: 18 },
    { name: 'Other', value: 12 },
  ];

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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'statistics':
        return <StatisticsSection revenueData={revenueData} jobTypeData={jobTypeData} performanceData={performanceData} formatCurrency={formatCurrency} />;
      
      case 'analytics':
        return (
          <div className="space-y-4">
            <Card className="bg-white">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-base">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="h-64 p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(value, name) => {
                      if (name === 'revenue') {
                        return [formatCurrency(Number(value)), 'Revenue'];
                      }
                      return [value, name];
                    }} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Line yAxisId="left" type="monotone" dataKey="calls" stroke="#4f46e5" name="Calls" />
                    <Line yAxisId="left" type="monotone" dataKey="jobs" stroke="#10b981" name="Jobs" />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#f59e0b" name="Revenue" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-white text-base">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <div className="text-2xl font-bold">84%</div>
                  <p className="text-indigo-100 text-xs">Calls to Jobs Conversion</p>
                  <div className="mt-1 text-green-300 text-xs">↑ 4.2% from last month</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-white text-base">Avg. Job Value</CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <div className="text-2xl font-bold">{formatCurrency(235)}</div>
                  <p className="text-emerald-100 text-xs">Per completed job</p>
                  <div className="mt-1 text-green-300 text-xs">↑ 2.8% from last month</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-white text-base">Technician Efficiency</CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <div className="text-2xl font-bold">92%</div>
                  <p className="text-amber-100 text-xs">On-time completion rate</p>
                  <div className="mt-1 text-green-300 text-xs">↑ 1.5% from last month</div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      
      default: // Dashboard tab
        return (
          <>
            <DashboardCalendar date={date} setDate={setDate} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <Card className="bg-white shadow-sm border border-gray-100">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium">Revenue</h3>
                    <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">+{dashboardFinancialMetrics.monthlyGrowth}%</span>
                  </div>
                  <div className="text-xl font-bold">{formatCurrency(dashboardFinancialMetrics.totalRevenue)}</div>
                  <div className="text-xs text-gray-500 mt-1">From {totalTasks} jobs</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-sm border border-gray-100">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium">Job Completion</h3>
                    <span className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{Math.round((dashboardTaskCounts.completed / totalTasks) * 100)}%</span>
                  </div>
                  <div className="text-xl font-bold">{dashboardTaskCounts.completed}/{totalTasks}</div>
                  <div className="text-xs text-gray-500 mt-1">{dashboardTaskCounts.inProgress} in progress</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-sm border border-gray-100">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium">Average Value</h3>
                    <span className="text-xs text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">Per Job</span>
                  </div>
                  <div className="text-xl font-bold">{formatCurrency(dashboardFinancialMetrics.avgJobValue)}</div>
                  <div className="text-xs text-gray-500 mt-1">Conversion rate: {dashboardFinancialMetrics.conversionRate}%</div>
                </CardContent>
              </Card>
            </div>
            
            <MetricsOverview 
              financialMetrics={dashboardFinancialMetrics}
              formatCurrency={formatCurrency}
              openDetailDialog={openDetailDialog}
              detailedTasksData={detailedTasksData}
              detailedRevenueData={detailedRevenueData}
              detailedBusinessMetrics={detailedBusinessMetrics}
              dateRange={date}
            />

            {/* Add Projects Dashboard Section */}
            <ProjectsDashboardSection />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
    <div className="space-y-3 py-3">
      <DashboardHeader 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />
      
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

export default Index;
