
import React from "react";
import { Button } from "@/components/ui/button";
import { UserCheck, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Technician } from "@/types/technician";

interface TechnicianSelectDropdownProps {
  technicians: Technician[];
  selectedTechnicians: string[];
  onTechnicianToggle: (technicianId: string) => void;
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
}

const TechnicianSelectDropdown: React.FC<TechnicianSelectDropdownProps> = ({
  technicians,
  selectedTechnicians,
  onTechnicianToggle,
  dropdownOpen,
  setDropdownOpen,
}) => {
  const [technicianFilterQuery, setTechnicianFilterQuery] = React.useState("");

  // Filter technicians for the dropdown based on filter query
  const filteredTechniciansForDropdown = technicians.filter(tech => 
    !technicianFilterQuery || 
    tech.name.toLowerCase().includes(technicianFilterQuery.toLowerCase()) ||
    (tech.email && tech.email.toLowerCase().includes(technicianFilterQuery.toLowerCase())) ||
    (tech.phone && tech.phone.toLowerCase().includes(technicianFilterQuery.toLowerCase()))
  );
  
  const clearSelectedTechnicians = () => {
    selectedTechnicians.forEach(id => onTechnicianToggle(id));
  };

  const selectAllFilteredTechnicians = () => {
    filteredTechniciansForDropdown.forEach(tech => {
      if (!selectedTechnicians.includes(tech.id)) {
        onTechnicianToggle(tech.id);
      }
    });
  };

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
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
        <div className="flex justify-between mb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs px-2"
            onClick={selectAllFilteredTechnicians}
          >
            Select all
          </Button>
          {selectedTechnicians.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs px-2"
              onClick={clearSelectedTechnicians}
            >
              Clear all
            </Button>
          )}
        </div>
        <DropdownMenuSeparator className="my-1" />
        <div className="max-h-60 overflow-y-auto space-y-1 py-1">
          {filteredTechniciansForDropdown.map((tech) => (
            <div key={tech.id} className="flex items-center space-x-2 px-2 py-1.5 hover:bg-muted rounded-sm cursor-pointer" onClick={() => onTechnicianToggle(tech.id)}>
              <div className="flex items-center justify-center">
                <RadioGroupItem 
                  value={tech.id} 
                  id={`tech-radio-${tech.id}`}
                  checked={selectedTechnicians.includes(tech.id)}
                  className="data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />
              </div>
              <label 
                htmlFor={`tech-radio-${tech.id}`}
                className="text-sm font-medium leading-none cursor-pointer flex-1"
              >
                {tech.name}
              </label>
            </div>
          ))}
          {filteredTechniciansForDropdown.length === 0 && (
            <div className="py-2 px-2 text-sm text-gray-500">No technicians found</div>
          )}
        </div>
        {selectedTechnicians.length > 0 && selectedTechnicians.length <= 3 && (
          <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-gray-200">
            {selectedTechnicians.map(techId => {
              const tech = technicians.find(t => t.id === techId);
              return tech ? (
                <Badge 
                  key={tech.id} 
                  variant="secondary" 
                  className="flex items-center gap-1 py-0"
                >
                  {tech.name}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-5 w-5 p-0" 
                    onClick={() => onTechnicianToggle(tech.id)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </Badge>
              ) : null;
            })}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TechnicianSelectDropdown;
