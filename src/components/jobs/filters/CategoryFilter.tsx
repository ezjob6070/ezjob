
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { JOB_CATEGORIES } from "../constants";
import { Check, ChevronDown, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string[];
  toggleCategory: (category: string) => void;
  addCategory: (category: string) => void;
}

const CategoryFilter = ({ 
  selectedCategory, 
  toggleCategory,
  categories = JOB_CATEGORIES,
  addCategory
}: CategoryFilterProps) => {
  // Format the display text for the dropdown trigger
  const getSelectedCategoryText = () => {
    if (selectedCategory.includes("All Categories") || selectedCategory.length === 0) {
      return "All Categories";
    } 
    
    if (selectedCategory.length === 1) {
      return selectedCategory[0];
    }
    
    return `${selectedCategory.length} Categories`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full md:w-[200px]">
          <Tag className="mr-2 h-4 w-4" />
          <span className="flex-1 text-left">{getSelectedCategoryText()}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <ScrollArea className="h-[300px]">
          {categories.map((category) => (
            <DropdownMenuCheckboxItem
              key={category}
              checked={selectedCategory.includes(category)}
              onCheckedChange={() => toggleCategory(category)}
            >
              <div className="flex items-center">
                {selectedCategory.includes(category) && (
                  <Badge variant="outline" className="mr-1 h-1 w-1 rounded-full bg-primary p-1" />
                )}
                <span>{category}</span>
              </div>
            </DropdownMenuCheckboxItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoryFilter;
