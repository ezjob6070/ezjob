
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DEFAULT_SUB_ROLES } from "@/types/technician";

interface SalesmanSubRoleFilterProps {
  selectedSubRoles: string[];
  onToggleSubRole: (subRole: string) => void;
}

const SalesmanSubRoleFilter: React.FC<SalesmanSubRoleFilterProps> = ({
  selectedSubRoles,
  onToggleSubRole
}) => {
  // Get the salesman sub-roles from the DEFAULT_SUB_ROLES object
  const salesmanSubRoles = DEFAULT_SUB_ROLES["salesman"] || [];

  const allSelected = salesmanSubRoles.length > 0 && 
    salesmanSubRoles.every(role => selectedSubRoles.includes(role));

  const handleSelectAll = () => {
    if (allSelected) {
      // Deselect all
      salesmanSubRoles.forEach(role => {
        if (selectedSubRoles.includes(role)) {
          onToggleSubRole(role);
        }
      });
    } else {
      // Select all
      salesmanSubRoles.forEach(role => {
        if (!selectedSubRoles.includes(role)) {
          onToggleSubRole(role);
        }
      });
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Sales Position</h3>
      <div className="space-y-1">
        <div className="flex items-center">
          <Checkbox
            id="select-all-salesman-subroles"
            checked={allSelected}
            onCheckedChange={handleSelectAll}
          />
          <Label
            htmlFor="select-all-salesman-subroles"
            className="ml-2 text-sm font-medium"
          >
            All Sales Positions
          </Label>
        </div>
      </div>
      <div className="space-y-1 max-h-40 overflow-y-auto">
        {salesmanSubRoles.map((role) => (
          <div key={role} className="flex items-center">
            <Checkbox
              id={`salesman-subrole-${role}`}
              checked={selectedSubRoles.includes(role)}
              onCheckedChange={() => onToggleSubRole(role)}
            />
            <Label
              htmlFor={`salesman-subrole-${role}`}
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

export default SalesmanSubRoleFilter;
