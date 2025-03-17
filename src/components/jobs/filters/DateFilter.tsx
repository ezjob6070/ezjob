
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { DateFilterType } from "../JobFilterTypes";
import DateFilterOptions from "./DateFilterOptions";
import { format } from "date-fns";

interface DateFilterProps {
  dateFilter: DateFilterType;
  customDateRange: { from: Date | undefined; to: Date | undefined };
  updateFilter: (key: string, value: any) => void;
  handleDateFilterChange: (value: DateFilterType) => void;
  getDateFilterLabel: () => string;
}

const DateFilter = ({ 
  dateFilter, 
  customDateRange,
  updateFilter,
  handleDateFilterChange,
  getDateFilterLabel 
}: DateFilterProps) => {
  const [openCalendar, setOpenCalendar] = useState(false);

  return (
    <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          {getDateFilterLabel()}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start" side="bottom">
        <Tabs defaultValue="preset" className="w-full">
          <TabsList className="grid grid-cols-1 mb-2">
            <TabsTrigger value="preset">Date Options</TabsTrigger>
          </TabsList>
          <TabsContent value="preset" className="space-y-2">
            <DateFilterOptions
              dateFilter={dateFilter}
              handleDateFilterChange={handleDateFilterChange}
            />
            <div className="pt-4 px-2 pb-2">
              <CalendarComponent
                mode="single"
                selected={customDateRange.from}
                onSelect={(date) => {
                  if (date) {
                    updateFilter("customDateRange", { from: date, to: date });
                    handleDateFilterChange("custom");
                  }
                }}
                className="rounded-md border"
              />
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default DateFilter;
