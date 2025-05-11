
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  addCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategories,
  toggleCategory,
  addCategory
}) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Category</h3>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {categories.map((category) => (
          <div key={category} className="flex items-center space-x-2">
            <Checkbox 
              id={`category-${category}`} 
              checked={selectedCategories.includes(category)}
              onCheckedChange={() => toggleCategory(category)}
            />
            <label 
              htmlFor={`category-${category}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {category}
            </label>
          </div>
        ))}
        
        {categories.length === 0 && (
          <div className="text-sm text-muted-foreground py-2">
            No categories available
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;
