
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";

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
  
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Dashboard Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          <div className="mb-4 md:mb-0">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto justify-start flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDateRange()}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
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
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setDate({
              from: new Date(),
              to: addDays(new Date(), 7)
            })}>
              This Week
            </Button>
            <Button variant="outline" onClick={() => setDate({
              from: addDays(new Date(), 7),
              to: addDays(new Date(), 14)
            })}>
              Next Week
            </Button>
            <Button variant="outline" onClick={() => setDate({
              from: addDays(new Date(), -7),
              to: new Date()
            })}>
              Last Week
            </Button>
          </div>
        </div>
        
        <div className="mt-2">
          <Calendar
            mode="range"
            selected={date}
            onSelect={setDate}
            className={cn("p-0 pointer-events-auto flex justify-center")}
            numberOfMonths={1}
            showOutsideDays={false}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCalendar;
