
import React from "react";
import { DateFilterType, DateFilterCategory } from "../FinanceFilterTypes";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import CurrentDateFilters from "./CurrentDateFilters";
import FutureDateFilters from "./FutureDateFilters";
import PastDateFilters from "./PastDateFilters";
import CustomDateFilter from "./CustomDateFilter";

interface DateFilterTabsProps {
  dateCategory: DateFilterCategory;
  setDateCategory: (value: DateFilterCategory) => void;
  dateFilter: DateFilterType;
  customDateRange: { from: Date | undefined; to: Date | undefined };
  handleDateFilterChange: (value: DateFilterType) => void;
  updateFilter: (key: "customDateRange", value: { from: Date | undefined; to: Date | undefined }) => void;
}

const DateFilterTabs: React.FC<DateFilterTabsProps> = ({
  dateCategory,
  setDateCategory,
  dateFilter,
  customDateRange,
  handleDateFilterChange,
  updateFilter,
}) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Date Filters</h3>
      <Tabs value={dateCategory} onValueChange={(v) => setDateCategory(v as DateFilterCategory)}>
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="current">Current</TabsTrigger>
          <TabsTrigger value="future">Future</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>
        <TabsContent value="current" className="pt-4">
          <CurrentDateFilters 
            dateFilter={dateFilter} 
            handleDateFilterChange={handleDateFilterChange} 
          />
        </TabsContent>
        <TabsContent value="future" className="pt-4">
          <FutureDateFilters 
            dateFilter={dateFilter} 
            handleDateFilterChange={handleDateFilterChange} 
          />
        </TabsContent>
        <TabsContent value="past" className="pt-4">
          <PastDateFilters 
            dateFilter={dateFilter} 
            handleDateFilterChange={handleDateFilterChange} 
          />
        </TabsContent>
        <TabsContent value="custom" className="pt-4">
          <CustomDateFilter 
            customDateRange={customDateRange}
            updateFilter={updateFilter}
            handleDateFilterChange={handleDateFilterChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DateFilterTabs;
