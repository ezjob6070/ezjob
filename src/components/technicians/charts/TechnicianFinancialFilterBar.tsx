
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TechnicianDateFilter from "../filters/TechnicianDateFilter";
import TechnicianSortFilter from "../filters/TechnicianSortFilter";
import { DateRange } from "react-day-picker";
import { SortOption } from "@/types/sortOptions";
import CompactTechnicianFilter from "../filters/CompactTechnicianFilter";

interface TechnicianFinancialFilterBarProps {
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  technicianNames: string[];
  selectedTechnicians: string[];
  toggleTechnician: (name: string) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  paymentTypeFilter: string;
  setPaymentTypeFilter: (filter: string) => void;
  localDateRange: DateRange | undefined;
  setLocalDateRange: (range: DateRange | undefined) => void;
  showDateFilter: boolean;
  setShowDateFilter: (show: boolean) => void;
}

const TechnicianFinancialFilterBar: React.FC<TechnicianFinancialFilterBarProps> = ({
  sortOption,
  onSortChange,
  technicianNames,
  selectedTechnicians,
  toggleTechnician,
  clearFilters,
  applyFilters,
  paymentTypeFilter,
  setPaymentTypeFilter,
  localDateRange,
  setLocalDateRange,
  showDateFilter,
  setShowDateFilter
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-gray-50 rounded-md border border-gray-100">
      <CompactTechnicianFilter 
        technicianNames={technicianNames}
        selectedTechnicians={selectedTechnicians}
        toggleTechnician={toggleTechnician}
        clearFilters={clearFilters}
        applyFilters={applyFilters}
      />
      
      <div className="w-44">
        <Select value={paymentTypeFilter} onValueChange={setPaymentTypeFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Payment Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payment Types</SelectItem>
            <SelectItem value="percentage">Percentage Based</SelectItem>
            <SelectItem value="flat">Flat Rate</SelectItem>
            <SelectItem value="hourly">Hourly Rate</SelectItem>
            <SelectItem value="salary">Salary</SelectItem>
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
          sortBy={sortOption} 
          setSortBy={onSortChange} 
        />
      </div>

      {(selectedTechnicians.length > 0 || paymentTypeFilter !== "all") && (
        <div className="text-sm text-muted-foreground">
          Showing {selectedTechnicians.length > 0 ? selectedTechnicians.length : "all"} technician(s)
        </div>
      )}
    </div>
  );
};

export default TechnicianFinancialFilterBar;
