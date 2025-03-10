
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Employee, EmployeeStatus, SalaryBasis } from "@/types/employee";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface EditEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateEmployee: (employee: Employee) => void;
  employee: Employee | null;
}

const EditEmployeeModal = ({
  open,
  onOpenChange,
  onUpdateEmployee,
  employee,
}: EditEmployeeModalProps) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const defaultValues = {
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    status: EmployeeStatus.ACTIVE,
    dateHired: "",
    reportsTo: "",
    salary: 0,
    salaryBasis: SalaryBasis.YEARLY,
    taxPercentage: 0,
    address: "",
    skills: "",
    education: "",
    background: "",
    performanceRating: 0,
  };

  const form = useForm({
    defaultValues,
  });

  // Update form values when employee changes
  useEffect(() => {
    if (employee) {
      form.reset({
        name: employee.name,
        email: employee.email,
        phone: employee.phone || "",
        position: employee.position,
        department: employee.department,
        status: employee.status as EmployeeStatus,
        dateHired: new Date(employee.dateHired).toISOString().split("T")[0],
        reportsTo: employee.reportsTo || "",
        salary: employee.salary,
        salaryBasis: employee.salaryBasis || SalaryBasis.YEARLY,
        taxPercentage: employee.taxPercentage || 0,
        address: employee.address,
        skills: employee.skills?.join(", ") || "",
        education: employee.education?.join(", ") || "",
        background: employee.background || "",
        performanceRating: employee.performanceRating || 0,
      });
      setProfileImage(employee.profileImage || null);
      setPreviewUrl(employee.profileImage || null);
    }
  }, [employee, form]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        setProfileImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    setProfileImage(null);
  };

  const onSubmit = (data: any) => {
    if (!employee) return;

    const skills = data.skills
      .split(",")
      .map((skill: string) => skill.trim())
      .filter((skill: string) => skill !== "");

    const education = data.education
      .split(",")
      .map((edu: string) => edu.trim())
      .filter((edu: string) => edu !== "");

    const updatedEmployee: Employee = {
      ...employee,
      name: data.name,
      email: data.email,
      phone: data.phone,
      position: data.position,
      department: data.department,
      status: data.status as EmployeeStatus,
      dateHired: new Date(data.dateHired),
      reportsTo: data.reportsTo || undefined,
      salary: Number(data.salary),
      salaryBasis: data.salaryBasis as SalaryBasis,
      taxPercentage: data.taxPercentage ? Number(data.taxPercentage) : undefined,
      address: data.address,
      profileImage: profileImage || undefined,
      skills: skills,
      education: education,
      background: data.background,
      performanceRating: Number(data.performanceRating) || undefined,
    };

    onUpdateEmployee(updatedEmployee);
    onOpenChange(false);
  };

  if (!employee) {
    return null;
  }

  // Generate initials if not provided
  const initials = employee.initials || employee.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogDescription>
            Update employee details and information
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4 pb-4">
              <div className="flex flex-col items-center gap-2">
                <Avatar className="w-24 h-24">
                  {previewUrl ? (
                    <AvatarImage src={previewUrl} alt={employee.name} />
                  ) : (
                    <AvatarFallback className="text-2xl bg-indigo-100 text-indigo-600">
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("profile-upload")?.click()}
                    className="text-xs"
                  >
                    {previewUrl ? "Change" : "Upload"}
                  </Button>
                  {previewUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeImage}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  )}
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="John Doe"
                            required
                          />
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
                          <Input 
                            {...field} 
                            type="email" 
                            placeholder="john.doe@example.com"
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="(123) 456-7890" 
                          />
                        </FormControl>
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select employee status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={EmployeeStatus.ACTIVE}>
                              <div className="flex items-center">
                                <Badge variant="default" className="mr-2">
                                  Active
                                </Badge>
                                <span>Active</span>
                              </div>
                            </SelectItem>
                            <SelectItem value={EmployeeStatus.PENDING}>
                              <div className="flex items-center">
                                <Badge variant="outline" className="mr-2">
                                  Pending
                                </Badge>
                                <span>Pending</span>
                              </div>
                            </SelectItem>
                            <SelectItem value={EmployeeStatus.INACTIVE}>
                              <div className="flex items-center">
                                <Badge variant="secondary" className="mr-2">
                                  Inactive
                                </Badge>
                                <span>Inactive</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Work Information */}
            <div>
              <h3 className="text-lg font-medium mb-4">Work Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Software Engineer" 
                          required
                        />
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
                        <Input 
                          {...field} 
                          placeholder="Engineering" 
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateHired"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Hired</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="date" 
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Salary with basis selection */}
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salary Amount</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            min="0" 
                            step="100" 
                            required 
                          />
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select basis" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={SalaryBasis.YEARLY}>Yearly</SelectItem>
                            <SelectItem value={SalaryBasis.MONTHLY}>Monthly</SelectItem>
                            <SelectItem value={SalaryBasis.WEEKLY}>Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Tax percentage field (optional) */}
                <FormField
                  control={form.control}
                  name="taxPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Percentage (%)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          min="0" 
                          max="100" 
                          step="0.1" 
                          placeholder="Optional"
                        />
                      </FormControl>
                      <FormDescription>
                        Optional: Enter tax percentage to be deducted
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="reportsTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reports To</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Manager's Name" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="performanceRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Performance Rating (0-5)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          min="0" 
                          max="5" 
                          step="0.1" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="123 Main St, City, State, ZIP" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="background"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Background</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Brief background information" 
                          className="min-h-[80px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Skills and Education */}
            <div>
              <h3 className="text-lg font-medium mb-4">Skills & Education</h3>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skills</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Java, TypeScript, React, etc. (comma separated)" 
                        />
                      </FormControl>
                      <FormDescription>
                        Separate skills with commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Education</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="BS Computer Science, MBA, etc. (comma separated)" 
                        />
                      </FormControl>
                      <FormDescription>
                        Separate education entries with commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployeeModal;
