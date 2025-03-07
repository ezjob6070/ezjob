
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { Technician } from "@/types/technician";
import TechnicianCard from "./TechnicianCard";

type TechniciansListProps = {
  technicians: Technician[];
  onEditTechnician: (technician: Technician) => void;
};

const TechniciansList = ({ technicians, onEditTechnician }: TechniciansListProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTechnicians = technicians.filter(
    (tech) => 
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search technicians..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTechnicians.map((technician) => (
          <TechnicianCard 
            key={technician.id} 
            technician={technician}
            onEdit={onEditTechnician}
          />
        ))}
      </div>
    </div>
  );
};

export default TechniciansList;
