
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Technician } from "@/types/technician";
import { Edit, Star, Wrench, Briefcase, UserCheck, Hammer } from "lucide-react";

interface TechnicianCardProps {
  technician: Technician;
  selected?: boolean;
  onSelect?: (technicianId: string) => void;
  onClick?: (technicianId: string) => void;
}

const TechnicianCard: React.FC<TechnicianCardProps> = ({
  technician,
  selected = false,
  onSelect,
  onClick
}) => {
  const handleCardClick = () => {
    if (onClick) onClick(technician.id);
  };

  const handleCheckboxChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) onSelect(technician.id);
  };

  // Determine styles based on role
  const getRoleStyles = (role?: string) => {
    switch(role) {
      case "technician":
        return {
          color: "#0EA5E9",
          bgColor: "#E0F2FE",
          icon: <Wrench className="h-4 w-4 mr-1" />,
          label: "Technician"
        };
      case "salesman":
        return {
          color: "#10B981",
          bgColor: "#ECFDF5",
          icon: <Briefcase className="h-4 w-4 mr-1" />,
          label: "Salesman"
        };
      case "employed":
        return {
          color: "#8B5CF6",
          bgColor: "#F3E8FF",
          icon: <UserCheck className="h-4 w-4 mr-1" />,
          label: "Employed"
        };
      case "contractor":
        return {
          color: "#F97316",
          bgColor: "#FFEDD5",
          icon: <Hammer className="h-4 w-4 mr-1" />,
          label: "Contractor"
        };
      default:
        return {
          color: "#6E59A5",
          bgColor: "#F1F0FB",
          icon: <Wrench className="h-4 w-4 mr-1" />,
          label: "Staff"
        };
    }
  };

  const roleStyle = getRoleStyles(technician.role);

  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-all ${
        selected ? "ring-2 ring-primary" : ""
      }`}
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage 
                src={technician.imageUrl || ""} 
                alt={technician.name} 
              />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {technician.initials || technician.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{technician.name}</h3>
              <p className="text-sm text-muted-foreground">
                {technician.specialty || technician.position || "Team Member"}
              </p>
            </div>
          </div>
          
          {onSelect && (
            <Checkbox
              checked={selected}
              onClick={handleCheckboxChange}
              className="mt-1"
            />
          )}
        </div>

        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-2">
            <div 
              className="flex items-center px-2 py-1 rounded-full text-xs font-medium"
              style={{ 
                backgroundColor: roleStyle.bgColor,
                color: roleStyle.color
              }}
            >
              {roleStyle.icon}
              {roleStyle.label}
            </div>
            
            {technician.subRole && (
              <Badge variant="outline" className="text-xs">
                {technician.subRole}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="text-sm font-medium">
                <Badge
                  variant={technician.status === "active" ? "success" : 
                         technician.status === "inactive" ? "destructive" : "warning"}
                  className="capitalize text-xs"
                >
                  {technician.status}
                </Badge>
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Department</p>
              <p className="text-sm font-medium truncate">
                {technician.department || "General"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Contact</p>
            <p className="text-sm truncate">{technician.email}</p>
            {technician.phone && <p className="text-xs text-muted-foreground">{technician.phone}</p>}
          </div>
          
          {(technician.completedJobs !== undefined || technician.rating !== undefined) && (
            <div className="grid grid-cols-2 gap-2">
              {technician.completedJobs !== undefined && (
                <div>
                  <p className="text-xs text-muted-foreground">Completed Jobs</p>
                  <p className="text-sm font-medium">{technician.completedJobs}</p>
                </div>
              )}
              {technician.rating !== undefined && (
                <div className="flex items-center">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{technician.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-2 border-t flex justify-end bg-muted/20">
        <Button size="sm" variant="ghost">
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TechnicianCard;
