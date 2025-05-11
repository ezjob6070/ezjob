
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DEFAULT_SUB_ROLES } from "@/types/technician";

interface EmployedSubRoleFilterProps {
  selectedSubRoles: string[];
  onToggleSubRole: (subRole: string) => void;
}

const EmployedSubRoleFilter: React.FC<EmployedSubRoleFilterProps> = ({
  selectedSubRoles,
  onToggleSubRole
}) => {
  // Get the employed sub-roles from the DEFAULT_SUB_ROLES object
  const employedSubRoles = DEFAULT_SUB_ROLES["employed"] || [];

  const allSelected = employedSubRoles.length > 0 && 
    employedSubRoles.every(role => selectedSubRoles.includes(role));

  const handleSelectAll = () => {
    if (allSelected) {
      // Deselect all
      employedSubRoles.forEach(role => {
        if (selectedSubRoles.includes(role)) {
          onToggleSubRole(role);
        }
      });
    } else {
      // Select all
      employedSubRoles.forEach(role => {
        if (!selectedSubRoles.includes(role)) {
          onToggleSubRole(role);
        }
      });
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Staff Position</h3>
      <div className="space-y-1">
        <div className="flex items-center">
          <Checkbox
            id="select-all-employed-subroles"
            checked={allSelected}
            onCheckedChange={handleSelectAll}
          />
          <Label
            htmlFor="select-all-employed-subroles"
            className="ml-2 text-sm font-medium"
          >
            All Staff Positions
          </Label>
        </div>
      </div>
      <div className="space-y-1 max-h-40 overflow-y-auto">
        {employedSubRoles.map((role) => (
          <div key={role} className="flex items-center">
            <Checkbox
              id={`employed-subrole-${role}`}
              checked={selectedSubRoles.includes(role)}
              onCheckedChange={() => onToggleSubRole(role)}
            />
            <Label
              htmlFor={`employed-subrole-${role}`}
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

export default EmployedSubRoleFilter;
