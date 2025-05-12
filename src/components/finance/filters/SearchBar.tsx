
import React from "react";
import { Input } from "@/components/ui/input";
import { Search, Phone, Mail, User } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showIcons?: boolean;
  hidden?: boolean;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  showIcons = true,
  hidden = false,
  placeholder = "Search...",
  className = ""
}) => {
  if (hidden) return null;
  
  return (
    <div className={`w-full relative ${className}`}>
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        placeholder={placeholder}
        className={`w-full pl-10 ${showIcons ? 'pr-10' : 'pr-4'}`}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {showIcons && (
        <div className="absolute inset-y-0 right-3 flex items-center space-x-1 text-muted-foreground">
          <User className="h-3 w-3" />
          <Mail className="h-3 w-3" />
          <Phone className="h-3 w-3" />
        </div>
      )}
    </div>
  );
};

export default SearchBar;
