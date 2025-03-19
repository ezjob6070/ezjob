import { SortOption } from "@/hooks/useTechniciansData";
import { Technician } from "@/types/technician";
import TechnicianFinancialTable from "./charts/TechnicianFinancialTable";
import { DateRange } from "react-day-picker";

interface TechnicianCircleChartsProps {
  filteredTechnicians: Technician[];
  selectedTechnicianId?: string;
  onTechnicianSelect: (technician: Technician) => void;
  localDateRange: DateRange | undefined;
  setLocalDateRange: (range: DateRange | undefined) => void;
}

const TechnicianCircleCharts = ({
  filteredTechnicians,
  selectedTechnicianId,
  onTechnicianSelect,
  localDateRange,
  setLocalDateRange
}: TechnicianCircleChartsProps) => {
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
      displayedTechnicians={filteredTechnicians}
      selectedTechnicianNames={[]}
      toggleTechnician={() => {}}
      clearFilters={() => {}}
      applyFilters={() => {}}
      paymentTypeFilter="all"
      setPaymentTypeFilter={() => {}}
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

export default TechnicianCircleCharts;
