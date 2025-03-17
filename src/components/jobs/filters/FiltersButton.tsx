
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface FiltersButtonProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

const FiltersButton = ({ showFilters, setShowFilters }: FiltersButtonProps) => {
  return (
    <Button 
      variant="outline" 
      onClick={() => setShowFilters(!showFilters)}
      className="gap-2"
    >
      <Filter className="h-4 w-4" />
      Filters
    </Button>
  );
};

export default FiltersButton;
