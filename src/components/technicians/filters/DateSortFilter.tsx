
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { CalendarSort } from "lucide-react";

type SortOption = "none" | "newest" | "oldest";

interface DateSortFilterProps {
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

const DateSortFilter: React.FC<DateSortFilterProps> = ({ 
  sortOption, 
  onSortChange 
}) => {
  return (
    <Select value={sortOption} onValueChange={(value) => onSortChange(value as SortOption)}>
      <SelectTrigger className="w-[180px]">
        <CalendarSort className="h-4 w-4 mr-2" />
        <SelectValue placeholder="Sort by date" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">No date sorting</SelectItem>
        <SelectItem value="newest">Newest first</SelectItem>
        <SelectItem value="oldest">Oldest first</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default DateSortFilter;
