
import React from "react";
import { Button } from "@/components/ui/button";
import { DateFilterType } from "../FinanceFilterTypes";

interface FutureDateFiltersProps {
  dateFilter: DateFilterType;
  handleDateFilterChange: (value: DateFilterType) => void;
}

const FutureDateFilters: React.FC<FutureDateFiltersProps> = ({
  dateFilter,
  handleDateFilterChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <Button
        variant={dateFilter === "tomorrow" ? "default" : "outline"}
        className="justify-start"
        onClick={() => handleDateFilterChange("tomorrow")}
      >
        Tomorrow
      </Button>
      <Button
        variant={dateFilter === "nextWeek" ? "default" : "outline"}
        className="justify-start"
        onClick={() => handleDateFilterChange("nextWeek")}
      >
        Next Week
      </Button>
      <Button
        variant={dateFilter === "nextMonth" ? "default" : "outline"}
        className="justify-start"
        onClick={() => handleDateFilterChange("nextMonth")}
      >
        Next Month
      </Button>
    </div>
  );
};

export default FutureDateFilters;
