
import React from "react";
import { DateFilterType } from "./FinanceFilterTypes";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRange } from "react-day-picker";

interface DateFilterTabsProps {
  selectedFilter: DateFilterType; // Added to match the calling component
  onFilterChange: (filter: DateFilterType) => void;
  customDateRange: { from: Date | undefined; to: Date | undefined };
  onCustomDateChange: (range: DateRange | undefined) => void;
}

const DateFilterTabs: React.FC<DateFilterTabsProps> = ({
  selectedFilter,
  onFilterChange,
  customDateRange,
  onCustomDateChange
}) => {
  return (
    <Tabs value={selectedFilter} onValueChange={(value) => onFilterChange(value as DateFilterType)}>
      <TabsList className="grid grid-cols-4">
        <TabsTrigger value="thisMonth">This Month</TabsTrigger>
        <TabsTrigger value="lastMonth">Last Month</TabsTrigger>
        <TabsTrigger value="thisWeek">This Week</TabsTrigger>
        <TabsTrigger value="custom">Custom</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default DateFilterTabs;
