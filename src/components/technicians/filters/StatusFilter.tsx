
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface StatusFilterProps {
  selected: string;
  onSelect: (status: string) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  selected,
  onSelect
}) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Status</h3>
      <RadioGroup 
        value={selected} 
        onValueChange={onSelect}
        className="space-y-1"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="status-all" />
          <Label htmlFor="status-all" className="text-sm">All</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="active" id="status-active" />
          <Label htmlFor="status-active" className="text-sm">Active</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="inactive" id="status-inactive" />
          <Label htmlFor="status-inactive" className="text-sm">Inactive</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="onLeave" id="status-onleave" />
          <Label htmlFor="status-onleave" className="text-sm">On Leave</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default StatusFilter;
