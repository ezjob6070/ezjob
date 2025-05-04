
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { SALARY_BASIS, SALARY_BASIS_SELECT_OPTIONS, EMPLOYEE_STATUS, EMPLOYEE_STATUS_SELECT_OPTIONS } from '@/types/employee';
import { useToast } from '@/hooks/use-toast';

const AddEmployee = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    location: '',
    salary: '',
    salaryBasis: SALARY_BASIS.ANNUAL,
    status: EMPLOYEE_STATUS.ACTIVE,
    hireDate: '',
    address: '',
    manager: '',
    taxPercentage: '',
    skills: '',
    background: '',
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'position', 'department', 'location', 'salary', 'hireDate'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill in: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }
    
    // Success
    toast({
      title: "Employee Added",
      description: `${formData.name} has been added successfully.`,
    });
    
    // Navigate back to employees list
    navigate('/employed');
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Add New Employee</h1>
          <p className="text-muted-foreground">Enter employee information and personal details</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Employee personal and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter address"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Employment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Employment Information</CardTitle>
              <CardDescription>Job details and organizational placement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Position <span className="text-red-500">*</span></Label>
                  <Input
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="Enter position"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department <span className="text-red-500">*</span></Label>
                  <Input
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="Enter department"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter location"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manager">Manager</Label>
                  <Input
                    id="manager"
                    name="manager"
                    value={formData.manager}
                    onChange={handleInputChange}
                    placeholder="Enter manager name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hireDate">Hire Date <span className="text-red-500">*</span></Label>
                  <Input
                    id="hireDate"
                    name="hireDate"
                    type="date"
                    value={formData.hireDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
                  <Select 
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {EMPLOYEE_STATUS_SELECT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Compensation */}
          <Card>
            <CardHeader>
              <CardTitle>Compensation</CardTitle>
              <CardDescription>Salary and tax information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary <span className="text-red-500">*</span></Label>
                  <Input
                    id="salary"
                    name="salary"
                    type="number"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="Enter salary amount"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salaryBasis">Salary Basis</Label>
                  <Select 
                    value={formData.salaryBasis}
                    onValueChange={(value) => handleSelectChange('salaryBasis', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select basis" />
                    </SelectTrigger>
                    <SelectContent>
                      {SALARY_BASIS_SELECT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxPercentage">Tax Percentage (%)</Label>
                  <Input
                    id="taxPercentage"
                    name="taxPercentage"
                    type="number"
                    value={formData.taxPercentage}
                    onChange={handleInputChange}
                    placeholder="Enter tax percentage"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Skills & Background */}
          <Card>
            <CardHeader>
              <CardTitle>Skills & Background</CardTitle>
              <CardDescription>Professional skills and experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Input
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="E.g. Project Management, Microsoft Office, Team Leadership"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="background">Professional Background</Label>
                <Textarea
                  id="background"
                  name="background"
                  value={formData.background}
                  onChange={handleInputChange}
                  placeholder="Enter professional background and experience"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
              <CardDescription>Person to contact in case of emergency</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactName">Name</Label>
                  <Input
                    id="emergencyContactName"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange}
                    placeholder="Enter contact name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactRelation">Relationship</Label>
                  <Input
                    id="emergencyContactRelation"
                    name="emergencyContactRelation"
                    value={formData.emergencyContactRelation}
                    onChange={handleInputChange}
                    placeholder="E.g. Spouse, Parent, Sibling"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactPhone">Phone</Label>
                  <Input
                    id="emergencyContactPhone"
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={handleInputChange}
                    placeholder="Enter contact phone"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <CardFooter className="px-0 flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => navigate('/employed')}>
              Cancel
            </Button>
            <Button type="submit">Save Employee</Button>
          </CardFooter>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
