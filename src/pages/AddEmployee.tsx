
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { v4 as uuidv4 } from "uuid";
import { 
  Employee, 
  EMPLOYEE_STATUS,
  EMPLOYEE_STATUS_OPTIONS,
  SALARY_BASIS,
  SALARY_BASIS_OPTIONS
} from "@/types/employee";
import { ArrowLeft } from "lucide-react";

const AddEmployee = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: "",
    position: "",
    department: "",
    email: "",
    phone: "",
    status: EMPLOYEE_STATUS.ACTIVE,
    salary: 0,
    salaryBasis: SALARY_BASIS.HOURLY,
    hireDate: new Date().toISOString().split('T')[0],
    dateHired: new Date().toISOString().split('T')[0],
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData(prev => ({ ...prev, salary: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get existing employees from localStorage or initialize empty array
    const existingEmployees = JSON.parse(localStorage.getItem('employees') || '[]');
    
    // Create new employee with UUID
    const newEmployee: Employee = {
      ...formData as Employee,
      id: uuidv4(),
    };
    
    // Add new employee to the array
    const updatedEmployees = [newEmployee, ...existingEmployees];
    
    // Save back to localStorage
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    
    // Show success toast
    toast({
      title: "Employee Added Successfully",
      description: `${newEmployee.name} has been added to your employees`,
    });
    
    // Navigate back to employees list
    navigate("/employed");
  };
  
  return (
    <div className="space-y-6 py-8">
      <div className="flex items-center">
        <Button 
          variant="outline" 
          onClick={() => navigate("/employed")}
          className="mr-4"
          size="icon"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold leading-tight tracking-tighter">
            Add New Employee
          </h1>
          <p className="text-muted-foreground mt-1">
            Create a new employee record in the system
          </p>
        </div>
      </div>
      
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  placeholder="(123) 456-7890"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position">Job Position *</Label>
                <Input 
                  id="position" 
                  name="position" 
                  value={formData.position} 
                  onChange={handleInputChange} 
                  placeholder="Sales Manager"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Input 
                  id="department" 
                  name="department" 
                  value={formData.department} 
                  onChange={handleInputChange} 
                  placeholder="Sales"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hireDate">Hire Date *</Label>
                <Input 
                  id="hireDate" 
                  name="hireDate" 
                  type="date" 
                  value={formData.hireDate} 
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salary">Salary/Rate *</Label>
                <Input 
                  id="salary" 
                  name="salary" 
                  type="number" 
                  value={formData.salary} 
                  onChange={handleSalaryChange} 
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salaryBasis">Salary Basis *</Label>
                <Select 
                  value={formData.salaryBasis} 
                  onValueChange={(value) => handleSelectChange('salaryBasis', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select salary basis" />
                  </SelectTrigger>
                  <SelectContent>
                    {SALARY_BASIS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee status" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYEE_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  name="address" 
                  value={formData.address || ''} 
                  onChange={handleInputChange} 
                  placeholder="123 Main St, City, State, ZIP"
                />
              </div>
            </div>
            
            <div className="pt-4 flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/employed")}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white"
              >
                Save Employee
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddEmployee;
