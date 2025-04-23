
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { IndustryType } from "@/components/sidebar/sidebarTypes";

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
    { name: 'Repair', value: 42 },
    { name: 'Installation', value: 28 },
    { name: 'Maintenance', value: 18 },
    { name: 'Other', value: 12 },
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

  const renderStatisticsContent = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Annual Revenue vs Target</h3>
            <div className="h-80">
              {/* Placeholder for LineChart */}
              <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-md">
                <div className="text-center p-4">
                  <p className="text-gray-500">Revenue Chart</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Total Revenue YTD: {formatCurrency(totalRevenue)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Job Type Distribution</h3>
            <div className="h-80">
              {/* Placeholder for PieChart */}
              <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-md">
                <div className="text-center p-4">
                  <p className="text-gray-500">Job Type Distribution</p>
                  <div className="flex flex-wrap justify-center gap-3 mt-4">
                    {jobTypeData.map((item, index) => (
                      <div key={item.name} className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-1" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="text-sm">{item.name}: {item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Monthly Job Completion Rate</h3>
          <div className="h-80">
            {/* Placeholder for BarChart */}
            <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-md">
              <div className="text-center p-4">
                <p className="text-gray-500">Job Completion Chart</p>
                <p className="text-sm text-gray-400 mt-2">
                  Average completion rate: 87%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAnalyticsContent = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
          <div className="h-80">
            {/* Placeholder for LineChart */}
            <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-md">
              <div className="text-center p-4">
                <p className="text-gray-500">Performance Metrics Chart</p>
                <p className="text-sm text-gray-400 mt-2">
                  Showing calls, jobs, and revenue trends over time
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Conversion Rate</h3>
            <div className="mt-4">
              <p className="text-4xl font-bold">84%</p>
              <p className="text-indigo-100 mt-1">Calls to Jobs Conversion</p>
              <p className="mt-2 text-green-300 text-sm">↑ 4.2% from last month</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Avg. Job Value</h3>
            <div className="mt-4">
              <p className="text-4xl font-bold">{formatCurrency(avgJobValue)}</p>
              <p className="text-emerald-100 mt-1">Per completed job</p>
              <p className="mt-2 text-green-300 text-sm">↑ 2.8% from last month</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Technician Efficiency</h3>
            <div className="mt-4">
              <p className="text-4xl font-bold">92%</p>
              <p className="text-amber-100 mt-1">On-time completion rate</p>
              <p className="mt-2 text-green-300 text-sm">↑ 1.5% from last month</p>
            </div>
          </div>
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
            <DashboardCalendar date={date} setDate={setDate} />
            
            <MetricsOverview 
              financialMetrics={dashboardFinancialMetrics}
              formatCurrency={formatCurrency}
              openDetailDialog={openDetailDialog}
              detailedTasksData={detailedTasksData}
              detailedRevenueData={detailedRevenueData}
              detailedBusinessMetrics={detailedBusinessMetrics}
              dateRange={date}
            />

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
    <div className="space-y-4 py-4">
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
