
import React, { useState } from "react";
import { Technician } from "@/types/technician";
import TechniciansTableView from "@/components/technicians/list/TechniciansTableView";
import TechniciansCardView from "@/components/technicians/list/TechniciansCardView";
import ViewToggleButtons from "@/components/technicians/list/ViewToggleButtons";
import { Card, CardContent } from "@/components/ui/card";

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
      </CardContent>
    </Card>
  );
};

export default TechniciansList;
