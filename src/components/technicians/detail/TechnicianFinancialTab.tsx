
import React from "react";
import { Technician } from "@/types/technician";
import PaymentBreakdownCards from "@/components/technicians/charts/PaymentBreakdownCards";
import TechnicianFinancialTable from "@/components/technicians/charts/TechnicianFinancialTable";
import { calculateFinancialMetrics } from "@/hooks/technicians/financialUtils";
import { DateRange } from "react-day-picker";

interface TechnicianFinancialTabProps {
  technician: Technician;
  filteredTechnicians: Technician[];
  displayedTechnicians: Technician[];
  selectedTechnicianNames: string[];
  toggleTechnician: (techName: string) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  paymentTypeFilter: string;
  setPaymentTypeFilter: (value: string) => void;
  localDateRange: DateRange | undefined;
  setLocalDateRange: (date: DateRange | undefined) => void;
  selectedTechnicianId: string | undefined;
  onTechnicianSelect: (tech: Technician) => void;
}

const TechnicianFinancialTab: React.FC<TechnicianFinancialTabProps> = ({
  technician,
  filteredTechnicians,
  displayedTechnicians,
  selectedTechnicianNames,
  toggleTechnician,
  clearFilters,
  applyFilters,
  paymentTypeFilter,
  setPaymentTypeFilter,
  localDateRange,
  setLocalDateRange,
  selectedTechnicianId,
  onTechnicianSelect
}) => {
  const financialMetrics = calculateFinancialMetrics([technician]);

  return (
    <div className="space-y-6">
      <PaymentBreakdownCards 
        revenue={financialMetrics.totalRevenue}
        technicianEarnings={financialMetrics.technicianEarnings}
        expenses={financialMetrics.totalExpenses}
        profit={financialMetrics.companyProfit}
        dateRangeText="All Time"
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
        onTechnicianSelect={onTechnicianSelect}
        selectedTechnicianId={selectedTechnicianId}
      />
    </div>
  );
};

export default TechnicianFinancialTab;
