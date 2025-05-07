
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";

interface TechniciansPageHeaderProps {
  onAddTechnician: () => void;
  exportTechnicians: () => void;
  title?: string;
}

const TechniciansPageHeader: React.FC<TechniciansPageHeaderProps> = ({ 
  onAddTechnician,
  exportTechnicians,
  title = "Technicians"
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">
          Manage staff members, their information, and performance data
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={onAddTechnician}>
          <Plus className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
        <Button variant="outline" onClick={exportTechnicians}>
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>
    </div>
  );
};

export default TechniciansPageHeader;
