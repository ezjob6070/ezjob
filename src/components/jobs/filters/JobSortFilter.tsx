
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SortOption } from "../types/JobSortTypes";

interface JobSortFilterProps {
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
}

const JobSortFilter = ({ sortBy, setSortBy }: JobSortFilterProps) => {
  const getSortLabel = (sort: SortOption) => {
    switch (sort) {
      case "date-asc":
        return "Date (Oldest First)";
      case "date-desc":
        return "Date (Newest First)";
      case "amount-asc":
        return "Amount (Low to High)";
      case "amount-desc":
        return "Amount (High to Low)";
      case "name-asc":
        return "Name (A to Z)";
      case "name-desc":
        return "Name (Z to A)";
      case "status-asc":
        return "Status (A to Z)";
      case "status-desc":
        return "Status (Z to A)";
      default:
        return "Sort By";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-1">
          <ArrowUpDown className="h-4 w-4" />
          <span>{getSortLabel(sortBy)}</span>
          <ChevronDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => setSortBy("date-desc")}>
          Date (Newest First)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSortBy("date-asc")}>
          Date (Oldest First)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSortBy("amount-desc")}>
          Amount (High to Low)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSortBy("amount-asc")}>
          Amount (Low to High)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSortBy("name-asc")}>
          Name (A to Z)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSortBy("name-desc")}>
          Name (Z to A)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSortBy("status-asc")}>
          Status (A to Z)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSortBy("status-desc")}>
          Status (Z to A)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default JobSortFilter;
