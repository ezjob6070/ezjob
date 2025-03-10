
import React from "react";
import { Technician } from "@/types/technician";
import { DateRange } from "react-day-picker";
import PaymentBreakdownCards from "@/components/technicians/charts/PaymentBreakdownCards";
import TechnicianDetailCard from "@/components/technicians/charts/TechnicianDetailCard";
import TechnicianFinancialTable from "@/components/technicians/charts/TechnicianFinancialTable";
import useTechnicianFinancials from "@/hooks/useTechnicianFinancials";

interface TechnicianCircleChartsProps {
  filteredTechnicians: Technician[];
  dateRange?: DateRange;
}

const TechnicianCircleCharts: React.FC<TechnicianCircleChartsProps> = ({ 
  filteredTechnicians,
  dateRange
}) => {
  const {
    paymentTypeFilter,
    setPaymentTypeFilter,
    selectedTechnicianNames,
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
  
  return (
    <div className="space-y-6">
      {/* Payment Breakdown Simple Cards */}
      <PaymentBreakdownCards 
        totalRevenue={financialMetrics.totalRevenue}
        technicianEarnings={financialMetrics.technicianEarnings}
        totalExpenses={financialMetrics.totalExpenses}
        companyProfit={financialMetrics.companyProfit}
        dateRangeText={dateRangeText}
      />
      
      {/* Selected Technician Metrics */}
      {selectedTechnician && selectedTechnicianMetrics && (
        <TechnicianDetailCard 
          technician={selectedTechnician} 
          metrics={selectedTechnicianMetrics} 
          dateRangeText={dateRangeText}
        />
      )}
      
      {/* Technicians List Table */}
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
    </div>
  );
};

export default TechnicianCircleCharts;
