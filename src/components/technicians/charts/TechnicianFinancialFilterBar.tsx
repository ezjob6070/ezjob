
import React from "react";
import { SortOption } from "@/hooks/useTechniciansData";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TechnicianFinancialFilterBarProps {
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

const TechnicianFinancialFilterBar: React.FC<TechnicianFinancialFilterBarProps> = ({
  sortOption,
  onSortChange
}) => {
  return (
    <div className="flex justify-between items-center px-4 py-2 border-b">
      <div className="text-sm text-muted-foreground">
        Filter and sort technicians
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground">
            <ArrowUpDown className="h-3.5 w-3.5" />
            Sort by
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => onSortChange("revenue-high")} className={sortOption === "revenue-high" ? "bg-secondary" : ""}>
            Revenue: High to Low
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("revenue-low")} className={sortOption === "revenue-low" ? "bg-secondary" : ""}>
            Revenue: Low to High
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("name-asc")} className={sortOption === "name-asc" ? "bg-secondary" : ""}>
            Name: A to Z
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("name-desc")} className={sortOption === "name-desc" ? "bg-secondary" : ""}>
            Name: Z to A
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TechnicianFinancialFilterBar;
