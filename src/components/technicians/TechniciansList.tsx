
import React, { useState } from "react";
import { Technician } from "@/types/technician";
import TechniciansTableView from "@/components/technicians/list/TechniciansTableView";
import TechniciansCardView from "@/components/technicians/list/TechniciansCardView";
import ViewToggleButtons from "@/components/technicians/list/ViewToggleButtons";
import { Card, CardContent } from "@/components/ui/card";
import TechnicianCard from "@/components/technicians/TechnicianCard";

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
  displayMode: initialDisplayMode = "card", // Changed default to card
  selectedTechnicians = [],
  onToggleSelect,
  onEditTechnician,
  showSalaryData = false
}) => {
  const [displayMode, setDisplayMode] = useState<"card" | "table">(initialDisplayMode);

  return (
    <Card className="shadow-sm">
      <CardContent className="p-0">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-medium">Technicians</h3>
          <ViewToggleButtons 
            displayMode={displayMode}
            onDisplayModeChange={setDisplayMode}
          />
        </div>

        {displayMode === "card" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {technicians.map(technician => (
              <TechnicianCard
                key={technician.id}
                technician={technician}
                selected={selectedTechnicians.includes(technician.id)}
                onSelect={onToggleSelect || (() => {})}
                onClick={id => onEditTechnician && onEditTechnician(technician)}
              />
            ))}
            {technicians.length === 0 && (
              <div className="col-span-4 text-center py-8 text-muted-foreground">
                No technicians found matching your filters.
              </div>
            )}
          </div>
        ) : (
          <TechniciansTableView 
            technicians={technicians}
            onEditTechnician={onEditTechnician}
            selectedTechnicians={selectedTechnicians}
            onToggleSelect={onToggleSelect}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TechniciansList;
