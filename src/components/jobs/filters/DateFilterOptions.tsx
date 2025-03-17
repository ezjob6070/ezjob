
import { Button } from "@/components/ui/button";
import { DateFilterType } from "../JobFilterTypes";

interface DateFilterOptionsProps {
  dateFilter: DateFilterType;
  handleDateFilterChange: (value: DateFilterType) => void;
}

const DateFilterOptions = ({ 
  dateFilter, 
  handleDateFilterChange 
}: DateFilterOptionsProps) => {
  return (
    <div className="p-2 space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Button 
            variant={dateFilter === "all" ? "default" : "outline"} 
            className="w-full justify-start"
            onClick={() => handleDateFilterChange("all")}
          >
            All Dates
          </Button>
          <Button 
            variant={dateFilter === "today" ? "default" : "outline"} 
            className="w-full justify-start"
            onClick={() => handleDateFilterChange("today")}
          >
            Today
          </Button>
          <Button 
            variant={dateFilter === "tomorrow" ? "default" : "outline"} 
            className="w-full justify-start"
            onClick={() => handleDateFilterChange("tomorrow")}
          >
            Tomorrow
          </Button>
          <Button 
            variant={dateFilter === "thisWeek" ? "default" : "outline"} 
            className="w-full justify-start"
            onClick={() => handleDateFilterChange("thisWeek")}
          >
            This Week
          </Button>
          <Button 
            variant={dateFilter === "nextWeek" ? "default" : "outline"} 
            className="w-full justify-start"
            onClick={() => handleDateFilterChange("nextWeek")}
          >
            Next Week
          </Button>
          <Button 
            variant={dateFilter === "thisMonth" ? "default" : "outline"} 
            className="w-full justify-start"
            onClick={() => handleDateFilterChange("thisMonth")}
          >
            This Month
          </Button>
        </div>
        <div className="space-y-2">
          <Button 
            variant={dateFilter === "yesterday" ? "default" : "outline"} 
            className="w-full justify-start"
            onClick={() => handleDateFilterChange("yesterday")}
          >
            Yesterday
          </Button>
          <Button 
            variant={dateFilter === "lastWeek" ? "default" : "outline"} 
            className="w-full justify-start"
            onClick={() => handleDateFilterChange("lastWeek")}
          >
            Last Week
          </Button>
          <Button 
            variant={dateFilter === "lastMonth" ? "default" : "outline"} 
            className="w-full justify-start"
            onClick={() => handleDateFilterChange("lastMonth")}
          >
            Last Month
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DateFilterOptions;
