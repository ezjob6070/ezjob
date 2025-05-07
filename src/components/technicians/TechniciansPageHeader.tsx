
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
    <div className="flex justify-end items-center">
      <div className="flex space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <MoreHorizontal className="h-4 w-4 mr-2" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Staff Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={exportTechnicians}>
              <Download className="h-4 w-4 mr-2" />
              Export Staff
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
          <PlusIcon className="mr-2 h-4 w-4" /> Add Staff
        </Button>
      </div>
    </div>
  );
};

export default TechniciansPageHeader;
