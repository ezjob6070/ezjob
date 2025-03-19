
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Technician } from "@/types/technician";
import { DateRange } from "react-day-picker";
import { SortOption } from "@/hooks/useTechniciansData";
import TechnicianFinancialFilterBar from "@/components/technicians/charts/TechnicianFinancialFilterBar";
import TechnicianFinancialTableContent from "@/components/technicians/charts/TechnicianFinancialTableContent";

interface TechnicianFinancialTableProps {
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
  onTechnicianSelect: (technician: Technician) => void;
  selectedTechnicianId?: string;
}

const TechnicianFinancialTable = ({
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
  onTechnicianSelect,
  selectedTechnicianId
}: TechnicianFinancialTableProps) => {
  const [sortOption, setSortOption] = useState<SortOption>("revenue-high"); // Default sort by revenue high to low
  const technicianNames = filteredTechnicians.map(tech => tech.name);

  const handleSort = (option: SortOption) => {
    setSortOption(option);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Technician Financial Performance</CardTitle>
        <CardDescription>
          Financial performance metrics for each technician in the selected time period.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <TechnicianFinancialFilterBar
          sortOption={sortOption}
          onSortChange={handleSort}
          localDateRange={localDateRange}
          setLocalDateRange={setLocalDateRange}
          paymentTypeFilter={paymentTypeFilter}
          setPaymentTypeFilter={setPaymentTypeFilter}
          clearFilters={clearFilters}
          applyFilters={applyFilters}
          selectedTechnicianNames={selectedTechnicianNames}
          technicianNames={technicianNames}
          toggleTechnician={toggleTechnician}
        />

        <TechnicianFinancialTableContent
          displayedTechnicians={displayedTechnicians}
          onTechnicianSelect={onTechnicianSelect}
          selectedTechnicianId={selectedTechnicianId}
          localDateRange={localDateRange}
        />
      </CardContent>
      
      <CardFooter className="flex justify-between border-t px-6 py-4">
        <div className="text-xs text-muted-foreground">
          Showing {displayedTechnicians.length} technicians
        </div>
      </CardFooter>
    </Card>
  );
};

export default TechnicianFinancialTable;
