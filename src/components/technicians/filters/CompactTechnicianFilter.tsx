
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface CompactTechnicianFilterProps {
  technicianNames: string[];
  selectedTechnicians: string[];
  toggleTechnician: (techName: string) => void;
  clearFilters: () => void;
  applyFilters: () => void;
}

const CompactTechnicianFilter: React.FC<CompactTechnicianFilterProps> = ({
  technicianNames,
  selectedTechnicians,
  toggleTechnician,
  clearFilters,
  applyFilters,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredTechnicianNames = technicianNames.filter(name =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allTechniciansSelected = technicianNames.length > 0 && 
    technicianNames.every(tech => selectedTechnicians.includes(tech));

  const toggleAllTechnicians = (checked: boolean) => {
    if (checked) {
      technicianNames.forEach(tech => {
        if (!selectedTechnicians.includes(tech)) {
          toggleTechnician(tech);
        }
      });
    } else {
      selectedTechnicians.forEach(tech => {
        toggleTechnician(tech);
      });
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`h-9 ${selectedTechnicians.length > 0 ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}`}
        >
          <Filter className="h-4 w-4 mr-2" />
          Technicians
          {selectedTechnicians.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {selectedTechnicians.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <div className="p-3">
          <div className="pb-2 mb-2 border-b">
            <Input
              placeholder="Search technicians..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-2"
            />
            <div className="flex items-center space-x-2 py-1">
              <Checkbox 
                id="select-all-techs"
                checked={allTechniciansSelected}
                onCheckedChange={toggleAllTechnicians}
              />
              <label 
                htmlFor="select-all-techs"
                className="text-sm font-medium cursor-pointer text-gray-900"
              >
                Select All Technicians
              </label>
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filteredTechnicianNames.map(tech => (
              <div key={tech} className="flex items-center space-x-2 py-1">
                <Checkbox 
                  id={`tech-${tech}`} 
                  checked={selectedTechnicians.includes(tech)}
                  onCheckedChange={() => toggleTechnician(tech)}
                />
                <label 
                  htmlFor={`tech-${tech}`}
                  className="text-sm cursor-pointer text-gray-900"
                >
                  {tech}
                </label>
              </div>
            ))}
            {filteredTechnicianNames.length === 0 && (
              <div className="text-sm text-muted-foreground py-2">No technicians found</div>
            )}
          </div>
        </div>
        <div className="border-t p-3 flex justify-between">
          <Button variant="ghost" size="sm" onClick={clearFilters}>Clear</Button>
          <Button size="sm" onClick={() => {
            applyFilters();
            setIsOpen(false);
          }} className="gap-1">
            <Check className="h-3.5 w-3.5" />
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CompactTechnicianFilter;
