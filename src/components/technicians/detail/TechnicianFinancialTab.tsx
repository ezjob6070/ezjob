import { SortOption } from "@/hooks/useTechniciansData";
import { Technician } from "@/types/technician";
import TechnicianFinancialTable from "../charts/TechnicianFinancialTable";
import { DateRange } from "react-day-picker";

interface TechnicianFinancialTabProps {
  technician: Technician;
  filteredTechnicians: Technician[];
  displayedTechnicians: Technician[];
  selectedTechnicianNames: string[];
  toggleTechnician: (name: string) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  paymentTypeFilter: string;
  setPaymentTypeFilter: (filter: string) => void;
  localDateRange: DateRange | undefined;
  setLocalDateRange: (range: DateRange | undefined) => void;
  selectedTechnicianId?: string;
  onTechnicianSelect: (technician: Technician) => void;
}

const TechnicianFinancialTab = ({
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
}: TechnicianFinancialTabProps) => {
  // Get all technician names for filtering
  const technicianNames = filteredTechnicians.map(tech => tech.name);
  
  // Add the sortOption and onSortChange props to fix TypeScript errors
  const sortOption: SortOption = "revenue-high";
  const onSortChange = (option: SortOption) => {
    // This is just a placeholder to fix TypeScript errors
    console.log("Sort option changed:", option);
  };
  
  return (
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
      sortOption={sortOption}
      onSortChange={onSortChange}
      technicianNames={technicianNames}
    />
  );
};

export default TechnicianFinancialTab;
