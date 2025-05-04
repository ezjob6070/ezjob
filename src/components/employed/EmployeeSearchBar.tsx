
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface EmployeeSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const EmployeeSearchBar = ({ searchQuery, setSearchQuery }: EmployeeSearchBarProps) => {
  return (
    <div className="relative mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search employees by name, position, department, or email..."
          className="pl-10 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

export default EmployeeSearchBar;
