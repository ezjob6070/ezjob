
import React, { useState } from "react";
import { Search, X, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { 
  Popover, PopoverContent, PopoverTrigger 
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Option {
  id: string;
  name: string;
}

interface MultiSelectDropdownProps {
  options: Option[];
  selected: Option[];
  onChange: (value: Option[]) => void;
  placeholder: string;
  emptyMessage?: string;
  searchPlaceholder?: string;
  className?: string;
  disabled?: boolean;
  maxDisplay?: number;
}

const MultiSelectDropdown = ({
  options,
  selected,
  onChange,
  placeholder,
  emptyMessage = "No results found.",
  searchPlaceholder = "Search...",
  className,
  disabled = false,
  maxDisplay = 3
}: MultiSelectDropdownProps) => {
  const [open, setOpen] = useState(false);
  
  const handleSelect = (option: Option) => {
    if (selected.some(item => item.id === option.id)) {
      onChange(selected.filter(item => item.id !== option.id));
    } else {
      onChange([...selected, option]);
    }
  };
  
  const handleRemove = (option: Option) => {
    onChange(selected.filter(item => item.id !== option.id));
  };
  
  const handleClear = () => {
    onChange([]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
          onClick={() => setOpen(!open)}
        >
          <div className="flex gap-1 flex-wrap items-center">
            {selected.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <>
                {selected.slice(0, maxDisplay).map(option => (
                  <Badge 
                    key={option.id} 
                    variant="secondary"
                    className="mr-1"
                  >
                    {option.name}
                  </Badge>
                ))}
                {selected.length > maxDisplay && (
                  <Badge variant="secondary">+{selected.length - maxDisplay}</Badge>
                )}
              </>
            )}
          </div>
          <X 
            className={cn(
              "ml-2 h-4 w-4 shrink-0 opacity-50", 
              selected.length === 0 ? "hidden" : "block cursor-pointer"
            )}
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup className="max-h-[200px] overflow-auto">
            {options.map((option) => {
              const isSelected = selected.some(item => item.id === option.id);
              return (
                <CommandItem
                  key={option.id}
                  value={option.name}
                  onSelect={() => handleSelect(option)}
                  className="flex items-center justify-between"
                >
                  <span>{option.name}</span>
                  {isSelected && <Check className="ml-auto h-4 w-4" />}
                </CommandItem>
              );
            })}
          </CommandGroup>
          {selected.length > 0 && (
            <div className="border-t p-2">
              <div className="text-xs text-muted-foreground mb-2">
                Selected {selected.length} {selected.length === 1 ? "item" : "items"}
              </div>
              <div className="flex flex-wrap gap-1">
                {selected.map(option => (
                  <Badge 
                    key={option.id} 
                    variant="secondary" 
                    className="flex items-center gap-1"
                  >
                    {option.name}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleRemove(option)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelectDropdown;
