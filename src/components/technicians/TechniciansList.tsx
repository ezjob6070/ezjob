
import React from "react";
import TechnicianCard from "./TechnicianCard";
import { Technician } from "@/types/technician";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TechniciansListProps {
  technicians: Technician[];
  onEditTechnician: (technician: Technician) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  selectedCategories?: string[];
  selectedStatus?: string;
  onCategoryChange?: (categories: string[]) => void;
  onStatusChange?: (status: string) => void;
}

const TechniciansList: React.FC<TechniciansListProps> = ({ 
  technicians, 
  onEditTechnician,
  searchQuery = "",
  onSearchChange,
  selectedCategories = [],
  selectedStatus = "all",
  onCategoryChange,
  onStatusChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-col sm:flex-row gap-3">
        <h2 className="text-xl font-semibold">All Technicians</h2>
        
        {onSearchChange && (
          <div className="relative w-full sm:w-80 md:w-96">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, phone, specialty..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {technicians.map((technician) => (
          <TechnicianCard
            key={technician.id}
            technician={technician}
            onEdit={() => onEditTechnician(technician)}
          />
        ))}
        
        {technicians.length === 0 && (
          <div className="col-span-3 p-4 text-center text-muted-foreground">
            No technicians found. Try adjusting your search or filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default TechniciansList;
