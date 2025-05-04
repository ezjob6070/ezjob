
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface EmployeeSearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const EmployeeSearchBar: React.FC<EmployeeSearchBarProps> = ({ 
  onSearch,
  placeholder = "Search employees..." 
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full sm:max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-9 pr-12"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button 
        type="submit"
        variant="ghost" 
        size="sm"
        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7"
      >
        Search
      </Button>
    </form>
  );
};

export default EmployeeSearchBar;
