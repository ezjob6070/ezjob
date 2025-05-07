
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, Download, Filter, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TechniciansPageHeaderProps {
  onAddTechnician: () => void;
  exportTechnicians: () => void;
}

const TechniciansPageHeader: React.FC<TechniciansPageHeaderProps> = ({
  onAddTechnician,
  exportTechnicians
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold leading-tight tracking-tighter">
          Technicians
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your technicians and their payment structures
        </p>
      </div>
      <div className="flex space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <MoreHorizontal className="h-4 w-4 mr-2" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Technician Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={exportTechnicians}>
              <Download className="h-4 w-4 mr-2" />
              Export Technicians
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Filter className="h-4 w-4 mr-2" />
              Bulk Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          onClick={onAddTechnician}
          className="bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900"
        >
          <PlusIcon className="mr-2 h-4 w-4" /> Add Technician
        </Button>
      </div>
    </div>
  );
};

export default TechniciansPageHeader;
