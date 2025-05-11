
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface RoleFilterProps {
  selected: string;
  onSelect: (role: string) => void;
}

const RoleFilter: React.FC<RoleFilterProps> = ({
  selected,
  onSelect
}) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Role</h3>
      <RadioGroup 
        value={selected} 
        onValueChange={onSelect}
        className="space-y-1"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="role-all" />
          <Label htmlFor="role-all" className="text-sm">All Roles</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="technician" id="role-technician" />
          <Label htmlFor="role-technician" className="text-sm">Technician</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="salesman" id="role-salesman" />
          <Label htmlFor="role-salesman" className="text-sm">Salesman</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="employed" id="role-employed" />
          <Label htmlFor="role-employed" className="text-sm">Employed</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="contractor" id="role-contractor" />
          <Label htmlFor="role-contractor" className="text-sm">Contractor</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default RoleFilter;
