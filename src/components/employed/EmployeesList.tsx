
import { useState } from "react";
import { Link } from "react-router-dom";
import { Employee, EmployeeStatus } from "@/types/employee";
import { Input } from "@/components/ui/input";
import { Search, User, ExternalLink, Filter, Circle } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EmployeesListProps {
  employees: Employee[];
  onEditEmployee?: (employee: Employee) => void;
  selectedEmployees?: string[];
  onToggleSelect?: (employeeId: string) => void;
}

const EmployeesList = ({ 
  employees, 
  onEditEmployee,
  selectedEmployees = [],
  onToggleSelect 
}: EmployeesListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  
  // Get unique departments for filter
  const departments = Array.from(
    new Set(employees.map((employee) => employee.department))
  );
  
  // Filter employees based on search and department
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          employee.position.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <div className="w-full sm:w-48">
            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by department" />
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
          
          <div className="flex gap-1">
            <Button 
              variant={viewMode === "table" ? "default" : "outline"} 
              size="icon"
              onClick={() => setViewMode("table")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="3" y1="15" x2="21" y2="15"></line>
                <line x1="9" y1="3" x2="9" y2="21"></line>
                <line x1="15" y1="3" x2="15" y2="21"></line>
              </svg>
              <span className="sr-only">Table view</span>
            </Button>
            <Button 
              variant={viewMode === "cards" ? "default" : "outline"} 
              size="icon"
              onClick={() => setViewMode("cards")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span className="sr-only">Card view</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Selected employees display */}
      {selectedEmployees.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
          <div className="mr-2 font-medium text-sm flex items-center">Selected:</div>
          {selectedEmployees.map(empId => {
            const emp = employees.find(e => e.id === empId);
            return emp ? (
              <Badge 
                key={emp.id} 
                variant="secondary" 
                className="flex items-center gap-1 px-2 py-1"
              >
                {emp.name}
                {onToggleSelect && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-4 w-4 p-0 ml-1" 
                    onClick={() => onToggleSelect(emp.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    <span className="sr-only">Remove</span>
                  </Button>
                )}
              </Badge>
            ) : null;
          })}
        </div>
      )}

      {viewMode === "table" ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                {onToggleSelect && (
                  <TableHead className="w-[50px]">Select</TableHead>
                )}
                <TableHead>Employee</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Hired</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    {onToggleSelect && (
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => onToggleSelect(employee.id)}
                          className="rounded-full w-6 h-6 p-0 flex items-center justify-center border-2"
                        >
                          {selectedEmployees.includes(employee.id) ? (
                            <Circle className="h-4 w-4 fill-primary stroke-primary" />
                          ) : (
                            <Circle className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {selectedEmployees.includes(employee.id) ? 'Deselect' : 'Select'}
                          </span>
                        </Button>
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center">
                          {employee.profileImage ? (
                            <img 
                              src={employee.profileImage} 
                              alt={employee.name} 
                              className="w-9 h-9 rounded-full object-cover"
                            />
                          ) : (
                            <User size={16} className="text-slate-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-muted-foreground">{employee.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={employee.status === "active" ? "default" : 
                                employee.status === "pending" ? "outline" : "secondary"}
                      >
                        {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(employee.dateHired, "MMM d, yyyy")}</TableCell>
                    <TableCell>${employee.salary.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {onEditEmployee && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => onEditEmployee(employee)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 20h9"></path>
                              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                            </svg>
                            <span className="sr-only">Edit</span>
                          </Button>
                        )}
                        <Button asChild size="sm" variant="ghost">
                          <Link to={`/employed/employee/${employee.id}`}>
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={onToggleSelect ? 8 : 7} className="text-center py-8">
                    No employees found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onEdit={onEditEmployee ? () => onEditEmployee(employee) : undefined}
                isSelected={selectedEmployees.includes(employee.id)}
                onToggleSelect={onToggleSelect ? () => onToggleSelect(employee.id) : undefined}
              />
            ))
          ) : (
            <div className="col-span-3 p-4 text-center text-muted-foreground">
              No employees found. Try adjusting your search or filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Employee Card Component
interface EmployeeCardProps {
  employee: Employee;
  onEdit?: () => void;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

const EmployeeCard = ({ employee, onEdit, isSelected = false, onToggleSelect }: EmployeeCardProps) => {
  // Generate initials if not provided
  const initials = employee.initials || employee.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();

  return (
    <Card className={`overflow-hidden ${isSelected ? 'ring-2 ring-indigo-500' : ''} cursor-pointer transition-shadow hover:shadow-md`}>
      <CardContent className="p-0">
        <div className="p-5 flex items-start">
          {/* Avatar and Name Section */}
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                {employee.profileImage && <AvatarImage src={employee.profileImage} alt={employee.name} />}
                <AvatarFallback className="bg-indigo-100 text-indigo-600">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{employee.name}</h3>
                <div className="flex items-center mt-1">
                  <Badge variant={
                    employee.status === EmployeeStatus.ACTIVE ? "success" : 
                    employee.status === EmployeeStatus.PENDING ? "warning" : "destructive"
                  } className="text-xs">
                    {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                  </Badge>
                  <span className="text-sm text-muted-foreground ml-2">ID: {employee.id}</span>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M20 7h-3a2 2 0 0 1-2-2V2"></path>
                  <path d="M16 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7"></path>
                  <path d="M15 11h2"></path>
                  <path d="M15 15h2"></path>
                  <path d="M7 11h6"></path>
                  <path d="M7 15h6"></path>
                </svg>
                <span>{employee.position}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                <span>{employee.department}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>{employee.email}</span>
              </div>
              {employee.phone && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>{employee.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {onEdit && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }} 
                className="ml-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
                <span className="sr-only">Edit</span>
              </Button>
            )}
            
            {onToggleSelect && (
              <Button 
                variant="outline" 
                size="icon" 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSelect();
                }}
                className="ml-2 rounded-full w-8 h-8 p-0 flex items-center justify-center border-2"
              >
                {isSelected ? (
                  <Circle className="h-5 w-5 fill-primary stroke-primary" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
                <span className="sr-only">{isSelected ? 'Deselect' : 'Select'}</span>
              </Button>
            )}
          </div>
        </div>

        {/* Performance Stats */}
        <div className="bg-muted px-5 py-3 grid grid-cols-3 gap-2 text-center border-t">
          <div>
            <p className="text-sm font-medium">${employee.salary?.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Salary</p>
          </div>
          <div>
            <p className="text-sm font-medium">{format(employee.dateHired, "MMM yyyy")}</p>
            <p className="text-xs text-muted-foreground">Hired</p>
          </div>
          <div>
            <p className="text-sm font-medium">{employee.performanceRating || "-"}/5</p>
            <p className="text-xs text-muted-foreground">Rating</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeesList;
