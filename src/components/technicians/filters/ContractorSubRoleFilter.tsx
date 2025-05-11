
import React from "react";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_SUB_ROLES } from "@/types/technician";

interface ContractorSubRoleFilterProps {
  selectedSubRoles: string[];
  onToggleSubRole: (subRole: string) => void;
}

const ContractorSubRoleFilter: React.FC<ContractorSubRoleFilterProps> = ({
  selectedSubRoles,
  onToggleSubRole
}) => {
  const contractorSubRoles = DEFAULT_SUB_ROLES.contractor;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Contractor Type</h3>
      <div className="flex flex-wrap gap-2">
        {contractorSubRoles.map((subRole) => {
          const isSelected = selectedSubRoles.includes(subRole);
          return (
            <Badge
              key={subRole}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer hover:bg-primary/90 ${
                isSelected ? "bg-primary text-primary-foreground" : ""
              }`}
              onClick={() => onToggleSubRole(subRole)}
            >
              {subRole}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default ContractorSubRoleFilter;
