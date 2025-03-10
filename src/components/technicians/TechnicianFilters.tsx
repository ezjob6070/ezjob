
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import CategoryFilter from "@/components/finance/technician-filters/CategoryFilter";

interface TechnicianFiltersProps {
  categories: string[];
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  addCategory: (category: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
}

const TechnicianFilters: React.FC<TechnicianFiltersProps> = ({
  categories,
  selectedCategories,
  toggleCategory,
  addCategory,
  status,
  onStatusChange
}) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <CategoryFilter 
        categories={categories}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        addCategory={addCategory}
      />
      
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TechnicianFilters;
