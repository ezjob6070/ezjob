
import { Input } from "@/components/ui/input";
import { SearchIcon, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Technician } from "@/types/technician";
import TechnicianCard from "./TechnicianCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type TechniciansListProps = {
  technicians: Technician[];
  onEditTechnician: (technician: Technician) => void;
};

const TechniciansList = ({ technicians, onEditTechnician }: TechniciansListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);

  const sortedTechnicians = [...technicians].sort((a, b) => {
    switch (sortBy) {
      case "revenue":
        return b.totalRevenue - a.totalRevenue;
      case "jobs":
        return b.completedJobs - a.completedJobs;
      case "rating":
        return b.rating - a.rating;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const filteredTechnicians = sortedTechnicians.filter(
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
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>
      
      {showFilters && (
        <div className="flex gap-4 items-center">
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="jobs">Jobs</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
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
