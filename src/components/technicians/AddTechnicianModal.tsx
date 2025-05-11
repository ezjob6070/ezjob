
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { technicianSchema } from "@/lib/validations/technician";
import { Technician, SalaryBasis } from "@/types/technician";
import { getInitials } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TechnicianDateField } from "./form/TechnicianDateField";
import { TechnicianImageUpload } from "./TechnicianImageUpload";
import { TechnicianRoleField } from "./form/TechnicianRoleField";
import TechnicianSubRoleField from "./form/TechnicianSubRoleField";
import { Shield, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface AddTechnicianModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTechnician: (technician: Technician) => void;
}

const AddTechnicianModal: React.FC<AddTechnicianModalProps> = ({ 
  open, 
  onOpenChange, 
  onAddTechnician 
}) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  
  const form = useForm<z.infer<typeof technicianSchema>>({
    resolver: zodResolver(technicianSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      specialty: "",
      status: "active",
      paymentType: "percentage",
      paymentRate: "50",
      hireDate: "",
      notes: "",
      role: "technician",
      subRole: "",
      ssn: "",
      driverLicenseNumber: "",
      driverLicenseState: "",
      driverLicenseExpiration: "",
      idNumber: "",
      workContract: "",
    },
  });
  
  function handleProfileImageChange(image: string | null) {
    setProfileImage(image);
  }
  
  function onSubmit(values: z.infer<typeof technicianSchema>) {
    const initials = getInitials(values.name);
    
    const newTechnician: Technician = {
      id: uuidv4(),
      name: values.name,
      email: values.email,
      phone: values.phone,
      address: values.address,
      specialty: values.specialty,
      status: values.status as "active" | "inactive" | "onLeave",
      paymentType: values.paymentType as "percentage" | "flat" | "hourly" | "salary",
      paymentRate: Number(values.paymentRate),
      hireDate: values.hireDate,
      notes: values.notes,
      initials,
      // Default values for new technicians
      completedJobs: 0,
      cancelledJobs: 0,
      totalRevenue: 0,
      rating: 5.0,
      // Include profile image if selected
      profileImage: profileImage || undefined,
      imageUrl: profileImage || undefined,
      // Default salary-related fields
      salaryBasis: values.salaryBasis || "hourly",
      hourlyRate: values.paymentType === "hourly" ? Number(values.paymentRate) : 0,
      // Add the role field
      role: values.role,
      // Add the sub-role if provided
      subRole: values.subRole || undefined,
      // Add sensitive fields if provided
      ssn: values.ssn || undefined,
      idNumber: values.idNumber || undefined,
      // Add driver's license if provided
      driverLicense: values.driverLicenseNumber ? {
        number: values.driverLicenseNumber,
        state: values.driverLicenseState || "",
        expirationDate: values.driverLicenseExpiration || "",
      } : undefined,
      // Add work contract field
      workContract: values.workContract || undefined,
    };
    
    onAddTechnician(newTechnician);
    setProfileImage(null);
    form.reset();
    setActiveTab("basic");
    onOpenChange(false);
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Staff</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <div className="flex justify-center mb-6">
              <TechnicianImageUpload
                initials={getInitials(form.watch("name") || "TN")}
                onImageChange={handleProfileImageChange}
                size="lg"
              />
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="sensitive">Sensitive Information</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Role and SubRole fields side by side */}
                  <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
                    <TechnicianRoleField control={form.control} />
                    <TechnicianSubRoleField 
                      control={form.control}
                      setValue={form.setValue}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" {...field} />
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
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="specialty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialty *</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., Plumbing, Electrical, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <TechnicianDateField
                    control={form.control}
                    name="hireDate"
                    label="Hire Date *"
                  />
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter address" {...field} />
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
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="onLeave">On Leave</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="paymentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage</SelectItem>
                            <SelectItem value="flat">Flat Rate</SelectItem>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="salary">Salary</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="paymentRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {form.watch("paymentType") === "percentage"
                            ? "Percentage Rate (%)"
                            : form.watch("paymentType") === "flat"
                            ? "Flat Rate ($)"
                            : "Hourly Rate ($/hour)"}
                        </FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter rate" {...field} />
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
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select salary basis" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="annually">Annually</SelectItem>
                            <SelectItem value="commission">Commission</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional notes about the technician"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="sensitive" className="space-y-6 py-4">
                <div className="bg-amber-50 p-4 rounded-lg space-y-6">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-amber-500" />
                    <h3 className="font-medium text-amber-700">Sensitive Information (Optional)</h3>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="ssn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Social Security Number</FormLabel>
                        <FormControl>
                          <Input placeholder="XXX-XX-XXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="idNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID Number</FormLabel>
                        <FormControl>
                          <Input placeholder="ID number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Driver's License Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="driverLicenseNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>License Number</FormLabel>
                            <FormControl>
                              <Input placeholder="License number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="driverLicenseState"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="State" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="driverLicenseExpiration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiration</FormLabel>
                            <FormControl>
                              <Input placeholder="MM/DD/YYYY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2">
                    <FileText className="h-5 w-5 text-amber-500" />
                    <h3 className="font-medium text-amber-700">Work Contract</h3>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="workContract"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contract Reference</FormLabel>
                        <FormControl>
                          <Input placeholder="Contract ID or reference" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <p className="text-xs text-amber-700 mt-2">
                    This information is sensitive and should be handled with care.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Staff</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTechnicianModal;
