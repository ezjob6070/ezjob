
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TechnicianFilterProps {
  technicians: string[];
  selectedNames: string[];
  onToggle: (name: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  appliedFilters?: boolean;
}

const TechnicianFilter = ({
  technicians,
  selectedNames,
  onToggle,
  onSelectAll,
  onDeselectAll
}: TechnicianFilterProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredTechnicians = technicians.filter(name =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const allSelected = technicians.length > 0 && 
    selectedNames.length === technicians.length;

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Technician Filter</h3>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSelectAll}
            disabled={allSelected}
          >
            Select All
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onDeselectAll}
            disabled={selectedNames.length === 0}
          >
            Clear
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search technicians..." 
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <Checkbox
          id="technicians-all"
          checked={allSelected}
          onCheckedChange={(checked) => {
            if (checked) {
              onSelectAll();
            } else {
              onDeselectAll();
            }
          }}
        />
        <Label
          htmlFor="technicians-all"
          className="text-sm font-medium ml-2"
        >
          All Technicians
        </Label>
      </div>

      <ScrollArea className="h-72 pr-4">
        <div className="space-y-1">
          {filteredTechnicians.map((name) => (
            <div key={name || "unnamed"} className="flex items-center">
              <Checkbox
                id={`technician-${name || "unnamed"}`}
                checked={selectedNames.includes(name)}
                onCheckedChange={() => onToggle(name)}
              />
              <Label
                htmlFor={`technician-${name || "unnamed"}`}
                className="text-sm ml-2"
              >
                {name || "Unnamed"}
              </Label>
            </div>
          ))}
          
          {filteredTechnicians.length === 0 && (
            <p className="text-sm text-muted-foreground py-2">
              No technicians found
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TechnicianFilter;
