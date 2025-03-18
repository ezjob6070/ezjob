
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import TechnicianFilters from "./technician-filters/TechnicianFilters";
import { useTechnicianFinancials } from "@/hooks/technicians/useTechnicianFinancials";
import TechnicianFinancialTable from "@/components/technicians/charts/TechnicianFinancialTable";
import { DateRange } from "react-day-picker";
import DashboardMetrics from "./dashboard/MetricsCards";
import TechnicianQuickSelector from "./dashboard/TechnicianQuickSelector";
import TechnicianDetailPanel from "./dashboard/TechnicianDetailPanel";

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
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
    to: new Date(),
  });
  const [appliedFilters, setAppliedFilters] = useState(false);
  const [filteredTechnicians, setFilteredTechnicians] = useState(activeTechnicians);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string>("");

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

  // Prepare mock metrics data for the selected technician
  const prepareMetricsData = () => {
    if (!selectedTechnician) return null;
    
    return {
      revenue: selectedTechnician.totalRevenue || 0,
      earnings: selectedTechnician.totalRevenue * 0.40, // Mock 40% of revenue
      expenses: selectedTechnician.totalRevenue * 0.20, // Mock 20% of revenue
      profit: selectedTechnician.totalRevenue * 0.40, // Mock 40% of revenue
      totalJobs: 42, // Mock value
      completedJobs: 38, // Mock value
      cancelledJobs: 4, // Mock value
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
          <div className="mb-6">
            <TechnicianFilters
              date={localDateRange}
              setDate={setLocalDateRange}
              selectedTechnicians={selectedTechnicianNames}
              setSelectedTechnicians={setSelectedTechnicianNames}
              technicianNames={technicianNames}
              paymentTypeFilter={paymentTypeFilter}
              setPaymentTypeFilter={setPaymentTypeFilter}
              appliedFilters={appliedFilters}
              setAppliedFilters={setAppliedFilters}
              clearFilters={clearFilters}
            />
          </div>

          <DashboardMetrics 
            totalRevenue={totalRevenue}
            totalEarnings={totalEarnings}
            companyProfit={companyProfit}
            dateRangeText={dateRangeText}
          />
          
          <TechnicianQuickSelector 
            activeTechnicians={activeTechnicians}
            selectedTechnicianId={selectedTechnicianId}
            handleTechnicianChange={handleTechnicianChange}
            dateRangeText={dateRangeText}
            localDateRange={localDateRange}
            setLocalDateRange={setLocalDateRange}
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
