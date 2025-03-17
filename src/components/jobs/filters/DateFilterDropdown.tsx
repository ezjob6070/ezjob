
import { Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export interface DateFilter {
  label: string;
  value: string;
}

interface DateFilterDropdownProps {
  selectedDateFilter: string;
  dateFilters: DateFilter[];
  onDateFilterChange: (value: string) => void;
}

const DateFilterDropdown = ({ 
  selectedDateFilter, 
  dateFilters, 
  onDateFilterChange 
}: DateFilterDropdownProps) => {
  // Find the selected filter label based on the current value
  const selectedLabel = dateFilters.find(filter => filter.value === selectedDateFilter)?.label || "Today";
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {selectedLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom" className="z-50">
        {dateFilters.map((filter) => (
          <DropdownMenuItem 
            key={filter.value}
            onClick={() => onDateFilterChange(filter.value)}
            className={selectedDateFilter === filter.value ? "bg-accent" : ""}
          >
            {filter.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DateFilterDropdown;
