
import React from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";

// Extended sort options to match employees
type SortOption = 
  | "newest" 
  | "oldest" 
  | "name-asc" 
  | "name-desc" 
  | "revenue-high" 
  | "revenue-low";

interface DateSortFilterProps {
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

const DateSortFilter: React.FC<DateSortFilterProps> = ({ 
  sortOption, 
  onSortChange 
}) => {
  const getSortButtonIcon = () => {
    if (sortOption === "newest" || sortOption === "name-desc" || sortOption === "revenue-high") {
      return <ArrowDown className="h-4 w-4 mr-1" />;
    }
    return <ArrowUp className="h-4 w-4 mr-1" />;
  };

  const getSortButtonText = () => {
    switch (sortOption) {
      case "newest":
        return "Newest First";
      case "oldest":
        return "Oldest First";
      case "name-asc":
        return "Name (A-Z)";
      case "name-desc":
        return "Name (Z-A)";
      case "revenue-high":
        return "Revenue (High-Low)";
      case "revenue-low":
        return "Revenue (Low-High)";
      default:
        return "Sort";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center">
          {getSortButtonIcon()}
          {getSortButtonText()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onSortChange("newest")}>
          <ArrowDown className="h-4 w-4 mr-2" />
          Newest First
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange("oldest")}>
          <ArrowUp className="h-4 w-4 mr-2" />
          Oldest First
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange("name-asc")}>
          <ArrowUp className="h-4 w-4 mr-2" />
          Name (A-Z)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange("name-desc")}>
          <ArrowDown className="h-4 w-4 mr-2" />
          Name (Z-A)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange("revenue-high")}>
          <ArrowDown className="h-4 w-4 mr-2" />
          Revenue (High-Low)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange("revenue-low")}>
          <ArrowUp className="h-4 w-4 mr-2" />
          Revenue (Low-High)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DateSortFilter;
