
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format, addDays } from "date-fns";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DashboardCalendarProps {
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

const DashboardCalendar: React.FC<DashboardCalendarProps> = ({ date, setDate }) => {
  // Format the date range for display
  const formatDateRange = () => {
    if (!date?.from) return "Select date range";
    
    if (date.to) {
      return `${format(date.from, "MMM d, yyyy")} - ${format(date.to, "MMM d, yyyy")}`;
    }
    
    return format(date.from, "MMMM d, yyyy");
  };

  const handlePresetChange = (value: string) => {
    const today = new Date();
    
    switch (value) {
      case "today":
        setDate({ from: today, to: today });
        break;
      case "yesterday":
        const yesterday = addDays(today, -1);
        setDate({ from: yesterday, to: yesterday });
        break;
      case "thisWeek":
        setDate({ from: new Date(), to: addDays(new Date(), 7) });
        break;
      case "nextWeek":
        setDate({ from: addDays(new Date(), 7), to: addDays(new Date(), 14) });
        break;
      case "lastWeek":
        setDate({ from: addDays(new Date(), -7), to: new Date() });
        break;
      case "thisMonth":
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        setDate({ from: firstDay, to: lastDay });
        break;
      case "lastMonth":
        const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        setDate({ from: firstDayLastMonth, to: lastDayLastMonth });
        break;
    }
  };
  
  return (
    <div className="flex items-center space-x-4 p-2 mb-4 bg-white rounded-lg shadow-sm">
      <Select onValueChange={handlePresetChange} defaultValue="thisWeek">
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Time period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="yesterday">Yesterday</SelectItem>
          <SelectItem value="thisWeek">This Week</SelectItem>
          <SelectItem value="nextWeek">Next Week</SelectItem>
          <SelectItem value="lastWeek">Last Week</SelectItem>
          <SelectItem value="thisMonth">This Month</SelectItem>
          <SelectItem value="lastMonth">Last Month</SelectItem>
        </SelectContent>
      </Select>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDateRange()}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DashboardCalendar;
