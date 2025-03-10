
import React from "react";
import { Input } from "@/components/ui/input";

interface TechnicianSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const TechnicianSearchBar: React.FC<TechnicianSearchBarProps> = ({
  searchQuery,
  onSearchChange
}) => {
  return (
    <div className="w-full">
      <Input
        placeholder="Search technicians by name, email, or phone..."
        className="w-full"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default TechnicianSearchBar;
