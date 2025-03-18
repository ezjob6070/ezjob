
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Technician } from "@/types/technician";

interface TechnicianHeaderProps {
  technician: Technician;
  onEditClick: () => void;
}

const TechnicianHeader: React.FC<TechnicianHeaderProps> = ({ 
  technician, 
  onEditClick 
}) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'onLeave':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate("/technicians")}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <h1 className="text-2xl font-bold">{technician.name}</h1>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(technician.status)}`}>
          {technician.status === 'onLeave' ? 'On Leave' : technician.status.charAt(0).toUpperCase() + technician.status.slice(1)}
        </span>
      </div>
      <Button onClick={onEditClick}>
        Edit Technician
      </Button>
    </div>
  );
};

export default TechnicianHeader;
