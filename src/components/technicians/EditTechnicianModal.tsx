
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
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Technician } from "@/types/technician";
import { technicianEditSchema, TechnicianEditFormValues } from "@/lib/validations/technicianEdit";
import { TechnicianBasicInfoFields } from "@/components/technicians/TechnicianBasicInfoFields";
import { TechnicianDateField } from "@/components/technicians/form/TechnicianDateField";
import TechnicianPaymentFields from "@/components/technicians/form/TechnicianPaymentFields";
import { TechnicianStatusFields } from "@/components/technicians/form/TechnicianStatusFields";
import { TechnicianImageUpload } from "@/components/technicians/TechnicianImageUpload";

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
      salaryBasis: technician?.salaryBasis,
      hourlyRate: String(technician?.hourlyRate || ""),
      incentiveType: technician?.incentiveType,
      incentiveAmount: String(technician?.incentiveAmount || ""),
    },
  });

  // Add state for profile image
  const [profileImage, setProfileImage] = React.useState<string | null>(
    technician?.profileImage || technician?.imageUrl || null
  );

  function onSubmitForm(values: TechnicianEditFormValues) {
    // Include the profile image in the update
    onUpdateTechnician({
      ...values,
      profileImage: profileImage,
    });
    onOpenChange(false);
  }

  if (!technician) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Technician</AlertDialogTitle>
          <AlertDialogDescription>
            Make changes to the technician's profile here. Click save when
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

            <div className="space-y-4">
              <TechnicianBasicInfoFields control={form.control} />
              
              <TechnicianStatusFields control={form.control} />
              
              <TechnicianPaymentFields 
                control={form.control} 
                defaultSalaryBasis={technician.salaryBasis}
                defaultIncentiveType={technician.incentiveType as any}
              />
              
              <TechnicianDateField
                control={form.control}
                name="startDate"
                label="Start Date"
                description="When did the technician start working?"
              />
              
              <TechnicianDateField
                control={form.control}
                name="hireDate"
                label="Hire Date"
                description="When was the technician officially hired?"
              />
            </div>
            
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
