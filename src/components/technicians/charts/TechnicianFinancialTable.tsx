
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
import TechnicianFilters from "@/components/finance/technician-filters/TechnicianFilters";
import { SortOption } from "@/hooks/useTechniciansData";
import TechnicianFinancialFilterBar from "@/components/technicians/charts/TechnicianFinancialFilterBar";
import TechnicianFinancialTableContent from "@/components/technicians/charts/TechnicianFinancialTableContent";

interface TechnicianFinancialTableProps {
  filteredTechnicians: Technician[]; // Added this prop to fix the type error
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
  filteredTechnicians, // Added this prop
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
  const [sortOption, setSortOption] = useState<SortOption>("revenue-high"); // Default sort by revenue high to low
  const technicianNames = displayedTechnicians.map(tech => tech.name);

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
      
      <TechnicianFinancialFilterBar
        sortOption={sortOption}
        onSortChange={handleSort}
      />
      
      <CardContent>
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <TechnicianFilters
              date={localDateRange}
              setDate={setLocalDateRange}
              selectedTechnicians={selectedTechnicianNames}
              setSelectedTechnicians={(techs) => {
                // This just updates the UI. The actual filtering logic is in the parent
              }}
              technicianNames={technicianNames}
              paymentTypeFilter={paymentTypeFilter}
              setPaymentTypeFilter={setPaymentTypeFilter}
              appliedFilters={appliedFilters}
              setAppliedFilters={setAppliedFilters}
              clearFilters={clearFilters}
            />
            
            <div className="ml-auto">
              <Button variant="outline" size="sm" onClick={applyFilters}>
                Apply Filters
              </Button>
            </div>
          </div>
        </div>

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
