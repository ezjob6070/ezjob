
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { SortOption } from "@/hooks/useTechniciansData";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import CompactJobSourceFilter from "./CompactJobSourceFilter";
import DateRangeFilter from "../technician-filters/DateRangeFilter";
import TechnicianSortFilter from "../../technicians/filters/TechnicianSortFilter";

interface JobSourceFilterBarProps {
  jobSourceNames: string[];
  selectedJobSources: string[];
  toggleJobSource: (sourceName: string) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  localDateRange: DateRange | undefined;
  setLocalDateRange: (date: DateRange | undefined) => void;
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
  statusFilter?: string;
  setStatusFilter?: (status: string) => void;
}

const JobSourceFilterBar: React.FC<JobSourceFilterBarProps> = ({
  jobSourceNames,
  selectedJobSources,
  toggleJobSource,
  clearFilters,
  applyFilters,
  categoryFilter,
  setCategoryFilter,
  localDateRange,
  setLocalDateRange,
  sortBy,
  setSortBy,
  statusFilter = "all",
  setStatusFilter = () => {}
}) => {
  const [showDateFilter, setShowDateFilter] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-gray-50 rounded-md border border-gray-100">
      <CompactJobSourceFilter 
        jobSourceNames={jobSourceNames}
        selectedJobSources={selectedJobSources}
        toggleJobSource={toggleJobSource}
        clearFilters={clearFilters}
        applyFilters={applyFilters}
      />
      
      <div className="w-44">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="referral">Referral</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-40">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDateFilter(!showDateFilter)}
        className="flex items-center gap-2"
      >
        <Filter className="h-4 w-4" />
        Date Filter
      </Button>

      {showDateFilter && (
        <div className="w-full mt-2 p-2 bg-white border rounded-md shadow-sm">
          <DateRangeFilter 
            date={localDateRange}
            setDate={setLocalDateRange}
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="mr-1 h-3 w-3" /> Clear
            </Button>
            <Button size="sm" onClick={() => {
              applyFilters();
              setShowDateFilter(false);
            }}>
              Apply
            </Button>
          </div>
        </div>
      )}

      <div className="ml-auto">
        <TechnicianSortFilter 
          sortBy={sortBy} 
          setSortBy={setSortBy}
        />
      </div>

      {(selectedJobSources.length > 0 || categoryFilter !== "all" || statusFilter !== "all") && (
        <div className="text-sm text-muted-foreground">
          Showing {selectedJobSources.length > 0 ? selectedJobSources.length : "all"} job source(s)
        </div>
      )}
    </div>
  );
};

export default JobSourceFilterBar;
