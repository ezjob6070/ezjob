
import React, { useState } from "react";
import { Technician } from "@/types/technician";
import TechniciansTableView from "@/components/technicians/list/TechniciansTableView";
import TechniciansCardView from "@/components/technicians/list/TechniciansCardView";
import ViewToggleButtons from "@/components/technicians/list/ViewToggleButtons";
import { Card, CardContent } from "@/components/ui/card";
import TechnicianCard from "@/components/technicians/TechnicianCard";
import { Wrench, Briefcase, UserCheck, Hammer } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  displayMode: initialDisplayMode = "card",
  selectedTechnicians = [],
  onToggleSelect,
  onEditTechnician,
  showSalaryData = false
}) => {
  const [displayMode, setDisplayMode] = useState<"card" | "table">(initialDisplayMode);
  const navigate = useNavigate();

  // Handle clicking on a technician card
  const handleCardClick = (technicianId: string) => {
    navigate(`/technicians/${technicianId}`);
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-0">
        <div className="p-4 border-b flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Technicians & Contractors</h3>
            <ViewToggleButtons 
              displayMode={displayMode}
              onDisplayModeChange={setDisplayMode}
            />
          </div>
          {/* Role legend removed from here */}
        </div>

        {displayMode === "card" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {technicians.map(technician => (
              <TechnicianCard
                key={technician.id}
                technician={technician}
                selected={selectedTechnicians?.includes(technician.id) || false}
                onSelect={onToggleSelect || (() => {})}
                onClick={handleCardClick}
              />
            ))}
            {technicians.length === 0 && (
              <div className="col-span-4 text-center py-8 text-muted-foreground">
                No team members found matching your filters.
              </div>
            )}
          </div>
        ) : (
          <TechniciansTableView 
            technicians={technicians}
            onEditTechnician={onEditTechnician}
            selectedTechnicians={selectedTechnicians}
            onToggleSelect={onToggleSelect}
            showSalaryData={showSalaryData}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TechniciansList;
