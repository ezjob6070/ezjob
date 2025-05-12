
import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ChevronDown } from "lucide-react";
import { SortOption } from '@/types/sortOptions';

interface SortFilterDropdownProps {
  sortBy: SortOption;
  onSortChange: (option: SortOption) => void;
  label?: string;
  compact?: boolean;
}

const SortFilterDropdown: React.FC<SortFilterDropdownProps> = ({
  sortBy,
  onSortChange,
  label = "Sort By",
  compact = false
}) => {
  const getActiveOptionLabel = () => {
    switch(sortBy) {
      case "newest": return "Newest First";
      case "oldest": return "Oldest First";
      case "name-asc": return "Name (A-Z)";
      case "name-desc": return "Name (Z-A)";
      case "revenue-high": return "Revenue (High-Low)";
      case "revenue-low": return "Revenue (Low-High)";
      case "profit-high": return "Profit (High-Low)";
      case "profit-low": return "Profit (Low-High)";
      case "jobs-high": return "Jobs (High-Low)";
      case "jobs-low": return "Jobs (Low-High)";
      default: return "Sort By";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size={compact ? "sm" : "default"}
          className="flex items-center gap-1"
        >
          {compact ? getActiveOptionLabel() : label}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem 
          className="flex items-center gap-2" 
          onClick={() => onSortChange("newest")}
        >
          <ArrowDown className="h-4 w-4" />
          <span>Newest First</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="flex items-center gap-2" 
          onClick={() => onSortChange("oldest")}
        >
          <ArrowUp className="h-4 w-4" />
          <span>Oldest First</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="flex items-center gap-2" 
          onClick={() => onSortChange("name-asc")}
        >
          <ArrowUp className="h-4 w-4" />
          <span>Name (A-Z)</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="flex items-center gap-2" 
          onClick={() => onSortChange("name-desc")}
        >
          <ArrowDown className="h-4 w-4" />
          <span>Name (Z-A)</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="flex items-center gap-2" 
          onClick={() => onSortChange("revenue-high")}
        >
          <ArrowDown className="h-4 w-4" />
          <span>Revenue (High-Low)</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="flex items-center gap-2" 
          onClick={() => onSortChange("revenue-low")}
        >
          <ArrowUp className="h-4 w-4" />
          <span>Revenue (Low-High)</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="flex items-center gap-2" 
          onClick={() => onSortChange("profit-high")}
        >
          <ArrowDown className="h-4 w-4" />
          <span>Profit (High-Low)</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="flex items-center gap-2" 
          onClick={() => onSortChange("profit-low")}
        >
          <ArrowUp className="h-4 w-4" />
          <span>Profit (Low-High)</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="flex items-center gap-2" 
          onClick={() => onSortChange("jobs-high")}
        >
          <ArrowDown className="h-4 w-4" />
          <span>Jobs (High-Low)</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="flex items-center gap-2" 
          onClick={() => onSortChange("jobs-low")}
        >
          <ArrowUp className="h-4 w-4" />
          <span>Jobs (Low-High)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortFilterDropdown;
