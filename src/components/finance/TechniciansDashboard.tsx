
import { useState } from "react";
import { Technician } from "@/types/technician";
import { DateRange } from "react-day-picker";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import TechnicianFinancialTable from "@/components/technicians/charts/TechnicianFinancialTable";
import { useGlobalDateRange } from "@/components/GlobalDateRangeFilter";

interface TechniciansDashboardProps {
  activeTechnicians: Technician[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const TechniciansDashboard = ({ 
  activeTechnicians, 
  searchQuery, 
  setSearchQuery 
}: TechniciansDashboardProps) => {
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string | undefined>(undefined);
  const { dateRange } = useGlobalDateRange();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter technicians based on search query
  const filteredTechnicians = activeTechnicians.filter(tech => 
    tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tech.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTechnicianSelect = (tech: Technician) => {
    setSelectedTechnicianId(prev => prev === tech.id ? undefined : tech.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search technicians..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <TechnicianFinancialTable 
        displayedTechnicians={filteredTechnicians}
        selectedTechnicianId={selectedTechnicianId}
        onTechnicianSelect={handleTechnicianSelect}
        dateRange={dateRange}
      />
    </div>
  );
};

export default TechniciansDashboard;
