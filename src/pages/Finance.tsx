
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { financeTabOptions, FinanceTabId } from "@/components/finance/FinanceTabConfig";
import FinancePageHeader from "@/components/finance/FinancePageHeader";
import FinanceFiltersPanel from "@/components/finance/FinanceFiltersPanel";
import OverviewDashboard from "@/components/finance/OverviewDashboard";
import JobSourcesDashboard from "@/components/finance/JobSourcesDashboard";
import TechniciansDashboard from "@/components/finance/TechniciansDashboard";
import TransactionsDashboard from "@/components/finance/TransactionsDashboard";
import OfficeDashboard from "@/components/finance/OfficeDashboard";
import SalariesDashboard from "@/components/finance/SalariesDashboard";
import { useFinanceData } from "@/hooks/useFinanceData";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Finance = () => {
  const [activeTab, setActiveTab] = useState<FinanceTabId>("overview");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
    to: new Date(),
  });
  
  const {
    showFilters,
    setShowFilters,
    selectedTechnicians,
    selectedJobSources,
    totalRevenue,
    totalExpenses,
    totalProfit,
    jobSources,
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

  const handleTabChange = (value: string) => {
    setActiveTab(value as FinanceTabId);
  };

  return (
    <div className="container py-8">
      <FinancePageHeader />

      <Card className="mb-8 border-none shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="p-0">
          <Tabs 
            defaultValue="overview" 
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <TabsList className="bg-white/50 backdrop-blur-sm">
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
              
              {/* Date range picker and filters button completely removed */}
            </div>
            
            {/* Filters Panel - Hide it completely */}
            {false && (
              <FinanceFiltersPanel 
                showFilters={showFilters}
                technicianNames={technicianNames}
                jobSourceNames={jobSourceNames}
                selectedTechnicians={selectedTechnicians}
                selectedJobSources={selectedJobSources}
                toggleTechnician={toggleTechnician}
                toggleJobSource={toggleJobSource}
                clearFilters={clearFilters}
                setShowFilters={setShowFilters}
                applyFilters={applyFilters}
              />
            )}

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
                  activeTechnicians={activeTechnicians}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
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
