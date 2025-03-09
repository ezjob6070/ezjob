
import React from "react";
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronDown, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { DateRange } from "react-day-picker";

interface DateRangeSelectorProps {
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ date, setDate }) => {
  const handleDatePresetSelection = (preset: string) => {
    const today = new Date();
    
    switch (preset) {
      case "today":
        setDate({ from: today, to: today });
        break;
      case "yesterday":
        const yesterday = subDays(today, 1);
        setDate({ from: yesterday, to: yesterday });
        break;
      case "this-week":
        setDate({ from: startOfWeek(today, { weekStartsOn: 1 }), to: today });
        break;
      case "last-week":
        const lastWeekStart = startOfWeek(subDays(today, 7), { weekStartsOn: 1 });
        const lastWeekEnd = endOfWeek(subDays(today, 7), { weekStartsOn: 1 });
        setDate({ from: lastWeekStart, to: lastWeekEnd });
        break;
      case "this-month":
        setDate({ from: startOfMonth(today), to: today });
        break;
      case "last-month":
        const lastMonthDate = subDays(startOfMonth(today), 1);
        setDate({ from: startOfMonth(lastMonthDate), to: endOfMonth(lastMonthDate) });
        break;
      case "last-30-days":
        setDate({ from: subDays(today, 30), to: today });
        break;
      case "last-90-days":
        setDate({ from: subDays(today, 90), to: today });
        break;
      case "this-year":
        setDate({ from: startOfYear(today), to: today });
        break;
      case "last-year":
        setDate({ from: startOfYear(subDays(startOfYear(today), 1)), to: endOfYear(subDays(startOfYear(today), 1)) });
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-center space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between px-3 py-5 text-base font-medium"
            >
              <div className="flex flex-col items-center w-full">
                <span className="text-xs font-semibold text-black uppercase mb-1">CUSTOM RANGE</span>
                <div className="flex items-center">
                  <CalendarRange className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <span>
                        {format(date.from, "MMM dd, yyyy")} - {format(date.to, "MMM dd, yyyy")}
                      </span>
                    ) : (
                      format(date.from, "MMM dd, yyyy")
                    )
                  ) : (
                    <span>Select date range</span>
                  )}
                </div>
              </div>
              <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <div className="border-b border-border p-3">
              <div className="flex flex-wrap gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleDatePresetSelection("today")}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleDatePresetSelection("yesterday")}
                >
                  Yesterday
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleDatePresetSelection("this-week")}
                >
                  This Week
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleDatePresetSelection("last-week")}
                >
                  Last Week
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleDatePresetSelection("this-month")}
                >
                  This Month
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleDatePresetSelection("last-month")}
                >
                  Last Month
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleDatePresetSelection("last-30-days")}
                >
                  Last 30 Days
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleDatePresetSelection("last-90-days")}
                >
                  Last 90 Days
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleDatePresetSelection("this-year")}
                >
                  This Year
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleDatePresetSelection("last-year")}
                >
                  Last Year
                </Button>
              </div>
            </div>
            <Calendar
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
    </div>
  );
};

export default DateRangeSelector;
