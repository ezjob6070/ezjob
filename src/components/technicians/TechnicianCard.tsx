
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Technician } from "@/types/technician";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface TechnicianCardProps {
  technician: Technician;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
  showSalaryData?: boolean;
  onEdit?: (technician: Technician) => void;
}

const TechnicianCard: React.FC<TechnicianCardProps> = ({
  technician,
  selected = false,
  onToggleSelect,
  showSalaryData = true,
  onEdit,
}) => {
  const navigate = useNavigate();
  
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking the checkbox or edit button
    if ((e.target as HTMLElement).closest('[data-no-navigate=true]')) return;
    navigate(`/technicians/${technician.id}`);
  };
  
  const getRoleColor = (role?: string) => {
    switch (role) {
      case "technician": return "bg-blue-100 text-blue-800";
      case "salesman": return "bg-emerald-100 text-emerald-800";
      case "employed": return "bg-purple-100 text-purple-800";
      case "contractor": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-red-100 text-red-800";
      case "onLeave": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <Card className="cursor-pointer group hover:border-primary/50 transition-colors" onClick={handleCardClick}>
      <CardContent className="p-0">
        <div className="relative p-4">
          {/* Edit Button - Top Right Corner */}
          {onEdit && (
            <div 
              className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
              data-no-navigate="true"
            >
              <Button 
                size="sm" 
                variant="secondary" 
                className="h-8 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(technician);
                }}
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
            </div>
          )}
          
          {/* Selection Checkbox - Top Left Corner */}
          {onToggleSelect && (
            <div 
              className="absolute top-2 left-2 z-10"
              data-no-navigate="true"
            >
              <Checkbox
                checked={selected}
                onCheckedChange={() => onToggleSelect(technician.id)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                aria-label={`Select ${technician.name}`}
              />
            </div>
          )}
          
          <div className="flex flex-col items-center text-center pt-4">
            <Avatar className="h-16 w-16 mb-2">
              {technician.profileImage || technician.imageUrl ? (
                <AvatarImage src={technician.profileImage || technician.imageUrl} alt={technician.name} />
              ) : (
                <AvatarFallback className="text-lg bg-primary/10 text-primary">
                  {technician.initials || technician.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              )}
            </Avatar>
            
            <h3 className="font-medium text-lg mt-1">{technician.name}</h3>
            
            <div className="flex gap-2 justify-center mt-1 mb-2 flex-wrap">
              <Badge variant="outline" className={`${getRoleColor(technician.role)}`}>
                {technician.role || 'Technician'}
              </Badge>
              
              <Badge variant="outline" className={`${getStatusColor(technician.status)}`}>
                {technician.status}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground">{technician.specialty}</p>
            
            {showSalaryData && (
              <div className="grid grid-cols-2 gap-3 mt-3 w-full">
                <div className="border rounded p-2 text-center">
                  <div className="text-xs text-muted-foreground">Payment</div>
                  <div className="font-medium text-sm">
                    {formatCurrency(technician.paymentRate)}
                    {technician.paymentType === "percentage" && "%"}
                  </div>
                </div>
                
                <div className="border rounded p-2 text-center">
                  <div className="text-xs text-muted-foreground">Revenue</div>
                  <div className="font-medium text-sm">{formatCurrency(technician.totalRevenue)}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicianCard;
