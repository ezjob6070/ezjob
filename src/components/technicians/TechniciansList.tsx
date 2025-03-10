
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
  const [technicianSearchQuery, setTechnicianSearchQuery] = useState("");
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);
  const [technicianDropdownOpen, setTechnicianDropdownOpen] = useState(false);
  const [technicianFilterQuery, setTechnicianFilterQuery] = useState("");

  // Filter technicians based on technician search query
  const filteredByTechnicianSearch = technicianSearchQuery
    ? technicians.filter(tech => 
        tech.name.toLowerCase().includes(technicianSearchQuery.toLowerCase()) ||
        tech.specialty.toLowerCase().includes(technicianSearchQuery.toLowerCase()) ||
        (tech.email && tech.email.toLowerCase().includes(technicianSearchQuery.toLowerCase())) ||
        (tech.phone && tech.phone.toLowerCase().includes(technicianSearchQuery.toLowerCase()))
      )
    : technicians;

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
          {onAddTechnician && (
            <Button onClick={onAddTechnician} size="sm" className="bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Technician
            </Button>
          )}
        </div>
        
        {onSearchChange && (
          <div className="relative w-full sm:w-96 md:w-[32rem]">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search technicians by name, email, or phone..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        )}
      </div>
      
      {/* Filters section */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Technician selection dropdown */}
        <DropdownMenu open={technicianDropdownOpen} onOpenChange={setTechnicianDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
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
        
        {/* Selected technicians display */}
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
      
      {/* Additional search bar for finding technicians */}
      <div className="bg-muted p-3 rounded-md">
        <h3 className="text-sm font-medium mb-2">Find and Select Technicians</h3>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Find technicians by name, specialty, email or phone..."
            className="pl-10"
            value={technicianSearchQuery}
            onChange={(e) => setTechnicianSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredByTechnicianSearch.map((technician) => (
          <TechnicianCard
            key={technician.id}
            technician={technician}
            onEdit={() => onEditTechnician(technician)}
            isSelected={selectedTechnicians.includes(technician.id)}
            onToggleSelect={() => handleTechnicianToggle(technician.id)}
          />
        ))}
        
        {filteredByTechnicianSearch.length === 0 && (
          <div className="col-span-3 p-4 text-center text-muted-foreground">
            No technicians found. Try adjusting your search or filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default TechniciansList;
