
import React, { useState } from "react";
import CompactTechnicianFilter from "@/components/finance/technician-filters/CompactTechnicianFilter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TechnicianDateFilter from "./TechnicianDateFilter";
import TechnicianSortFilter from "./TechnicianSortFilter";
import { DateRange } from "react-day-picker";
import { SortOption } from "@/hooks/technicians/useTechnicianTableSorting";

interface TechnicianFinancialFilterBarProps {
  technicianNames: string[];
  selectedTechnicians: string[];
  toggleTechnician: (techName: string) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  paymentTypeFilter: string;
  setPaymentTypeFilter: (value: string) => void;
  localDateRange: DateRange | undefined;
  setLocalDateRange: (date: DateRange | undefined) => void;
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
  jobStatusFilter?: string;
  setJobStatusFilter?: (status: string) => void;
}

const TechnicianFinancialFilterBar: React.FC<TechnicianFinancialFilterBarProps> = ({
  technicianNames,
  selectedTechnicians,
  toggleTechnician,
  clearFilters,
  applyFilters,
  paymentTypeFilter,
  setPaymentTypeFilter,
  localDateRange,
  setLocalDateRange,
  sortBy,
  setSortBy,
  jobStatusFilter = "all",
  setJobStatusFilter = () => {}
}) => {
  const [showDateFilter, setShowDateFilter] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-gray-50 rounded-md border border-gray-100">
      <CompactTechnicianFilter 
        technicianNames={technicianNames}
        selectedTechnicians={selectedTechnicians}
        toggleTechnician={toggleTechnician}
        clearFilters={clearFilters}
        applyFilters={applyFilters}
      />
      
      <div className="w-56">
        <Select value={paymentTypeFilter} onValueChange={setPaymentTypeFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Payment Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payment Types</SelectItem>
            <SelectItem value="percentage">Percentage Based</SelectItem>
            <SelectItem value="flat">Flat Rate</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-56">
        <Select value={jobStatusFilter} onValueChange={setJobStatusFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Job Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <TechnicianDateFilter 
        localDateRange={localDateRange}
        setLocalDateRange={setLocalDateRange}
        showDateFilter={showDateFilter}
        setShowDateFilter={setShowDateFilter}
        clearFilters={clearFilters}
        applyFilters={applyFilters}
      />

      <div className="ml-auto">
        <TechnicianSortFilter 
          sortBy={sortBy} 
          setSortBy={setSortBy} 
        />
      </div>

      {(selectedTechnicians.length > 0 || paymentTypeFilter !== "all" || jobStatusFilter !== "all") && (
        <div className="text-sm text-muted-foreground">
          Showing {selectedTechnicians.length > 0 ? selectedTechnicians.length : "all"} technician(s)
        </div>
      )}
    </div>
  );
};

export default TechnicianFinancialFilterBar;
