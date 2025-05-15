
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SearchBarProps {
  searchTerm: string;
  onChange: (value: string) => void;
  hidden?: boolean;
}

const SearchBar = ({ searchTerm, onChange, hidden = false }: SearchBarProps) => {
  if (hidden) return null;
  
  return (
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search..."
        className="pl-8 pr-10"
        value={searchTerm}
        onChange={(e) => onChange(e.target.value)}
      />
      {searchTerm && (
        <Button
          variant="ghost"
          className="absolute right-0 top-0 h-9 w-9 p-0"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );
};

export default SearchBar;
