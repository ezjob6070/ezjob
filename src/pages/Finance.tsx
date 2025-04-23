
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { financeTabOptions, FinanceTabId } from "@/components/finance/FinanceTabConfig";
import FinancePageHeader from "@/components/finance/FinancePageHeader";
import OverviewDashboard from "@/components/finance/OverviewDashboard";
import JobSourcesDashboard from "@/components/finance/JobSourcesDashboard";
import TechniciansDashboard from "@/components/finance/TechniciansDashboard";
import TransactionsDashboard from "@/components/finance/TransactionsDashboard";
import OfficeDashboard from "@/components/finance/OfficeDashboard";
import SalariesDashboard from "@/components/finance/SalariesDashboard";
import { useFinanceData } from "@/hooks/useFinanceData";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TechnicianInvoiceSection from "@/components/finance/TechnicianInvoiceSection";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";

const Finance = () => {
  const [activeTab, setActiveTab] = useState<FinanceTabId>("overview");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
    to: new Date(),
  });
  
  const { technicians, jobs, jobSources } = useGlobalState();
  
  const {
    showFilters,
    setShowFilters,
    selectedTechnicians,
    selectedJobSources,
    filteredTransactions,
    filteredJobSources,
    expenseCategories,
    technicianNames,
    jobSourceNames,
    toggleTechnician,
    toggleJobSource,
    clearFilters,
    applyFilters,
    activeTechnicians,
    searchQuery,
    setSearchQuery
  } = useFinanceData();
  
  // Filter jobs based on date range
  const filteredJobs = jobs.filter(job => 
    job.status === "completed" && 
    (!date?.from || (job.scheduledDate && new Date(job.scheduledDate) >= date.from)) && 
    (!date?.to || (job.scheduledDate && new Date(job.scheduledDate) <= date.to))
  );
  
  // Calculate total metrics from filtered job data
  const totalRevenue = filteredJobs.reduce((sum, job) => sum + (job.actualAmount || job.amount || 0), 0);

  // Calculate expenses as 40% of revenue for completed jobs
  const totalExpenses = totalRevenue * 0.4;
  
  // Calculate profit as revenue minus expenses
  const totalProfit = totalRevenue - totalExpenses;

  const handleTabChange = (value: string) => {
    setActiveTab(value as FinanceTabId);
  };

  return (
    <div className="container py-6">
      <FinancePageHeader />

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Tabs 
            defaultValue="overview" 
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <TabsList className="bg-white/50">
                {financeTabOptions.map(tab => (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id}
                    className="flex items-center gap-2 px-4 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    {tab.icon}
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="overview" className="mt-0">
                <OverviewDashboard 
                  totalRevenue={totalRevenue}
                  totalExpenses={totalExpenses}
                  totalProfit={totalProfit}
                  jobSources={jobSources}
                  filteredTransactions={filteredTransactions}
                  expenseCategories={expenseCategories}
                  date={date}
                  setDate={setDate}
                />
              </TabsContent>

              <TabsContent value="jobSources" className="mt-0">
                <JobSourcesDashboard 
                  filteredJobSources={filteredJobSources}
                  filteredTransactions={filteredTransactions}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </TabsContent>

              <TabsContent value="technicians" className="mt-0">
                <TechniciansDashboard 
                  key="technicians-dashboard"
                  activeTechnicians={activeTechnicians.length > 0 ? activeTechnicians : technicians}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
                
                <div className="mt-8 w-full">
                  <TechnicianInvoiceSection activeTechnicians={activeTechnicians.length > 0 ? activeTechnicians : technicians} />
                </div>
              </TabsContent>

              <TabsContent value="transactions" className="mt-0">
                <TransactionsDashboard 
                  filteredTransactions={filteredTransactions}
                />
              </TabsContent>

              <TabsContent value="salaries" className="mt-0">
                <SalariesDashboard
                  dateRange={date}
                  setDateRange={setDate}
                />
              </TabsContent>

              <TabsContent value="office" className="mt-0">
                <OfficeDashboard
                  date={date}
                  setDate={setDate}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Finance;
