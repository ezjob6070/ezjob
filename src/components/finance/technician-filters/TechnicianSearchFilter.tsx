
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TechnicianSearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
}

const TechnicianSearchFilter: React.FC<TechnicianSearchFilterProps> = ({
  searchQuery,
  setSearchQuery,
  placeholder = "Search technicians by name, skills, or specialization..."
}) => {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        className="pl-8"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default TechnicianSearchFilter;
