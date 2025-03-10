
import React, { useState } from "react";
import TechnicianCard from "./TechnicianCard";
import { Technician } from "@/types/technician";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Check, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
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
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);
  const [technicianDropdownOpen, setTechnicianDropdownOpen] = useState(false);
  const [technicianFilterQuery, setTechnicianFilterQuery] = useState("");

  // Filter technicians for the dropdown based on filter query
  const filteredTechniciansForDropdown = technicians.filter(tech => 
    !technicianFilterQuery || 
    tech.name.toLowerCase().includes(technicianFilterQuery.toLowerCase()) ||
    (tech.email && tech.email.toLowerCase().includes(technicianFilterQuery.toLowerCase())) ||
    (tech.phone && tech.phone.toLowerCase().includes(technicianFilterQuery.toLowerCase()))
  );

  const handleTechnicianToggle = (technicianId: string) => {
    setSelectedTechnicians(prev => {
      if (prev.includes(technicianId)) {
        return prev.filter(id => id !== technicianId);
      } else {
        return [...prev, technicianId];
      }
    });
  };

  const clearSelectedTechnicians = () => {
    setSelectedTechnicians([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-col sm:flex-row gap-3">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold">All Technicians</h2>
        </div>
        
        <div className="flex items-center gap-3">
          {onSearchChange && (
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search technicians by name, email, or phone..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          )}
          
          {onAddTechnician && (
            <Button onClick={onAddTechnician} size="sm" className="bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Technician
            </Button>
          )}
        </div>
      </div>
      
      {/* Filters section - updated layout */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg">
        {/* Filters on the left */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Technician selection dropdown */}
          <DropdownMenu open={technicianDropdownOpen} onOpenChange={setTechnicianDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 h-10">
                <UserCheck className="h-4 w-4" />
                {selectedTechnicians.length === 0 
                  ? "Select Technicians" 
                  : `${selectedTechnicians.length} Selected`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-2" align="start">
              <div className="mb-2">
                <Input
                  placeholder="Find technician..."
                  className="w-full"
                  value={technicianFilterQuery}
                  onChange={(e) => setTechnicianFilterQuery(e.target.value)}
                />
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredTechniciansForDropdown.map((tech) => (
                  <DropdownMenuCheckboxItem
                    key={tech.id}
                    checked={selectedTechnicians.includes(tech.id)}
                    onCheckedChange={() => handleTechnicianToggle(tech.id)}
                  >
                    {tech.name}
                  </DropdownMenuCheckboxItem>
                ))}
                {filteredTechniciansForDropdown.length === 0 && (
                  <div className="py-2 px-2 text-sm text-gray-500">No technicians found</div>
                )}
              </div>
              {selectedTechnicians.length > 0 && (
                <div className="pt-2 mt-2 border-t border-gray-200">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-center text-xs"
                    onClick={clearSelectedTechnicians}
                  >
                    Clear selection
                  </Button>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Selected technicians display */}
        <div className="flex flex-wrap gap-1">
          {selectedTechnicians.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selectedTechnicians.map(techId => {
                const tech = technicians.find(t => t.id === techId);
                return tech ? (
                  <Badge 
                    key={tech.id} 
                    variant="secondary" 
                    className="flex items-center gap-1 px-2 py-1"
                  >
                    {tech.name}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-4 w-4 p-0 ml-1" 
                      onClick={() => handleTechnicianToggle(tech.id)}
                    >
                      <span className="sr-only">Remove</span>
                      ×
                    </Button>
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {technicians.map((technician) => (
          <TechnicianCard
            key={technician.id}
            technician={technician}
            onEdit={() => onEditTechnician(technician)}
            isSelected={selectedTechnicians.includes(technician.id)}
            onToggleSelect={() => handleTechnicianToggle(technician.id)}
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
