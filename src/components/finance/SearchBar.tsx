
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export interface SearchBarProps {
  searchTerm: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  hidden?: boolean;
  updateFilter?: <K extends string>(key: K, value: any) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = "Search...",
  className = "",
  hidden = false,
  updateFilter
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearchChange) {
      onSearchChange(e);
    }
    
    if (updateFilter) {
      updateFilter('searchTerm', e.target.value);
    }
  };
  
  if (hidden) return null;
  
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        className="pl-8"
      />
    </div>
  );
};

export default SearchBar;
