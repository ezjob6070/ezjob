import { Employee, EMPLOYEE_STATUS } from "@/types/employee";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Eye, Edit, UserMinus, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

type EmployeesListProps = {
  employees: Employee[];
  onEditEmployee: (employee: Employee) => void;
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const getStatusColor = (status: string) => {
  switch (status) {
    case EMPLOYEE_STATUS.ACTIVE:
      return "bg-green-100 text-green-800";
    case EMPLOYEE_STATUS.INACTIVE:
      return "bg-gray-100 text-gray-800";
    case EMPLOYEE_STATUS.ON_LEAVE:
      return "bg-amber-100 text-amber-800";
    case EMPLOYEE_STATUS.TERMINATED:
      return "bg-red-100 text-red-800";
    case EMPLOYEE_STATUS.PENDING:
      return "bg-blue-100 text-blue-800";
    case EMPLOYEE_STATUS.CONTRACT:
      return "bg-indigo-100 text-indigo-800";
    case EMPLOYEE_STATUS.PROBATION:
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatSalary = (salary: number, basis: string) => {
  if (basis === "hourly") {
    return `$${salary.toFixed(2)}/hr`;
  } else {
    return `$${salary.toLocaleString()}/yr`;
  }
};

const EmployeesList = ({ employees, onEditEmployee }: EmployeesListProps) => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const viewEmployee = (employee: Employee) => {
    navigate(`/employed/${employee.id}`);
  };
  
  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Photo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead>Hire Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>
                <Avatar>
                  {employee.profileImage ? (
                    <AvatarImage src={employee.profileImage} alt={employee.name} />
                  ) : (
                    <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                  )}
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{employee.name}</TableCell>
              <TableCell>{employee.position}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(employee.status)}>
                  {employee.status}
                </Badge>
              </TableCell>
              <TableCell>{formatSalary(employee.salary, employee.salaryBasis)}</TableCell>
              <TableCell>
                {employee.hireDate ? format(new Date(employee.hireDate), "MMM dd, yyyy") : "N/A"}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <EllipsisVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => viewEmployee(employee)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditEmployee(employee)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <UserMinus className="mr-2 h-4 w-4" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeesList;
