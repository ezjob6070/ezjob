
import React from "react";
import { SortOption } from "@/hooks/useTechniciansData";

interface TechnicianFinancialFilterBarProps {
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

const TechnicianFinancialFilterBar: React.FC<TechnicianFinancialFilterBarProps> = ({
  sortOption,
  onSortChange
}) => {
  return (
    <div className="flex justify-between items-center px-4 py-2 border-b">
      <div className="text-sm text-muted-foreground">
        Filter and sort technicians
      </div>
    </div>
  );
};

export default TechnicianFinancialFilterBar;
