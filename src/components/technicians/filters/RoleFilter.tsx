
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StaffRole } from "@/types/technician";

interface RoleFilterProps {
  selectedRole: StaffRole | "all";
  onRoleChange: (role: StaffRole | "all") => void;
}

const RoleFilter: React.FC<RoleFilterProps> = ({ selectedRole, onRoleChange }) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="text-sm font-medium">Staff Role</div>
      <div className="flex flex-wrap gap-2">
        <Badge 
          variant={selectedRole === "all" ? "default" : "outline"}
          className="cursor-pointer hover:bg-primary/90"
          onClick={() => onRoleChange("all")}
        >
          All Staff
        </Badge>
        <Badge 
          variant={selectedRole === "technician" ? "default" : "outline"}
          className="cursor-pointer hover:bg-primary/90"
          onClick={() => onRoleChange("technician")}
        >
          Technicians
        </Badge>
        <Badge 
          variant={selectedRole === "salesman" ? "default" : "outline"}
          className="cursor-pointer hover:bg-primary/90"
          onClick={() => onRoleChange("salesman")}
        >
          Salesmen
        </Badge>
      </div>
    </div>
  );
};

export default RoleFilter;
