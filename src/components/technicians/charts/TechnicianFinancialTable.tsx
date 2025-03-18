
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import TechnicianFilters from "@/components/finance/technician-filters/TechnicianFilters";
import { SortOption } from "@/hooks/useTechniciansData";
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
      
      <TechnicianFinancialFilterBar
        sortOption={sortOption}
        onSortChange={handleSort}
      />
      
      <CardContent>
        <div className="mb-6">
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
        </div>

        <TechnicianFinancialTableContent
          displayedTechnicians={displayedTechnicians}
          onTechnicianSelect={onTechnicianSelect}
          selectedTechnicianId={selectedTechnicianId}
        />
      </CardContent>
      
      <CardFooter className="flex justify-between border-t px-6 py-4">
        <div className="text-xs text-muted-foreground">
          Showing {displayedTechnicians.length} of {filteredTechnicians.length} technicians
        </div>
        <Button variant="outline" size="sm" onClick={applyFilters}>
          Apply Filters
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TechnicianFinancialTable;
