
import React, { useState } from "react";
import { Technician } from "@/types/technician";
import TechniciansTableView from "@/components/technicians/list/TechniciansTableView";
import TechniciansCardView from "@/components/technicians/list/TechniciansCardView";
import ViewToggleButtons from "@/components/technicians/list/ViewToggleButtons";
import { Card, CardContent } from "@/components/ui/card";
import TechnicianCard from "@/components/technicians/TechnicianCard";
import { Wrench, Briefcase, UserCheck } from "lucide-react";

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

  // Calculate how many of each role we have
  const technicianCount = technicians.filter(t => (t.role || "technician") === "technician").length;
  const salesmanCount = technicians.filter(t => t.role === "salesman").length;
  const employedCount = technicians.filter(t => t.role === "employed").length;

  // Role legend for quick visual reference
  const renderRoleLegend = () => (
    <div className="flex flex-wrap gap-3 mb-2">
      <div className="flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
        <Wrench className="h-3 w-3 mr-1" />
        Technician ({technicianCount})
      </div>
      <div className="flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
        <Briefcase className="h-3 w-3 mr-1" />
        Salesman ({salesmanCount})
      </div>
      <div className="flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
        <UserCheck className="h-3 w-3 mr-1" />
        Employed ({employedCount}) 
      </div>
    </div>
  );

  return (
    <Card className="shadow-sm">
      <CardContent className="p-0">
        <div className="p-4 border-b flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Technicians</h3>
            <ViewToggleButtons 
              displayMode={displayMode}
              onDisplayModeChange={setDisplayMode}
            />
          </div>
          {renderRoleLegend()}
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
            showSalaryData={showSalaryData}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TechniciansList;
