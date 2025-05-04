
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Employee, EMPLOYEE_STATUS, SALARY_BASIS } from '@/types/employee';
import { v4 as uuidv4 } from 'uuid';

export interface AddEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  onAddEmployee?: (employee: Employee) => void;
}

const defaultEmployee: Partial<Employee> = {
  name: '',
  email: '',
  phone: '',
  position: '',
  department: '',
  location: 'Main Office',
  status: EMPLOYEE_STATUS.ACTIVE,
  salary: 0,
  salaryBasis: SALARY_BASIS.ANNUAL,
  manager: '',
};

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ open, onClose, onAddEmployee }) => {
  const [employee, setEmployee] = useState<Partial<Employee>>(defaultEmployee);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEmployee: Employee = {
      ...employee,
      id: `emp-${uuidv4().slice(0, 8)}`,
      hireDate: new Date().toISOString(),
      name: employee.name || '',
      email: employee.email || '',
      phone: employee.phone || '',
      position: employee.position || '',
      department: employee.department || '',
      status: employee.status || EMPLOYEE_STATUS.ACTIVE,
      salary: Number(employee.salary) || 0,
      salaryBasis: employee.salaryBasis as SALARY_BASIS,
      manager: employee.manager || '',
      location: employee.location || 'Main Office',
      documents: [],
      notes: [],
    };

    if (onAddEmployee) {
      onAddEmployee(newEmployee);
    }
    
    toast({
      title: 'Employee Added',
      description: `${newEmployee.name} has been added successfully.`,
    });
    
    setEmployee(defaultEmployee);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={employee.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={employee.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={employee.phone}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                name="position"
                value={employee.position}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                value={employee.department}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={employee.status?.toString()}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(EMPLOYEE_STATUS).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                name="salary"
                type="number"
                value={employee.salary?.toString()}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salaryBasis">Salary Basis</Label>
              <Select
                value={employee.salaryBasis}
                onValueChange={(value) => handleSelectChange('salaryBasis', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select salary basis" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(SALARY_BASIS).map((basis) => (
                    <SelectItem key={basis} value={basis}>
                      {basis.charAt(0).toUpperCase() + basis.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="manager">Manager</Label>
              <Input
                id="manager"
                name="manager"
                value={employee.manager}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={employee.location}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="background">Professional Background</Label>
            <Textarea
              id="background"
              name="background"
              value={employee.background || ''}
              onChange={handleChange}
              rows={4}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Employee
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeModal;
