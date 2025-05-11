
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface DepartmentFilterProps {
  departments: string[];
  selectedDepartments: string[];
  toggleDepartment: (department: string) => void;
}

const DepartmentFilter: React.FC<DepartmentFilterProps> = ({
  departments,
  selectedDepartments,
  toggleDepartment
}) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Department</h3>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {departments.map((department) => (
          <div key={department} className="flex items-center space-x-2">
            <Checkbox 
              id={`department-${department}`} 
              checked={selectedDepartments.includes(department)}
              onCheckedChange={() => toggleDepartment(department)}
            />
            <label 
              htmlFor={`department-${department}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {department}
            </label>
          </div>
        ))}
        
        {departments.length === 0 && (
          <div className="text-sm text-muted-foreground py-2">
            No departments available
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentFilter;
