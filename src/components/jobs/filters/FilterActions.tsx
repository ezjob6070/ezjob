
import { Button } from "@/components/ui/button";

interface FilterActionsProps {
  clearFilters: () => void;
  applyFilters: () => void;
}

const FilterActions = ({ clearFilters, applyFilters }: FilterActionsProps) => {
  return (
    <div className="flex justify-between p-4">
      <Button 
        variant="outline" 
        size="sm"
        onClick={clearFilters}
        className="text-muted-foreground hover:text-primary"
      >
        Clear filters
      </Button>
      <Button 
        size="sm"
        onClick={applyFilters}
        className="font-medium text-primary bg-primary/10 hover:bg-primary/20"
      >
        Apply filters
      </Button>
    </div>
  );
};

export default FilterActions;
