
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTechnicianFinancials } from "@/hooks/technicians/useTechnicianFinancials";
import TechnicianFinancialTable from "@/components/technicians/charts/TechnicianFinancialTable";
import { DateRange } from "react-day-picker";
import DashboardMetrics from "./dashboard/MetricsCards";
import TechnicianDetailPanel from "./dashboard/TechnicianDetailPanel";
import { SortOption } from "@/hooks/useTechniciansData";

interface TechniciansDashboardProps {
  activeTechnicians: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const TechniciansDashboard: React.FC<TechniciansDashboardProps> = ({
  activeTechnicians,
  searchQuery,
  setSearchQuery
}) => {
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: today,
    to: today,
  });
  const [appliedFilters, setAppliedFilters] = useState(false);
  const [filteredTechnicians, setFilteredTechnicians] = useState(activeTechnicians);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string>("");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("revenue-high");

  const technicianNames = activeTechnicians.map(tech => tech.name);

  const {
    paymentTypeFilter,
    setPaymentTypeFilter,
    selectedTechnicianNames,
    setSelectedTechnicianNames,
    selectedTechnician,
    localDateRange,
    setLocalDateRange,
    displayedTechnicians,
    financialMetrics,
    selectedTechnicianMetrics,
    dateRangeText,
    toggleTechnician,
    clearFilters,
    applyFilters,
    handleTechnicianSelect
  } = useTechnicianFinancials(filteredTechnicians, dateRange);

  useEffect(() => {
    const filtered = activeTechnicians;
    setFilteredTechnicians(filtered);
  }, [activeTechnicians]);

  // Calculate totals for all filtered technicians
  const totalRevenue = financialMetrics?.totalRevenue || 0;
  const totalEarnings = financialMetrics?.technicianEarnings || 0;
  const companyProfit = financialMetrics?.companyProfit || 0;

  const handleTechnicianChange = (techId: string) => {
    setSelectedTechnicianId(techId);
    const tech = activeTechnicians.find(t => t.id === techId);
    if (tech) {
      handleTechnicianSelect(tech);
    }
  };

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
  };

  const prepareMetricsData = () => {
    if (!selectedTechnician) return null;
    
    return {
      revenue: selectedTechnician.totalRevenue || 0,
      earnings: selectedTechnician.totalRevenue ? selectedTechnician.totalRevenue * 0.40 : 0,
      expenses: selectedTechnician.totalRevenue ? selectedTechnician.totalRevenue * 0.20 : 0,
      profit: selectedTechnician.totalRevenue ? selectedTechnician.totalRevenue * 0.40 : 0,
      totalJobs: 42,
      completedJobs: 38,
      cancelledJobs: 4,
    };
  };

  const mockMetrics = prepareMetricsData();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Technician Financial Performance</CardTitle>
          <CardDescription>Search, filter, and analyze technician earnings and profitability</CardDescription>
        </CardHeader>
        <CardContent>
          <DashboardMetrics 
            totalRevenue={totalRevenue}
            totalEarnings={totalEarnings}
            companyProfit={companyProfit}
            dateRangeText={dateRangeText}
          />
          
          <TechnicianFinancialTable
            filteredTechnicians={filteredTechnicians}
            displayedTechnicians={displayedTechnicians}
            selectedTechnicianNames={selectedTechnicianNames}
            toggleTechnician={toggleTechnician}
            clearFilters={clearFilters}
            applyFilters={applyFilters}
            paymentTypeFilter={paymentTypeFilter}
            setPaymentTypeFilter={setPaymentTypeFilter}
            localDateRange={localDateRange}
            setLocalDateRange={setLocalDateRange}
            onTechnicianSelect={handleTechnicianSelect}
            selectedTechnicianId={selectedTechnician?.id}
            sortOption={sortOption}
            onSortChange={handleSortChange}
            technicianNames={technicianNames}
          />
        </CardContent>
      </Card>

      {selectedTechnician && (
        <TechnicianDetailPanel 
          selectedTechnician={selectedTechnician}
          selectedTechnicianMetrics={mockMetrics}
          dateRangeText={dateRangeText}
        />
      )}
    </div>
  );
};

export default TechniciansDashboard;
