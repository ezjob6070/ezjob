import React from "react";
import { Technician } from "@/types/technician";
import { DateRange } from "react-day-picker";
import PaymentBreakdownCards from "@/components/technicians/charts/PaymentBreakdownCards";
import TechnicianDetailCard from "@/components/technicians/charts/TechnicianDetailCard";
import TechnicianFinancialTable from "@/components/technicians/charts/TechnicianFinancialTable";
import useTechnicianFinancials from "@/hooks/technicians/useTechnicianFinancials";

interface TechnicianCircleChartsProps {
  filteredTechnicians: Technician[];
  dateRange?: DateRange;
}

interface TechnicianMetrics {
  completedJobs: number;
  cancelledJobs: number;
  totalRevenue: number;
  rating: number;
  revenue?: number;
  earnings?: number;
  expenses?: number;
  profit?: number;
  partsValue?: number;
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

  const formattedTechnicianMetrics: TechnicianMetrics | null = selectedTechnician && selectedTechnicianMetrics ? {
    completedJobs: selectedTechnician.completedJobs,
    cancelledJobs: selectedTechnician.cancelledJobs,
    totalRevenue: selectedTechnician.totalRevenue,
    rating: selectedTechnician.rating,
    revenue: selectedTechnicianMetrics.revenue,
    earnings: selectedTechnicianMetrics.earnings,
    expenses: selectedTechnicianMetrics.expenses,
    profit: selectedTechnicianMetrics.profit,
    partsValue: selectedTechnicianMetrics.partsValue
  } : null;
  
  return (
    <div className="space-y-6">
      <PaymentBreakdownCards 
        revenue={financialMetrics.totalRevenue}
        technicianEarnings={financialMetrics.technicianEarnings}
        expenses={financialMetrics.totalExpenses}
        profit={financialMetrics.companyProfit}
        dateRangeText={dateRangeText}
      />
      
      {selectedTechnician && formattedTechnicianMetrics && (
        <TechnicianDetailCard 
          technician={selectedTechnician} 
          metrics={formattedTechnicianMetrics} 
          dateRangeText={dateRangeText}
        />
      )}
      
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
