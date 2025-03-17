
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
  const selectedLabel = dateFilters.find(f => f.value === selectedDateFilter)?.label || "All Dates";
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {selectedLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
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
