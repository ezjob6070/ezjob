
import React, { useEffect } from "react";
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from "lucide-react";
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
  // Always initialize with today's date
  useEffect(() => {
    if (!date?.from) {
      const today = new Date();
      setDate({ from: today, to: today });
    }
  }, [date, setDate]);

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
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between px-3 py-2 text-base font-medium"
          >
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to && !isSameDay(date.from, date.to) ? (
                  <span>
                    {format(date.from, "MMM dd, yyyy")} - {format(date.to, "MMM dd, yyyy")}
                  </span>
                ) : (
                  <span>Today ({format(date.from, "MMM dd, yyyy")})</span>
                )
              ) : (
                <span>Today</span>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start" side="bottom">
          <div className="p-2 space-y-2">
            <Calendar
              mode="range"
              selected={date}
              onSelect={setDate}
              initialFocus
              numberOfMonths={1}
            />
            <div className="grid grid-cols-1 gap-1 mt-2 border-t pt-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => handleDatePresetSelection("today")}
              >
                Today
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => handleDatePresetSelection("yesterday")}
              >
                Yesterday
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => handleDatePresetSelection("this-week")}
              >
                This Week
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => handleDatePresetSelection("last-week")}
              >
                Last Week
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => handleDatePresetSelection("this-month")}
              >
                This Month
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => handleDatePresetSelection("last-month")}
              >
                Last Month
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => handleDatePresetSelection("last-30-days")}
              >
                Last 30 Days
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => handleDatePresetSelection("last-90-days")}
              >
                Last 90 Days
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => handleDatePresetSelection("this-year")}
              >
                This Year
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => handleDatePresetSelection("last-year")}
              >
                Last Year
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

// Helper function to check if two dates are the same day
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export default DateRangeSelector;
