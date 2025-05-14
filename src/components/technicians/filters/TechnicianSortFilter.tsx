
import React from "react";
import { SortOption } from "@/types/sortOptions";
import SortFilterDropdown from "@/components/common/SortFilterDropdown";

interface TechnicianSortFilterProps {
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
}

const TechnicianSortFilter: React.FC<TechnicianSortFilterProps> = ({
  sortBy,
  setSortBy
}) => {
  return (
    <SortFilterDropdown
      sortBy={sortBy}
      onSortChange={setSortBy}
      label="Sort Technicians"
    />
  );
};

export default TechnicianSortFilter;
