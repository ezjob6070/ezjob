
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DEFAULT_SUB_ROLES } from "@/types/technician";

interface TechnicianSubRoleFilterProps {
  selectedSubRoles: string[];
  onToggleSubRole: (subRole: string) => void;
}

const TechnicianSubRoleFilter: React.FC<TechnicianSubRoleFilterProps> = ({
  selectedSubRoles,
  onToggleSubRole
}) => {
  // Get the technician sub-roles from the DEFAULT_SUB_ROLES object
  const technicianSubRoles = DEFAULT_SUB_ROLES["technician"] || [];

  const allSelected = technicianSubRoles.length > 0 && 
    technicianSubRoles.every(role => selectedSubRoles.includes(role));

  const handleSelectAll = () => {
    if (allSelected) {
      // Deselect all
      technicianSubRoles.forEach(role => {
        if (selectedSubRoles.includes(role)) {
          onToggleSubRole(role);
        }
      });
    } else {
      // Select all
      technicianSubRoles.forEach(role => {
        if (!selectedSubRoles.includes(role)) {
          onToggleSubRole(role);
        }
      });
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Technical Specialty</h3>
      <div className="space-y-1">
        <div className="flex items-center">
          <Checkbox
            id="select-all-technician-subroles"
            checked={allSelected}
            onCheckedChange={handleSelectAll}
          />
          <Label
            htmlFor="select-all-technician-subroles"
            className="ml-2 text-sm font-medium"
          >
            All Technical Specialties
          </Label>
        </div>
      </div>
      <div className="space-y-1 max-h-40 overflow-y-auto">
        {technicianSubRoles.map((role) => (
          <div key={role} className="flex items-center">
            <Checkbox
              id={`technician-subrole-${role}`}
              checked={selectedSubRoles.includes(role)}
              onCheckedChange={() => onToggleSubRole(role)}
            />
            <Label
              htmlFor={`technician-subrole-${role}`}
              className="ml-2 text-sm font-normal"
            >
              {role}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnicianSubRoleFilter;
