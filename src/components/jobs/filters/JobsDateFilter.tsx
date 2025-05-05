
import React from "react";
import { format, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface JobsDateFilterProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}

const JobsDateFilter: React.FC<JobsDateFilterProps> = ({ date, setDate }) => {
  const today = new Date();
  
  const selectDatePreset = (preset: string) => {
    switch (preset) {
      case "today":
        setDate({ from: today, to: today });
        break;
      case "yesterday":
        const yesterday = subDays(today, 1);
        setDate({ from: yesterday, to: yesterday });
        break;
      case "thisWeek":
        setDate({
          from: startOfWeek(today, { weekStartsOn: 1 }),
          to: today
        });
        break;
      case "lastWeek":
        const lastWeekStart = startOfWeek(subDays(today, 7), { weekStartsOn: 1 });
        const lastWeekEnd = endOfWeek(subDays(today, 7), { weekStartsOn: 1 });
        setDate({ from: lastWeekStart, to: lastWeekEnd });
        break;
      case "thisMonth":
        setDate({
          from: startOfMonth(today),
          to: today
        });
        break;
      case "lastMonth":
        const lastMonth = subDays(startOfMonth(today), 1);
        const lastMonthStart = startOfMonth(lastMonth);
        const lastMonthEnd = endOfMonth(lastMonth);
        setDate({ from: lastMonthStart, to: lastMonthEnd });
        break;
      case "last7Days":
        setDate({ from: subDays(today, 6), to: today });
        break;
      case "last30Days":
        setDate({ from: subDays(today, 29), to: today });
        break;
      case "nextWeek":
        const nextWeekStart = addDays(endOfWeek(today, { weekStartsOn: 1 }), 1);
        const nextWeekEnd = addDays(nextWeekStart, 6);
        setDate({ from: nextWeekStart, to: nextWeekEnd });
        break;
      case "nextMonth":
        const nextMonthStart = addDays(endOfMonth(today), 1);
        const nextMonthEnd = endOfMonth(nextMonthStart);
        setDate({ from: nextMonthStart, to: nextMonthEnd });
        break;
      case "all":
        setDate(undefined);
        break;
    }
  };

  return (
    <div className="p-3">
      <Tabs defaultValue="quick">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="quick">Quick Select</TabsTrigger>
          <TabsTrigger value="custom">Calendar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="quick" className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Current</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="justify-start text-xs h-8"
                onClick={() => selectDatePreset("all")}
              >
                All Time
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="justify-start text-xs h-8"
                onClick={() => selectDatePreset("today")}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="justify-start text-xs h-8"
                onClick={() => selectDatePreset("thisWeek")}
              >
                This Week
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="justify-start text-xs h-8"
                onClick={() => selectDatePreset("thisMonth")}
              >
                This Month
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Past</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="justify-start text-xs h-8"
                onClick={() => selectDatePreset("yesterday")}
              >
                Yesterday
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="justify-start text-xs h-8"
                onClick={() => selectDatePreset("lastWeek")}
              >
                Last Week
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="justify-start text-xs h-8"
                onClick={() => selectDatePreset("last7Days")}
              >
                Last 7 Days
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="justify-start text-xs h-8"
                onClick={() => selectDatePreset("last30Days")}
              >
                Last 30 Days
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="justify-start text-xs h-8"
                onClick={() => selectDatePreset("lastMonth")}
              >
                Last Month
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Future</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="justify-start text-xs h-8"
                onClick={() => selectDatePreset("nextWeek")}
              >
                Next Week
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="justify-start text-xs h-8"
                onClick={() => selectDatePreset("nextMonth")}
              >
                Next Month
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="custom">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            className="pointer-events-auto"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobsDateFilter;
