
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FinanceFilters } from "../FinanceFilterTypes";

interface SearchBarProps {
  searchTerm: string;
  updateFilter: <K extends keyof FinanceFilters>(key: K, value: FinanceFilters[K]) => void;
  hidden?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, updateFilter, hidden = false }) => {
  if (hidden) return null;
  
  return (
    <div className="relative flex-1 min-w-[200px]">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search transactions..."
        className="pl-8"
        value={searchTerm}
        onChange={(e) => updateFilter("searchTerm", e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
