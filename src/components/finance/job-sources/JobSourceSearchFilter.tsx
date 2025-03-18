
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { JobSource } from "@/types/finance";

interface JobSourceSearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
}

const JobSourceSearchFilter: React.FC<JobSourceSearchFilterProps> = ({
  searchQuery,
  setSearchQuery,
  placeholder = "Search job sources by name, phone, email, website, or category..."
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

export default JobSourceSearchFilter;
