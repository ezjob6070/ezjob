
import React from "react";
import { SortOption } from "@/types/sortOptions";
import SortFilterDropdown from "@/components/common/SortFilterDropdown";

interface JobSortFilterProps {
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
}

const JobSortFilter: React.FC<JobSortFilterProps> = ({
  sortBy,
  setSortBy
}) => {
  return (
    <SortFilterDropdown
      sortBy={sortBy}
      onSortChange={setSortBy}
      label="Sort By"
    />
  );
};

export default JobSortFilter;
