
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SortOption } from "@/types/sortOptions";

interface TechnicianSortFilterProps {
  sortBy: SortOption;
  setSortBy: (option: SortOption) => void;
}

const TechnicianSortFilter: React.FC<TechnicianSortFilterProps> = ({
  sortBy,
  setSortBy
}) => {
  const options = [
    { value: "revenue-high" as SortOption, label: "Revenue: High to Low" },
    { value: "revenue-low" as SortOption, label: "Revenue: Low to High" },
    { value: "jobs-high" as SortOption, label: "Jobs: High to Low" },
    { value: "jobs-low" as SortOption, label: "Jobs: Low to High" },
    { value: "name-asc" as SortOption, label: "Name: A to Z" },
    { value: "name-desc" as SortOption, label: "Name: Z to A" }
  ];
  
  // Get the current sort option label
  const currentOption = options.find(option => option.value === sortBy)?.label || "Sort";
  
  // Determine icon based on sort direction
  const showUpIcon = sortBy.includes("high") || sortBy.includes("asc");
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="w-[180px] justify-between">
          <span>{currentOption}</span>
          {showUpIcon ? (
            <ArrowUpIcon className="h-4 w-4 ml-2" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 ml-2" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        {options.map(option => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setSortBy(option.value)}
            className={sortBy === option.value ? "bg-muted" : ""}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TechnicianSortFilter;
