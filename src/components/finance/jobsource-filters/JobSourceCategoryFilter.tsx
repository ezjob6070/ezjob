
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown, Tags } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface JobSourceCategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  addCategory?: (category: string) => void;
}

const JobSourceCategoryFilter: React.FC<JobSourceCategoryFilterProps> = ({
  categories,
  selectedCategories,
  toggleCategory,
  addCategory
}) => {
  const [newCategory, setNewCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      addCategory?.(newCategory.trim());
      setNewCategory("");
    }
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="px-3 py-5 text-base font-medium">
          <Tags className="mr-2 h-4 w-4" />
          <span>
            {selectedCategories.length === 0 ? "All Categories" : 
              selectedCategories.length === 1 ? `${selectedCategories[0]}` :
              `${selectedCategories.length} Categories`}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search-category">Search Categories</Label>
            <Input
              id="search-category"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <ScrollArea className="h-[180px] pr-4">
            <div className="space-y-2">
              {filteredCategories.map(category => (
                <Button
                  key={category}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => toggleCategory(category)}
                >
                  <div className="flex items-center w-full">
                    <div className={`w-4 h-4 rounded-sm border ${selectedCategories.includes(category) ? 'bg-primary border-primary' : 'border-input'} flex items-center justify-center mr-2`}>
                      {selectedCategories.includes(category) && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                    <span>{category}</span>
                  </div>
                </Button>
              ))}
              
              {filteredCategories.length === 0 && (
                <div className="text-center py-2 text-sm text-muted-foreground">
                  No categories match your search
                </div>
              )}
            </div>
          </ScrollArea>
          
          {addCategory && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="new-category">Add New Category</Label>
                <div className="flex space-x-2">
                  <Input
                    id="new-category"
                    placeholder="New category name..."
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddCategory();
                      }
                    }}
                  />
                  <Button onClick={handleAddCategory} type="button">Add</Button>
                </div>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default JobSourceCategoryFilter;
