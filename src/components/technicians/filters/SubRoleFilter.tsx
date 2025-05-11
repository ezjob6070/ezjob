
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface SubRoleFilterProps {
  subRoles: string[];
  selectedSubRole: string | null;
  onSubRoleChange: (subRole: string | null) => void;
}

const SubRoleFilter: React.FC<SubRoleFilterProps> = ({ 
  subRoles, 
  selectedSubRole,
  onSubRoleChange 
}) => {
  return (
    <Select 
      value={selectedSubRole || ""} 
      onValueChange={(value) => {
        if (value === "all") {
          onSubRoleChange(null);
        } else {
          onSubRoleChange(value);
        }
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="All Definitions" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Definitions</SelectItem>
        {subRoles.map((subRole) => (
          <SelectItem key={subRole} value={subRole}>
            {subRole}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SubRoleFilter;
