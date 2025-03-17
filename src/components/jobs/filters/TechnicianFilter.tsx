
import { Button } from "@/components/ui/button";
import { Users, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TechnicianFilterProps {
  technicianFilter: string;
  technicians: { id: string; name: string }[];
  updateFilter: (key: string, value: string) => void;
}

const TechnicianFilter = ({ 
  technicianFilter, 
  technicians, 
  updateFilter 
}: TechnicianFilterProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Users className="h-4 w-4" />
          {technicianFilter ? 
            technicians.find(t => t.id === technicianFilter)?.name || "Technician" : 
            "All Technicians"}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <div className="p-2">
          <div className="space-y-2">
            <Button 
              variant={technicianFilter === "" ? "default" : "outline"} 
              className="w-full justify-start text-left"
              onClick={() => updateFilter("technicianFilter", "")}
            >
              All Technicians
            </Button>
            {technicians.map((tech) => (
              <Button 
                key={tech.id} 
                variant={technicianFilter === tech.id ? "default" : "outline"} 
                className="w-full justify-start text-left"
                onClick={() => updateFilter("technicianFilter", tech.id)}
              >
                {tech.name}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TechnicianFilter;
