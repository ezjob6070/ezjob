
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
  const [appliedFilters, setAppliedFilters] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("revenue-high");
  const technicianNames = displayedTechnicians.map(tech => tech.name);

  const handleSort = (option: SortOption) => {
    setSortOption(option);
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow border-t-0 rounded-t-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Technician Financial Performance</CardTitle>
        <CardDescription>
          Financial performance metrics for each technician in the selected time period.
        </CardDescription>
      </CardHeader>
      
      <TechnicianFinancialFilterBar
        sortOption={sortOption}
        onSortChange={handleSort}
      />
      
      <CardContent className="p-3 sm:p-4">
        <div className="overflow-x-auto">
          <TechnicianFinancialTableContent
            displayedTechnicians={displayedTechnicians}
            onTechnicianSelect={onTechnicianSelect}
            selectedTechnicianId={selectedTechnicianId}
            localDateRange={localDateRange}
          />
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t px-4 py-3 text-xs">
        <div className="text-muted-foreground">
          Showing {displayedTechnicians.length} technicians
        </div>
      </CardFooter>
    </Card>
  );
};

export default TechnicianFinancialTable;
