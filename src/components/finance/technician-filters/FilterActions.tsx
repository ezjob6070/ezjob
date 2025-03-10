
import React from "react";
import { Button } from "@/components/ui/button";

interface FilterActionsProps {
  applyFilters: () => void;
}

const FilterActions: React.FC<FilterActionsProps> = ({
  applyFilters
}) => {
  return (
    <div className="flex justify-end mt-6">
      <Button size="sm" onClick={applyFilters}>
        Apply Filters
      </Button>
    </div>
  );
};

export default FilterActions;
