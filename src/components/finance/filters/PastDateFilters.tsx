
import React from "react";
import { Button } from "@/components/ui/button";
import { DateFilterType } from "../FinanceFilterTypes";

interface PastDateFiltersProps {
  dateFilter: DateFilterType;
  handleDateFilterChange: (value: DateFilterType) => void;
}

const PastDateFilters: React.FC<PastDateFiltersProps> = ({
  dateFilter,
  handleDateFilterChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <Button
        variant={dateFilter === "yesterday" ? "default" : "outline"}
        className="justify-start"
        onClick={() => handleDateFilterChange("yesterday")}
      >
        Yesterday
      </Button>
      <Button
        variant={dateFilter === "lastWeek" ? "default" : "outline"}
        className="justify-start"
        onClick={() => handleDateFilterChange("lastWeek")}
      >
        Last Week
      </Button>
      <Button
        variant={dateFilter === "lastMonth" ? "default" : "outline"}
        className="justify-start"
        onClick={() => handleDateFilterChange("lastMonth")}
      >
        Last Month
      </Button>
    </div>
  );
};

export default PastDateFilters;
