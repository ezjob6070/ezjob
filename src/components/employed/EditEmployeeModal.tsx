
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import {
  Employee,
  EMPLOYEE_STATUS,
  SALARY_BASIS,
  INCENTIVE_TYPE,
  getInitials
} from "@/types/employee";
import { format } from "date-fns";

const employeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Phone must be at least 6 characters"),
  position: z.string().min(2, "Position must be at least 2 characters"),
  department: z.string().min(2, "Department must be at least 2 characters"),
  location: z.string(),
  status: z.string(),
  salary: z.coerce.number().positive("Salary must be positive"),
  salaryBasis: z.string(),
  address: z.string().optional(),
  manager: z.string().optional(),
  reportsTo: z.string().optional(),
  hourlyRate: z.coerce.number().optional(),
  incentiveType: z.string().optional(),
  incentiveAmount: z.coerce.number().optional(),
  background: z.string().optional(),
  certifications: z.string().optional(),
  skills: z.string().optional(),
  education: z.string().optional(),
  taxPercentage: z.coerce.number().optional(),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface EditEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateEmployee: (employee: Employee) => void;
  employee: Employee;
}

export default function EditEmployeeModal({
  open,
  onOpenChange,
  onUpdateEmployee,
  employee,
}: EditEmployeeModalProps) {
  const { toast } = useToast();
  
  // Format the certifications, skills, education into comma-separated strings
  const certificationsStr = employee.certifications ? employee.certifications.join(", ") : "";
  const skillsStr = employee.skills ? employee.skills.join(", ") : "";
  const educationStr = Array.isArray(employee.education) ? employee.education.join(", ") : employee.education || "";
  
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      location: employee.location || "",
      status: employee.status,
      salary: employee.salary,
      salaryBasis: employee.salaryBasis,
      address: employee.address || "",
      manager: employee.manager || "",
      reportsTo: employee.reportsTo || "",
      hourlyRate: employee.hourlyRate || 0,
      incentiveType: employee.incentiveType || "",
      incentiveAmount: employee.incentiveAmount || 0,
      background: employee.background || "",
      certifications: certificationsStr,
      skills: skillsStr,
      education: educationStr,
      taxPercentage: employee.taxPercentage || 0,
    },
  });
  
  useEffect(() => {
    if (open) {
      form.reset({
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        position: employee.position,
        department: employee.department,
        location: employee.location || "",
        status: employee.status,
        salary: employee.salary,
        salaryBasis: employee.salaryBasis,
        address: employee.address || "",
        manager: employee.manager || "",
        reportsTo: employee.reportsTo || "",
        hourlyRate: employee.hourlyRate || 0,
        incentiveType: employee.incentiveType || "",
        incentiveAmount: employee.incentiveAmount || 0,
        background: employee.background || "",
        certifications: certificationsStr,
        skills: skillsStr,
        education: educationStr,
        taxPercentage: employee.taxPercentage || 0,
      });
    }
  }, [open, employee, certificationsStr, skillsStr, educationStr, form]);

  const onSubmit = (values: EmployeeFormValues) => {
    try {
      // Convert comma-separated strings back to arrays
      const certifications = values.certifications 
        ? values.certifications.split(',').map(cert => cert.trim()).filter(cert => cert)
        : [];
      
      const skills = values.skills
        ? values.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
        : [];
      
      const education = values.education
        ? values.education.split(',').map(edu => edu.trim()).filter(edu => edu)
        : [];
      
      const updatedEmployee: Employee = {
        ...employee,
        name: values.name,
        email: values.email,
        phone: values.phone,
        position: values.position,
        department: values.department,
        location: values.location,
        status: values.status,
        salary: values.salary,
        salaryBasis: values.salaryBasis,
        address: values.address,
        manager: values.manager || "",
        reportsTo: values.reportsTo || "",
        hourlyRate: values.hourlyRate,
        incentiveType: values.incentiveType,
        incentiveAmount: values.incentiveAmount,
        background: values.background,
        certifications: certifications,
        skills: skills,
        education: education,
        taxPercentage: values.taxPercentage,
      };
      
      onUpdateEmployee(updatedEmployee);
      
      toast({
        title: "Employee Updated",
        description: `${values.name}'s information has been successfully updated.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating employee:", error);
      toast({
        title: "Error",
        description: "There was an error updating the employee. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center gap-4 my-4">
          <Avatar className="h-16 w-16">
            {employee.profileImage ? (
              <AvatarImage src={employee.profileImage} alt={employee.name} />
            ) : (
              <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <h3 className="font-medium">{employee.name}</h3>
            <p className="text-sm text-muted-foreground">{employee.position}</p>
            <p className="text-xs text-muted-foreground">Employee since {employee.dateHired && format(new Date(employee.dateHired), "MMM yyyy")}</p>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Main Office">Main Office</SelectItem>
                        <SelectItem value="Branch Office">Branch Office</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                        <SelectItem value="Field">Field</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={EMPLOYEE_STATUS.ACTIVE}>Active</SelectItem>
                        <SelectItem value={EMPLOYEE_STATUS.INACTIVE}>Inactive</SelectItem>
                        <SelectItem value={EMPLOYEE_STATUS.ON_LEAVE}>On Leave</SelectItem>
                        <SelectItem value={EMPLOYEE_STATUS.PENDING}>Pending</SelectItem>
                        <SelectItem value={EMPLOYEE_STATUS.CONTRACT}>Contract</SelectItem>
                        <SelectItem value={EMPLOYEE_STATUS.PROBATION}>Probation</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="salaryBasis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary Basis</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select basis" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={SALARY_BASIS.HOURLY}>Hourly</SelectItem>
                        <SelectItem value={SALARY_BASIS.ANNUAL}>Annual</SelectItem>
                        <SelectItem value={SALARY_BASIS.WEEKLY}>Weekly</SelectItem>
                        <SelectItem value={SALARY_BASIS.MONTHLY}>Monthly</SelectItem>
                        <SelectItem value={SALARY_BASIS.YEARLY}>Yearly</SelectItem>
                        <SelectItem value={SALARY_BASIS.COMMISSION}>Commission</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="manager"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manager</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="taxPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Percentage</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Advanced Financial Info Section */}
            <div className="p-4 border rounded-lg space-y-4">
              <h3 className="font-medium">Additional Financial Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="hourlyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hourly Rate</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="incentiveType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Incentive Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          <SelectItem value={INCENTIVE_TYPE.BONUS}>Bonus</SelectItem>
                          <SelectItem value={INCENTIVE_TYPE.COMMISSION}>Commission</SelectItem>
                          <SelectItem value={INCENTIVE_TYPE.HOURLY}>Per Hour</SelectItem>
                          <SelectItem value={INCENTIVE_TYPE.WEEKLY}>Per Week</SelectItem>
                          <SelectItem value={INCENTIVE_TYPE.MONTHLY}>Per Month</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="incentiveAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Incentive Amount</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Background and Skills Section */}
            <div>
              <FormField
                control={form.control}
                name="background"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Background</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills (comma-separated)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Leadership, Project Management, etc." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="certifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certifications (comma-separated)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="PMP, OSHA, etc." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="education"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Education (comma-separated)</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="BS Civil Engineering, MBA, etc." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
