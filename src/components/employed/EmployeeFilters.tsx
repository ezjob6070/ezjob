
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter, CheckCircle, Briefcase } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export interface EmployeeFiltersProps {
  departments: string[];
  statuses: string[]; 
  onStatusChange: (statuses: string[]) => void;
  onDepartmentChange: (departments: string[]) => void;
}

const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  departments,
  statuses,
  onStatusChange,
  onDepartmentChange
}) => {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const handleStatusChange = (status: string) => {
    const updatedStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter(s => s !== status)
      : [...selectedStatuses, status];
    
    setSelectedStatuses(updatedStatuses);
    onStatusChange(updatedStatuses);
  };

  const handleDepartmentChange = (department: string) => {
    const updatedDepartments = selectedDepartments.includes(department)
      ? selectedDepartments.filter(d => d !== department)
      : [...selectedDepartments, department];
    
    setSelectedDepartments(updatedDepartments);
    onDepartmentChange(updatedDepartments);
  };

  const clearFilters = () => {
    setSelectedStatuses([]);
    setSelectedDepartments([]);
    onStatusChange([]);
    onDepartmentChange([]);
    setOpen(false);
  };

  const applyFilters = () => {
    setOpen(false);
  };

  const totalFilters = selectedStatuses.length + selectedDepartments.length;

  return (
    <div className="flex items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="mr-2 h-4 w-4" />
            <span>Filters</span>
            {totalFilters > 0 && (
              <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                {totalFilters}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Status
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {statuses.map(status => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`status-${status}`} 
                      checked={selectedStatuses.includes(status)}
                      onCheckedChange={() => handleStatusChange(status)}
                    />
                    <Label htmlFor={`status-${status}`}>{status}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h4 className="font-medium leading-none flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Department
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {departments.map(department => (
                  <div key={department} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`department-${department}`} 
                      checked={selectedDepartments.includes(department)}
                      onCheckedChange={() => handleDepartmentChange(department)}
                    />
                    <Label htmlFor={`department-${department}`}>{department}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between pt-2">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
              <Button size="sm" onClick={applyFilters}>
                Apply filters
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default EmployeeFilters;
