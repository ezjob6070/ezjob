
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { financeTabOptions, FinanceTabId } from "@/components/finance/FinanceTabConfig";
import FinancePageHeader from "@/components/finance/FinancePageHeader";
import FinanceHeader from "@/components/finance/FinanceHeader";
import FinanceFiltersPanel from "@/components/finance/FinanceFiltersPanel";
import OverviewDashboard from "@/components/finance/OverviewDashboard";
import JobSourcesDashboard from "@/components/finance/JobSourcesDashboard";
import TechniciansDashboard from "@/components/finance/TechniciansDashboard";
import TransactionsDashboard from "@/components/finance/TransactionsDashboard";
import { useFinanceData } from "@/hooks/useFinanceData";

const Finance = () => {
  const [activeTab, setActiveTab] = useState<FinanceTabId>("overview");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
    to: new Date(),
  });
  
  const {
    searchQuery,
    setSearchQuery,
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
    activeTechnicians
  } = useFinanceData();

  return (
    <div className="container py-8">
      <FinancePageHeader />

      {/* Top Navigation */}
      <FinanceHeader 
        tabOptions={financeTabOptions}
        activeTab={activeTab}
        setActiveTab={setActiveTab as (tab: string) => void}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        date={date}
        setDate={setDate}
      />
      
      {/* Filters Panel */}
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

      {/* Active Tab Content */}
      {activeTab === "overview" && (
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
      )}

      {activeTab === "jobSources" && (
        <JobSourcesDashboard 
          filteredJobSources={filteredJobSources}
          filteredTransactions={filteredTransactions}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}

      {activeTab === "technicians" && (
        <TechniciansDashboard 
          activeTechnicians={activeTechnicians}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}

      {activeTab === "transactions" && (
        <TransactionsDashboard 
          filteredTransactions={filteredTransactions}
        />
      )}
    </div>
  );
};

export default Finance;
