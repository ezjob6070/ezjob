
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface SubRoleFilterProps {
  subRoles: string[];
  selectedSubRole: string | null;
  onSubRoleChange: (subRole: string | null) => void;
}

const SubRoleFilter: React.FC<SubRoleFilterProps> = ({
  subRoles,
  selectedSubRole,
  onSubRoleChange,
}) => {
  return (
    <Select
      value={selectedSubRole || "all_roles"}
      onValueChange={(value) => onSubRoleChange(value === "all_roles" ? null : value)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="All Roles" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all_roles">All Roles</SelectItem>
        {subRoles.map((role) => (
          <SelectItem key={role} value={role || "unnamed_role"}>
            {role || "Unnamed Role"}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SubRoleFilter;
