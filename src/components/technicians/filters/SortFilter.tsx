
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SortOption } from "@/types/sortOptions";

interface SortFilterProps {
  selected: SortOption;
  onSelect: (option: SortOption) => void;
}

const SortFilter: React.FC<SortFilterProps> = ({
  selected,
  onSelect
}) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Sort By</h3>
      <RadioGroup 
        value={selected} 
        onValueChange={(value) => onSelect(value as SortOption)}
        className="space-y-1"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="newest" id="sort-newest" />
          <Label htmlFor="sort-newest" className="text-sm">Newest First</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="oldest" id="sort-oldest" />
          <Label htmlFor="sort-oldest" className="text-sm">Oldest First</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="name-asc" id="sort-name-asc" />
          <Label htmlFor="sort-name-asc" className="text-sm">Name (A-Z)</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="name-desc" id="sort-name-desc" />
          <Label htmlFor="sort-name-desc" className="text-sm">Name (Z-A)</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="revenue-high" id="sort-revenue-high" />
          <Label htmlFor="sort-revenue-high" className="text-sm">Revenue (High to Low)</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="revenue-low" id="sort-revenue-low" />
          <Label htmlFor="sort-revenue-low" className="text-sm">Revenue (Low to High)</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default SortFilter;
