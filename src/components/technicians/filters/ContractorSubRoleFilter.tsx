
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DEFAULT_SUB_ROLES } from "@/types/technician";

interface ContractorSubRoleFilterProps {
  selectedSubRoles: string[];
  onToggleSubRole: (subRole: string) => void;
}

const ContractorSubRoleFilter: React.FC<ContractorSubRoleFilterProps> = ({
  selectedSubRoles,
  onToggleSubRole
}) => {
  // Get the contractor sub-roles from the DEFAULT_SUB_ROLES object
  const contractorSubRoles = DEFAULT_SUB_ROLES["contractor"] || [];

  const allSelected = contractorSubRoles.length > 0 && 
    contractorSubRoles.every(role => selectedSubRoles.includes(role));

  const handleSelectAll = () => {
    if (allSelected) {
      // Deselect all
      contractorSubRoles.forEach(role => {
        if (selectedSubRoles.includes(role)) {
          onToggleSubRole(role);
        }
      });
    } else {
      // Select all
      contractorSubRoles.forEach(role => {
        if (!selectedSubRoles.includes(role)) {
          onToggleSubRole(role);
        }
      });
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Contractor Type</h3>
      <div className="space-y-1">
        <div className="flex items-center">
          <Checkbox
            id="select-all-contractor-subroles"
            checked={allSelected}
            onCheckedChange={handleSelectAll}
            className="h-5 w-5"
          />
          <Label
            htmlFor="select-all-contractor-subroles"
            className="ml-2.5 text-sm font-medium cursor-pointer"
          >
            All Contractor Types
          </Label>
        </div>
      </div>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {contractorSubRoles.map((role) => (
          <div key={role} className="flex items-center">
            <Checkbox
              id={`contractor-subrole-${role}`}
              checked={selectedSubRoles.includes(role)}
              onCheckedChange={() => onToggleSubRole(role)}
              className="h-5 w-5"
            />
            <Label
              htmlFor={`contractor-subrole-${role}`}
              className="ml-2.5 text-sm cursor-pointer"
            >
              {role}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContractorSubRoleFilter;
