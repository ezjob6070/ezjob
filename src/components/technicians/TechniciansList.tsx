
import React, { useState } from "react";
import { Technician } from "@/types/technician";
import CompactTechnicianFilter from "@/components/finance/technician-filters/CompactTechnicianFilter";
import TechniciansTableView from "@/components/technicians/list/TechniciansTableView";
import TechniciansCardView from "@/components/technicians/list/TechniciansCardView";
import ViewToggleButtons from "@/components/technicians/list/ViewToggleButtons";

interface TechniciansListProps {
  technicians: Technician[];
  displayMode?: "card" | "table";
  selectedTechnicians?: string[];
  onToggleSelect?: (technicianId: string) => void;
  onEditTechnician?: (technician: Technician) => void;
  showSalaryData?: boolean;
}

const TechniciansList: React.FC<TechniciansListProps> = ({ 
  technicians, 
  displayMode: initialDisplayMode = "table",
  selectedTechnicians = [],
  onToggleSelect,
  onEditTechnician,
  showSalaryData = false
}) => {
  const [displayMode, setDisplayMode] = useState<"card" | "table">(initialDisplayMode);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <CompactTechnicianFilter 
          technicianNames={technicians.map(tech => tech.name)}
          selectedTechnicians={[]}
          toggleTechnician={() => {}}
          clearFilters={() => {}}
          applyFilters={() => {}}
        />
        
        <ViewToggleButtons 
          displayMode={displayMode}
          onDisplayModeChange={setDisplayMode}
        />
      </div>

      {displayMode === "card" ? (
        <TechniciansCardView 
          technicians={technicians}
          onEditTechnician={onEditTechnician}
        />
      ) : (
        <TechniciansTableView 
          technicians={technicians}
          onEditTechnician={onEditTechnician}
        />
      )}
    </div>
  );
};

export default TechniciansList;
