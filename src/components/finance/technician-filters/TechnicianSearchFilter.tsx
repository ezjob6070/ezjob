
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TechnicianSearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const TechnicianSearchFilter: React.FC<TechnicianSearchFilterProps> = ({
  searchQuery,
  setSearchQuery
}) => {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search by name, specialty, email, or phone..."
        className="pl-8"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default TechnicianSearchFilter;
