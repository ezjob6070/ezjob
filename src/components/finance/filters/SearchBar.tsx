
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { SearchBarProps } from "@/types/finance";

const SearchBar = ({ 
  searchTerm = "", 
  updateFilter, 
  onSearchChange, 
  onChange,
  placeholder = "Search...", 
  className = "",
  hidden = false 
}: SearchBarProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  
  // Update local state when prop changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);
  
  // Handle change and update parent component
  const handleChange = (value: string) => {
    setLocalSearchTerm(value);
    
    // Support different callback patterns
    if (updateFilter) {
      updateFilter("searchTerm", value);
    }
    
    if (onSearchChange) {
      onSearchChange(value);
    }
    
    if (onChange) {
      onChange(value);
    }
  };
  
  if (hidden) {
    return null;
  }
  
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={localSearchTerm}
        onChange={(e) => handleChange(e.target.value)}
        className="pl-8"
      />
    </div>
  );
};

export default SearchBar;
