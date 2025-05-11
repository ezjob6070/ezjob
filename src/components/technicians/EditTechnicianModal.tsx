import React, { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Technician } from "@/types/technician";
import { technicianEditSchema, TechnicianEditFormValues } from "@/lib/validations/technicianEdit";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TechnicianRoleField } from "./form/TechnicianRoleField";
import TechnicianSubRoleField from "./form/TechnicianSubRoleField";
import { TechnicianDateField } from "./form/TechnicianDateField";
import { TechnicianImageUpload } from "./TechnicianImageUpload";
import { getInitials } from "@/lib/utils";

interface EditTechnicianModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateTechnician: (id: string, values: any) => void;
  technician: Technician | null;
}

const EditTechnicianModal: React.FC<EditTechnicianModalProps> = ({
  open,
  onOpenChange,
  onUpdateTechnician,
  technician,
}) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  const form = useForm<TechnicianEditFormValues>({
    resolver: zodResolver(technicianEditSchema),
    defaultValues: {
      name: technician?.name || "",
      email: technician?.email || "",
      phone: technician?.phone || "",
      address: technician?.address || "",
      specialty: technician?.specialty || "",
      status: technician?.status || "active",
      paymentType: technician?.paymentType || "percentage",
      paymentRate: String(technician?.paymentRate || "50"),
      hireDate: technician?.hireDate || "",
      role: technician?.role || "technician",
      subRole: technician?.subRole || "",
      hourlyRate: String(technician?.hourlyRate || "0"),
      incentiveType: technician?.incentiveType || "none",
      incentiveAmount: String(technician?.incentiveAmount || "0"),
      driverLicenseNumber: typeof technician?.driverLicense === 'object' ? technician?.driverLicense?.number : '',
      driverLicenseState: typeof technician?.driverLicense === 'object' ? technician?.driverLicense?.state : '',
      driverLicenseExpiration: typeof technician?.driverLicense === 'object' ? technician?.driverLicense?.expirationDate : '',
      notes: technician?.notes || "",
    },
  });
  
  useEffect(() => {
    if (technician) {
      form.reset({
        name: technician.name || "",
        email: technician.email || "",
        phone: technician.phone || "",
        address: technician.address || "",
        specialty: technician.specialty || "",
        status: technician.status || "active",
        paymentType: technician.paymentType || "percentage",
        paymentRate: String(technician.paymentRate || "50"),
        hireDate: technician.hireDate || "",
        role: technician.role || "technician",
        subRole: technician.subRole || "",
        hourlyRate: String(technician.hourlyRate || "0"),
        incentiveType: technician.incentiveType || "none",
        incentiveAmount: String(technician.incentiveAmount || "0"),
        driverLicenseNumber: typeof technician?.driverLicense === 'object' ? technician?.driverLicense?.number : '',
        driverLicenseState: typeof technician?.driverLicense === 'object' ? technician?.driverLicense?.state : '',
        driverLicenseExpiration: typeof technician?.driverLicense === 'object' ? technician?.driverLicense?.expirationDate : '',
        notes: technician.notes || "",
      });
      setProfileImage(technician.profileImage || technician.imageUrl || null);
    }
  }, [technician, form]);
  
  function handleProfileImageChange(image: string | null) {
    setProfileImage(image);
  }
  
  function onSubmit(values: TechnicianEditFormValues) {
    if (!technician) return;
    
    const updatedValues = {
      ...values,
      profileImage: profileImage || technician.profileImage,
      imageUrl: profileImage || technician.imageUrl,
    };
    
    onUpdateTechnician(technician.id, updatedValues);
    onOpenChange(false);
  }
  
  if (!technician) {
    return null;
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Staff</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <div className="flex justify-center mb-6">
              <TechnicianImageUpload
                initials={getInitials(form.watch("name") || "TN")}
                onImageChange={handleProfileImageChange}
                size="lg"
                initialImage={profileImage || technician.profileImage || technician.imageUrl || null}
              />
            </div>
            
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
              
              <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
                <TechnicianRoleField control={form.control} defaultValue={technician.role} />
                <TechnicianSubRoleField
                  control={form.control}
                  setValue={form.setValue}
                  defaultValue={technician.subRole}
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
                defaultValue={technician.hireDate}
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
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hourly Rate ($/hour)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter hourly rate" {...field} />
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select incentive type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="bonus">Bonus</SelectItem>
                        <SelectItem value="commission">Commission</SelectItem>
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
                      <Input type="number" placeholder="Enter incentive amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="driverLicenseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Driver's License Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter driver's license number" {...field} />
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
                    <FormLabel>Driver's License State</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter driver's license state" {...field} />
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
                    <FormLabel>Driver's License Expiration</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="Enter driver's license expiration"
                        {...field}
                      />
                    </FormControl>
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
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Staff</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTechnicianModal;
