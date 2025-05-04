import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format, isValid, parseISO } from 'date-fns';
import { Employee, EMPLOYEE_STATUS, getInitials } from '@/types/employee';
import { Edit, FileText, DollarSign } from 'lucide-react';

interface EmployeesListProps {
  employees: Employee[];
  onEditEmployee: (employee: Employee) => void;
}

const EmployeesList: React.FC<EmployeesListProps> = ({ employees, onEditEmployee }) => {
  const formatDateSafely = (dateString?: string) => {
    if (!dateString) return 'Not available';
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, 'MMM d, yyyy') : 'Invalid date';
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case EMPLOYEE_STATUS.ACTIVE:
        return 'bg-green-100 text-green-800 border-green-200';
      case EMPLOYEE_STATUS.INACTIVE:
        return 'bg-red-100 text-red-800 border-red-200';
      case EMPLOYEE_STATUS.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case EMPLOYEE_STATUS.ON_LEAVE:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case EMPLOYEE_STATUS.CONTRACT:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case EMPLOYEE_STATUS.PROBATION:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Use the utility function from types
  const getEmployeeInitials = (name: string) => {
    return getInitials(name);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Employee</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Hire Date</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length > 0 ? (
            employees.map(employee => (
              <TableRow key={employee.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      {employee.profileImage ? (
                        <AvatarImage src={employee.profileImage} alt={employee.name} />
                      ) : (
                        <AvatarFallback className="bg-indigo-100 text-indigo-600">
                          {getEmployeeInitials(employee.name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-xs text-muted-foreground">{employee.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(employee.status)}>
                    {employee.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatDateSafely(employee.hireDate)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                    {employee.salary.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEditEmployee(employee)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      asChild
                    >
                      <Link to={`/employee/${employee.id}`}>
                        <FileText className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No employees found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeesList;
