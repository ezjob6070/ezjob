
import React from "react";
import { Button } from "@/components/ui/button";
import { DateFilterType } from "../FinanceFilterTypes";

interface CurrentDateFiltersProps {
  dateFilter: DateFilterType;
  handleDateFilterChange: (value: DateFilterType) => void;
}

const CurrentDateFilters: React.FC<CurrentDateFiltersProps> = ({
  dateFilter,
  handleDateFilterChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <Button
        variant={dateFilter === "all" ? "default" : "outline"}
        className="justify-start"
        onClick={() => handleDateFilterChange("all")}
      >
        All Dates
      </Button>
      <Button
        variant={dateFilter === "today" ? "default" : "outline"}
        className="justify-start"
        onClick={() => handleDateFilterChange("today")}
      >
        Today
      </Button>
      <Button
        variant={dateFilter === "thisWeek" ? "default" : "outline"}
        className="justify-start"
        onClick={() => handleDateFilterChange("thisWeek")}
      >
        This Week
      </Button>
      <Button
        variant={dateFilter === "thisMonth" ? "default" : "outline"}
        className="justify-start"
        onClick={() => handleDateFilterChange("thisMonth")}
      >
        This Month
      </Button>
    </div>
  );
};

export default CurrentDateFilters;
