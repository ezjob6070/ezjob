
import React from "react";
import { Input } from "@/components/ui/input";
import { Search, User, Mail, Phone, ArrowDownAZ, CalendarDays, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showIcons?: boolean;
  hidden?: boolean;
  placeholder?: string;
  className?: string;
  sortOrder?: string;
  onSortChange?: (sortOrder: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  showIcons = true,
  hidden = false,
  placeholder = "Search by name, phone, email...",
  className = "",
  sortOrder,
  onSortChange
}) => {
  if (hidden) return null;
  
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        placeholder={placeholder}
        className={`w-full pl-10 ${showIcons || onSortChange ? 'pr-24' : 'pr-4'}`}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className="absolute inset-y-0 right-3 flex items-center space-x-2">
        {onSortChange && (
          <>
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
              title="Filter"
              onClick={() => onSortChange("filter")}
            >
              <Filter className={`h-4 w-4 ${sortOrder === 'filter' ? 'text-blue-600' : 'text-muted-foreground'}`} />
            </Button>
          </>
        )}
        {showIcons && !onSortChange && (
          <>
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
          </>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
