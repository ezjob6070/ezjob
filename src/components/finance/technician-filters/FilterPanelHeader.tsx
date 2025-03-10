
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterPanelHeaderProps {
  title: string;
  clearFilters: () => void;
  setShowFilters?: (show: boolean) => void;
}

const FilterPanelHeader: React.FC<FilterPanelHeaderProps> = ({
  title,
  clearFilters,
  setShowFilters
}) => {
  return (
    <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8">
          Clear all
        </Button>
        {setShowFilters && (
          <Button variant="outline" size="icon" onClick={() => setShowFilters(false)} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default FilterPanelHeader;
