
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Technician } from "@/types/technician";
import { technicianEditSchema, TechnicianEditFormValues } from "@/lib/validations/technicianEdit";
import { TechnicianBasicInfoFields } from "@/components/technicians/TechnicianBasicInfoFields";
import { TechnicianDateField } from "@/components/technicians/form/TechnicianDateField";
import TechnicianPaymentFields from "@/components/technicians/form/TechnicianPaymentFields";
import { TechnicianStatusFields } from "@/components/technicians/form/TechnicianStatusFields";
import { TechnicianImageUpload } from "@/components/technicians/TechnicianImageUpload";
import { TechnicianRoleField } from "./form/TechnicianRoleField";
import { TechnicianSubRoleField } from "./form/TechnicianSubRoleField";
import { Separator } from "@/components/ui/separator";
import { Shield, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface EditTechnicianModalProps {
  technician: Technician | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateTechnician: (values: TechnicianEditFormValues) => void;
}

const EditTechnicianModal: React.FC<EditTechnicianModalProps> = ({
  technician,
  open,
  onOpenChange,
  onUpdateTechnician,
}) => {
  const [activeTab, setActiveTab] = React.useState("basic");
  
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
      paymentRate: String(technician?.paymentRate || ""),
      startDate: technician?.startDate || "",
      hireDate: technician?.hireDate || "",
      notes: technician?.notes || "",
      department: technician?.department || "",
      position: technician?.position || "",
      salaryBasis: technician?.salaryBasis || "hourly",
      hourlyRate: String(technician?.hourlyRate || ""),
      incentiveType: technician?.incentiveType,
      incentiveAmount: String(technician?.incentiveAmount || ""),
      role: technician?.role || "technician",
      subRole: technician?.subRole || "",
      // Sensitive fields
      ssn: technician?.ssn || "",
      driverLicenseNumber: technician?.driverLicense?.number || "",
      driverLicenseState: technician?.driverLicense?.state || "",
      driverLicenseExpiration: technician?.driverLicense?.expirationDate || "",
      idNumber: technician?.idNumber || "",
      workContract: technician?.workContract || "",
    },
  });

  // Add state for profile image
  const [profileImage, setProfileImage] = React.useState<string | null>(
    technician?.profileImage || technician?.imageUrl || null
  );

  function onSubmitForm(values: TechnicianEditFormValues) {
    // Format driver's license data for the update
    const formattedValues = {
      ...values,
      profileImage: profileImage,
      driverLicense: values.driverLicenseNumber ? {
        number: values.driverLicenseNumber,
        state: values.driverLicenseState,
        expirationDate: values.driverLicenseExpiration,
      } : undefined
    };
    
    onUpdateTechnician(formattedValues);
    onOpenChange(false);
  }

  if (!technician) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Staff</AlertDialogTitle>
          <AlertDialogDescription>
            Make changes to the profile here. Click save when
            you're done.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitForm)}
            className="space-y-4"
          >
            <div className="flex justify-center mb-4">
              <TechnicianImageUpload
                initials={technician.initials || ""}
                defaultImage={profileImage}
                onImageChange={setProfileImage}
                size="lg"
              />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="sensitive">Sensitive Information</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <TechnicianBasicInfoFields control={form.control} />
                  
                  {/* Role and SubRole fields side by side */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <TechnicianRoleField 
                      control={form.control} 
                      defaultValue={technician.role || "technician"} 
                    />
                    <TechnicianSubRoleField 
                      control={form.control}
                      setValue={form.setValue}
                      defaultValue={technician.subRole}
                    />
                  </div>
                  
                  <TechnicianStatusFields control={form.control} />
                  
                  <TechnicianPaymentFields 
                    control={form.control} 
                    defaultSalaryBasis={technician.salaryBasis || "hourly"}
                    defaultIncentiveType={technician.incentiveType as any}
                  />
                  
                  <TechnicianDateField
                    control={form.control}
                    name="startDate"
                    label="Start Date"
                  />
                  
                  <TechnicianDateField
                    control={form.control}
                    name="hireDate"
                    label="Hire Date"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="sensitive" className="space-y-4 pt-4">
                {/* Sensitive Information Section */}
                <div className="bg-amber-50 p-4 rounded-lg space-y-4">
                  <div className="flex items-center mb-4">
                    <Shield className="h-5 w-5 mr-2 text-amber-500" />
                    <h3 className="text-base font-semibold">Sensitive Information</h3>
                  </div>
                  
                  {/* SSN */}
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
                  
                  {/* Driver's License */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Driver's License</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
                            <FormLabel>Expiration Date</FormLabel>
                            <FormControl>
                              <Input placeholder="MM/DD/YYYY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* ID Number */}
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
                  
                  {/* Work Contract */}
                  <div className="pt-4">
                    <div className="flex items-center mb-2">
                      <FileText className="h-5 w-5 mr-2 text-amber-500" />
                      <h4 className="text-base font-semibold">Work Contract</h4>
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
                  </div>
                  
                  <p className="text-xs text-amber-700">
                    This information is sensitive and should be handled with care.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
            
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => onOpenChange(false)}>Cancel</AlertDialogCancel>
              <Button type="submit">Save Changes</Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditTechnicianModal;
