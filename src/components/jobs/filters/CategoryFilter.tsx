
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string[];
  toggleCategory: (category: string) => void;
  addCategory: (category: string) => void;
}

const CategoryFilter = ({
  categories,
  selectedCategory,
  toggleCategory,
  addCategory
}: CategoryFilterProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [newCategory, setNewCategory] = useState("");
  
  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setNewCategory("");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-medium">Category Filter</h3>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search categories..." 
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <ScrollArea className="h-60 pr-4">
        <div className="space-y-1">
          {filteredCategories.map((category) => (
            <div key={category} className="flex items-center">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategory.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <Label
                htmlFor={`category-${category}`}
                className="text-sm ml-2"
              >
                {category}
              </Label>
            </div>
          ))}
          
          {filteredCategories.length === 0 && (
            <p className="text-sm text-muted-foreground py-2">
              No categories found
            </p>
          )}
        </div>
      </ScrollArea>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Add New Category</h4>
        <div className="flex space-x-2">
          <Input
            placeholder="New category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1"
          />
          <Button size="sm" onClick={handleAddCategory} disabled={!newCategory.trim()}>
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
