
import { Link } from "react-router-dom";
import { Employee, EmployeeStatus } from "@/types/employee";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, UserRoundX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface EmployeesListProps {
  employees: Employee[];
  onEditEmployee: (employee: Employee) => void;
}

const getStatusBadgeVariant = (status: EmployeeStatus) => {
  switch (status) {
    case EmployeeStatus.ACTIVE:
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case EmployeeStatus.INACTIVE:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    case EmployeeStatus.ON_LEAVE:
      return "bg-amber-100 text-amber-800 hover:bg-amber-200";
    case EmployeeStatus.TERMINATED:
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case EmployeeStatus.CONTRACT:
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case EmployeeStatus.PROBATION:
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    case EmployeeStatus.PENDING:
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const EmployeesList = ({ employees, onEditEmployee }: EmployeesListProps) => {
  if (employees.length === 0) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="rounded-full bg-blue-100 p-3 mb-4">
            <UserRoundX className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Employees Found</h3>
          <p className="text-muted-foreground text-center mb-6">
            No employees match your current filter criteria or none have been added yet.
          </p>
          <Button 
            asChild
            className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
          >
            <Link to="/employed/add">Add Your First Employee</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Hire Date</TableHead>
            <TableHead className="hidden lg:table-cell">Email</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <Avatar>
                    {employee.profileImage || employee.photo ? (
                      <AvatarImage src={employee.profileImage || employee.photo} alt={employee.name} />
                    ) : (
                      <AvatarFallback>
                        {employee.initials || getInitials(employee.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span>{employee.name}</span>
                </div>
              </TableCell>
              <TableCell>{employee.position}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>
                <Badge variant="outline" className={cn("font-normal", getStatusBadgeVariant(employee.status))}>
                  {employee.status.charAt(0).toUpperCase() + employee.status.slice(1).toLowerCase()}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {new Date(employee.dateHired || employee.hireDate).toLocaleDateString()}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <span className="text-muted-foreground">{employee.email}</span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => onEditEmployee(employee)}
                    aria-label="Edit employee"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    asChild
                    aria-label="View employee details"
                  >
                    <Link to={`/employed/employee/${employee.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeesList;
