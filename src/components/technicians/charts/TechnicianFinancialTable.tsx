
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
import { SortOption } from "@/types/sortOptions";
import TechnicianFinancialFilterBar from "./TechnicianFinancialFilterBar";
import TechnicianFinancialTableContent from "./TechnicianFinancialTableContent";

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
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  technicianNames: string[];
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
  selectedTechnicianId,
  sortOption,
  onSortChange,
  technicianNames
}: TechnicianFinancialTableProps) => {
  const [appliedFilters, setAppliedFilters] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);

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
        onSortChange={onSortChange}
        technicianNames={technicianNames}
        selectedTechnicians={selectedTechnicianNames}
        toggleTechnician={toggleTechnician}
        clearFilters={clearFilters}
        applyFilters={applyFilters}
        paymentTypeFilter={paymentTypeFilter}
        setPaymentTypeFilter={setPaymentTypeFilter}
        localDateRange={localDateRange}
        setLocalDateRange={setLocalDateRange}
        appliedFilters={appliedFilters}
        showDateFilter={showDateFilter}
        setShowDateFilter={setShowDateFilter}
      />
      
      <CardContent>
        <TechnicianFinancialTableContent
          displayedTechnicians={displayedTechnicians}
          onTechnicianSelect={onTechnicianSelect}
          selectedTechnicianId={selectedTechnicianId}
          localDateRange={localDateRange}
        />
      </CardContent>
      
      <CardFooter className="bg-muted/50 py-2 px-6 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {displayedTechnicians.length} technicians displayed
        </div>
      </CardFooter>
    </Card>
  );
};

export default TechnicianFinancialTable;
