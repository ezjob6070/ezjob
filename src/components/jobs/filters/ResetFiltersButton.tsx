
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ResetFiltersButtonProps {
  resetFilters: () => void;
}

const ResetFiltersButton = ({ resetFilters }: ResetFiltersButtonProps) => {
  return (
    <Button variant="outline" size="sm" onClick={resetFilters} className="gap-2">
      <X className="h-4 w-4" />
      Reset Filters
    </Button>
  );
};

export default ResetFiltersButton;
