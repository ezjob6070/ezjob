
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface RoleFilterProps {
  selected: string;
  onSelect: (role: string) => void;
}

const RoleFilter: React.FC<RoleFilterProps> = ({ selected, onSelect }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Role</h3>
      <RadioGroup value={selected} onValueChange={onSelect} className="space-y-3">
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="all" id="role-all" className="h-5 w-5" />
          <Label htmlFor="role-all" className="text-sm font-medium cursor-pointer">All Roles</Label>
        </div>
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="technician" id="role-technician" className="h-5 w-5" />
          <Label htmlFor="role-technician" className="text-sm font-medium cursor-pointer">Technicians</Label>
        </div>
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="salesman" id="role-salesman" className="h-5 w-5" />
          <Label htmlFor="role-salesman" className="text-sm font-medium cursor-pointer">Salesmen</Label>
        </div>
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="employed" id="role-employed" className="h-5 w-5" />
          <Label htmlFor="role-employed" className="text-sm font-medium cursor-pointer">Employed</Label>
        </div>
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="contractor" id="role-contractor" className="h-5 w-5" />
          <Label htmlFor="role-contractor" className="text-sm font-medium cursor-pointer">Contractors</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default RoleFilter;
