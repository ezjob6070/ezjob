
import { Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TechnicianDropdownProps {
  selectedTechnician: string;
  technicians: string[];
  onTechnicianChange: (value: string) => void;
}

const TechnicianDropdown = ({ 
  selectedTechnician, 
  technicians, 
  onTechnicianChange 
}: TechnicianDropdownProps) => {
  return (
    <Select value={selectedTechnician} onValueChange={onTechnicianChange}>
      <SelectTrigger className="w-[180px]">
        <Users className="h-4 w-4 mr-2" />
        <SelectValue placeholder="Technician" />
      </SelectTrigger>
      <SelectContent>
        {technicians.map((tech) => (
          <SelectItem key={tech} value={tech}>
            {tech}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TechnicianDropdown;
