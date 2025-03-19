
import React, { useState } from "react";
import { Technician } from "@/types/technician";
import { Input } from "@/components/ui/input";
import { Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import InvoiceDownloadDialog from "./InvoiceDownloadDialog";

interface TechnicianListProps {
  technicians: Technician[];
  selectedTechnician: Technician | null;
  onSelectTechnician: (technician: Technician) => void;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TechnicianList: React.FC<TechnicianListProps> = ({
  technicians,
  selectedTechnician,
  onSelectTechnician,
  searchQuery,
  onSearchChange,
}) => {
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [activeTechnician, setActiveTechnician] = useState<Technician | null>(null);

  const handleDownloadClick = (technician: Technician, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the row click from triggering
    setActiveTechnician(technician);
    setDownloadDialogOpen(true);
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search technicians..."
          className="pl-8"
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>
      
      <div className="grid gap-2 max-h-[400px] overflow-y-auto border rounded-md p-2">
        {technicians.map(tech => (
          <div 
            key={tech.id}
            className={`p-3 rounded-md border cursor-pointer hover:bg-slate-50 transition-colors
              ${selectedTechnician?.id === tech.id ? 'bg-blue-50 border-blue-300' : ''}`}
            onClick={() => onSelectTechnician(tech)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-2 text-xs">
                  {tech.initials}
                </div>
                <div>
                  <div className="font-medium">{tech.name}</div>
                  <div className="text-sm text-muted-foreground">{tech.specialty}</div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto" 
                onClick={(e) => handleDownloadClick(tech, e)}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        ))}
        
        {technicians.length === 0 && (
          <div className="p-4 text-center text-muted-foreground">
            No technicians found matching your search.
          </div>
        )}
      </div>

      {/* Invoice Download Dialog with filters */}
      <InvoiceDownloadDialog 
        open={downloadDialogOpen} 
        onOpenChange={setDownloadDialogOpen} 
        technician={activeTechnician} 
      />
    </div>
  );
};

export default TechnicianList;
