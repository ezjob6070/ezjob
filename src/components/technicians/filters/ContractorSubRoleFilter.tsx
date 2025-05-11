
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
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

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Contractor Type</h3>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {contractorSubRoles.map((subRole) => (
          <div key={subRole} className="flex items-center space-x-2">
            <Checkbox 
              id={`subRole-${subRole}`} 
              checked={selectedSubRoles.includes(subRole)}
              onCheckedChange={() => onToggleSubRole(subRole)}
            />
            <label 
              htmlFor={`subRole-${subRole}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {subRole}
            </label>
          </div>
        ))}
        
        {contractorSubRoles.length === 0 && (
          <div className="text-sm text-muted-foreground py-2">
            No contractor types available
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractorSubRoleFilter;
