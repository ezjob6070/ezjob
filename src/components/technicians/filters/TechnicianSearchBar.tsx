
import React from "react";
import { Input } from "@/components/ui/input";
import { Search, Phone, Mail, User } from "lucide-react";

interface TechnicianSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showIcons?: boolean;
}

const TechnicianSearchBar: React.FC<TechnicianSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  showIcons = true
}) => {
  return (
    <div className="w-full relative">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        placeholder="Search by name, email, phone, or specialty..."
        className={`w-full pl-10 ${showIcons ? 'pr-10' : 'pr-4'}`}
        value={searchQuery}
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

export default TechnicianSearchBar;
