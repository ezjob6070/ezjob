
import React, { useState } from "react";
import TechnicianCard from "./TechnicianCard";
import { Technician } from "@/types/technician";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Filter, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface TechniciansListProps {
  technicians: Technician[];
  onEditTechnician: (technician: Technician) => void;
  onAddTechnician?: () => void;
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
  onAddTechnician,
  searchQuery = "",
  onSearchChange,
  selectedCategories = [],
  selectedStatus = "all",
  onCategoryChange,
  onStatusChange
}) => {
  const [searchFilter, setSearchFilter] = useState<'all' | 'name' | 'specialty' | 'email' | 'phone'>('all');
  const [markedTechnicians, setMarkedTechnicians] = useState<string[]>([]);

  const handleMarkTechnician = (techId: string) => {
    setMarkedTechnicians(prev => {
      if (prev.includes(techId)) {
        return prev.filter(id => id !== techId);
      } else {
        return [...prev, techId];
      }
    });
  };

  const clearMarked = () => {
    setMarkedTechnicians([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-col sm:flex-row gap-3">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold">All Technicians</h2>
          {onAddTechnician && (
            <Button onClick={onAddTechnician} size="sm" className="bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Technician
            </Button>
          )}
        </div>
        
        {onSearchChange && (
          <div className="relative w-full sm:w-96 md:w-[32rem] flex items-center">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={`Search by ${searchFilter === 'all' ? 'any field' : searchFilter}...`}
              className="pl-10 pr-28"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <div className="absolute right-2 flex items-center space-x-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 p-1 px-2">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuCheckboxItem
                    checked={searchFilter === 'all'}
                    onCheckedChange={() => setSearchFilter('all')}
                  >
                    All Fields
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={searchFilter === 'name'}
                    onCheckedChange={() => setSearchFilter('name')}
                  >
                    Name
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={searchFilter === 'specialty'}
                    onCheckedChange={() => setSearchFilter('specialty')}
                  >
                    Specialty
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={searchFilter === 'email'}
                    onCheckedChange={() => setSearchFilter('email')}
                  >
                    Email
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={searchFilter === 'phone'}
                    onCheckedChange={() => setSearchFilter('phone')}
                  >
                    Phone
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </div>

      {markedTechnicians.length > 0 && (
        <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
          <span className="text-sm font-medium">{markedTechnicians.length} technicians marked</span>
          <div className="flex-1 overflow-x-auto flex gap-1">
            {markedTechnicians.map(id => {
              const tech = technicians.find(t => t.id === id);
              return tech ? (
                <Badge key={id} variant="outline" className="flex items-center gap-1">
                  {tech.name}
                  <button onClick={() => handleMarkTechnician(id)} className="h-4 w-4 flex items-center justify-center">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ) : null;
            })}
          </div>
          <Button variant="outline" size="sm" onClick={clearMarked}>
            Clear All
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {technicians.map((technician) => (
          <TechnicianCard
            key={technician.id}
            technician={technician}
            onEdit={() => onEditTechnician(technician)}
            isMarked={markedTechnicians.includes(technician.id)}
            onMark={() => handleMarkTechnician(technician.id)}
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
