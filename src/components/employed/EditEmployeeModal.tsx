
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Employee, EMPLOYEE_STATUS, INCENTIVE_TYPE, SALARY_BASIS } from '@/types/employee';
import { format } from 'date-fns';

export interface EditEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  employee: Employee;
  onEmployeeUpdate: (employee: Employee) => void;
}

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({ 
  open, 
  onClose, 
  employee, 
  onEmployeeUpdate 
}) => {
  const [editedEmployee, setEditedEmployee] = useState<Employee>({ ...employee });
  const { toast } = useToast();

  useEffect(() => {
    setEditedEmployee({ ...employee });
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setEditedEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedEmployee(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Make sure all required fields are filled
    if (!editedEmployee.name || !editedEmployee.email || !editedEmployee.position) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    // Ensure salary basis is of the correct enum type
    const updatedEmployee: Employee = {
      ...editedEmployee,
      salaryBasis: editedEmployee.salaryBasis as SALARY_BASIS,
      incentiveType: editedEmployee.incentiveType as INCENTIVE_TYPE,
      status: editedEmployee.status as EMPLOYEE_STATUS
    };
    
    onEmployeeUpdate(updatedEmployee);
    
    toast({
      title: 'Employee Updated',
      description: `${updatedEmployee.name}'s information has been updated successfully.`,
    });
    
    onClose();
  };

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return format(date, 'yyyy-MM-dd');
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Employee: {employee.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={editedEmployee.name}
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
                value={editedEmployee.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={editedEmployee.phone}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                name="position"
                value={editedEmployee.position}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                value={editedEmployee.department}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={editedEmployee.location}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={String(editedEmployee.status)}
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
              <Label htmlFor="hireDate">Hire Date</Label>
              <Input
                id="hireDate"
                name="hireDate"
                type="date"
                value={formatDateForInput(editedEmployee.hireDate || editedEmployee.dateHired)}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                name="salary"
                type="number"
                value={editedEmployee.salary}
                onChange={handleNumberChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salaryBasis">Salary Basis</Label>
              <Select
                value={String(editedEmployee.salaryBasis)}
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
              <Label htmlFor="incentiveType">Incentive Type</Label>
              <Select
                value={String(editedEmployee.incentiveType || INCENTIVE_TYPE.NONE)}
                onValueChange={(value) => handleSelectChange('incentiveType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select incentive type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(INCENTIVE_TYPE).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="incentiveAmount">Incentive Amount</Label>
              <Input
                id="incentiveAmount"
                name="incentiveAmount"
                type="number"
                value={editedEmployee.incentiveAmount || 0}
                onChange={handleNumberChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="manager">Manager</Label>
              <Input
                id="manager"
                name="manager"
                value={editedEmployee.manager}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="performanceRating">Performance Rating (1-5)</Label>
              <Input
                id="performanceRating"
                name="performanceRating"
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={editedEmployee.performanceRating || ''}
                onChange={handleNumberChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={editedEmployee.address || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="background">Professional Background</Label>
            <Textarea
              id="background"
              name="background"
              value={editedEmployee.background || ''}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployeeModal;
