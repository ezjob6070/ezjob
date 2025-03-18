
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { SortOption } from "@/hooks/useTechniciansData";

interface TechnicianFinancialFilterBarProps {
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

const TechnicianFinancialFilterBar: React.FC<TechnicianFinancialFilterBarProps> = ({
  sortOption,
  onSortChange
}) => {
  return (
    <div className="flex justify-end px-6 py-2 border-b">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
        <Select value={sortOption} onValueChange={(value) => onSortChange(value as SortOption)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="revenue-high">Revenue (High to Low)</SelectItem>
            <SelectItem value="revenue-low">Revenue (Low to High)</SelectItem>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            <SelectItem value="jobs-high">Jobs (High to Low)</SelectItem>
            <SelectItem value="jobs-low">Jobs (Low to High)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TechnicianFinancialFilterBar;
