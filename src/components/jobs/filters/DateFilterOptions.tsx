
import { Button } from "@/components/ui/button";
import { DateFilter } from "./filterConstants";

interface DateFilterOptionsProps {
  dateFilter: string;
  handleDateFilterChange: (value: string) => void;
  dateFilters: DateFilter[];
}

const DateFilterOptions = ({ 
  dateFilter, 
  handleDateFilterChange,
  dateFilters
}: DateFilterOptionsProps) => {
  return (
    <div className="p-2 space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {dateFilters.map((filter) => (
          <Button 
            key={filter.value}
            variant={dateFilter === filter.value ? "default" : "outline"} 
            className="w-full justify-start"
            onClick={() => handleDateFilterChange(filter.value)}
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DateFilterOptions;
