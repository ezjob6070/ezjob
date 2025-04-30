
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { JOB_CATEGORIES } from "../constants";
import { Badge } from "@/components/ui/badge";

interface ServiceCategoryFilterProps {
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  clearCategories: () => void;
}

export function ServiceCategoryFilter({ 
  selectedCategories, 
  toggleCategory,
  clearCategories
}: ServiceCategoryFilterProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-start w-[240px]">
          <ChevronsUpDown className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="truncate mr-1">
            {selectedCategories.length === 0
              ? "Filter by Category"
              : selectedCategories.length === 1
              ? `Category: ${selectedCategories[0]}`
              : `Categories: ${selectedCategories.length}`}
          </span>
          {selectedCategories.length > 0 && (
            <Badge 
              variant="secondary" 
              className="ml-auto rounded-sm px-1 font-normal"
            >
              {selectedCategories.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search categories..." />
          <CommandList>
            <CommandEmpty>No categories found.</CommandEmpty>
            <CommandGroup>
              {JOB_CATEGORIES.map((category) => {
                const isSelected = selectedCategories.includes(category);
                return (
                  <CommandItem
                    key={category}
                    value={category}
                    onSelect={() => {
                      toggleCategory(category);
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className="h-3 w-3" />
                    </div>
                    <span>{category}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedCategories.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => clearCategories()}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default ServiceCategoryFilter;
