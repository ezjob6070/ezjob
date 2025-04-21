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

  const [currentIndustry, setCurrentIndustry] = useState<IndustryType>("construction");

  const { jobs } = useGlobalState();

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

  const handleIndustryChange = (industry: IndustryType) => {
    setCurrentIndustry(industry);
    
    if (industry === 'real_estate') {
      window.location.href = '/real-estate-dashboard';
    }
    
    toast({
      title: `Switched to ${industry.replace('_', ' ')} CRM`,
      description: `Now viewing ${industry.replace('_', ' ')} dashboard`,
    });
  };

  return (
    <div className="space-y-4 py-4">
      <DashboardHeader />
      
      <IndustrySelector 
        currentIndustry={currentIndustry} 
        onIndustryChange={handleIndustryChange} 
      />
      
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
