
import { Input } from "@/components/ui/input";
import { Search, ArrowDownAZ, CalendarDays, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchInputProps {
  searchTerm: string;
  updateFilter: (key: string, value: string) => void;
  sortOrder?: string;
  onSortChange?: (sortOrder: string) => void;
}

const SearchInput = ({ searchTerm, updateFilter, sortOrder, onSortChange }: SearchInputProps) => {
  return (
    <div className="relative flex-1 min-w-[200px]">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search jobs..."
        className="pl-8 pr-24"
        value={searchTerm}
        onChange={(e) => updateFilter("searchTerm", e.target.value)}
      />
      {onSortChange && (
        <div className="absolute inset-y-0 right-3 flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0" 
            title="Sort A-Z"
            onClick={() => onSortChange("name")}
          >
            <ArrowDownAZ className={`h-4 w-4 ${sortOrder === 'name' ? 'text-blue-600' : 'text-muted-foreground'}`} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0" 
            title="Sort by Date"
            onClick={() => onSortChange("date")}
          >
            <CalendarDays className={`h-4 w-4 ${sortOrder === 'date' ? 'text-blue-600' : 'text-muted-foreground'}`} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0" 
            title="Filter Options"
            onClick={() => onSortChange("filter")}
          >
            <Filter className={`h-4 w-4 ${sortOrder === 'filter' ? 'text-blue-600' : 'text-muted-foreground'}`} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
