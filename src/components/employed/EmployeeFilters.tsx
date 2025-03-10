
import React from "react";
import { Filter, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmployeeStatus } from "@/types/employee";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

interface EmployeeFiltersProps {
  departmentFilter: string;
  setDepartmentFilter: (value: string) => void;
  departments: string[];
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  departmentFilter,
  setDepartmentFilter,
  departments,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Users className="text-muted-foreground h-5 w-5" />
          <span className="font-medium">Status:</span>
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value={EmployeeStatus.ACTIVE}>Active</SelectItem>
              <SelectItem value={EmployeeStatus.PENDING}>Pending</SelectItem>
              <SelectItem value={EmployeeStatus.INACTIVE}>Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium">Department:</span>
          <Select
            value={departmentFilter}
            onValueChange={setDepartmentFilter}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((department) => (
                <SelectItem key={department} value={department}>
                  {department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="relative w-full sm:w-64">
        <Input
          placeholder="Search by name, email, phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full"
            onClick={() => setSearchQuery("")}
          >
            ×
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmployeeFilters;
