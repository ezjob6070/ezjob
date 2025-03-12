
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { technicianSchema } from "@/lib/validations/technician";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Technician } from "@/types/technician";
import * as z from "zod";
import { TechnicianImageUpload } from "./TechnicianImageUpload";
import { TechnicianBasicInfoFields } from "./TechnicianBasicInfoFields";
import { TechnicianStatusFields } from "./TechnicianStatusFields";
import { TechnicianDateField } from "./TechnicianDateField";

interface EditTechnicianModalProps {
  technician: Technician | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateTechnician: (technician: Technician) => void;
}

export function EditTechnicianModal({ 
  technician, 
  open, 
  onOpenChange,
  onUpdateTechnician 
}: EditTechnicianModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof technicianSchema>>({
    resolver: zodResolver(technicianSchema),
    defaultValues: technician ? {
      name: technician.name,
      email: technician.email,
      phone: technician.phone || "",
      address: technician.address || "",
      specialty: technician.specialty,
      status: technician.status,
      paymentType: technician.paymentType,
      paymentRate: technician.paymentRate.toString(),
      hireDate: technician.hireDate,
      notes: technician.notes || "",
    } : undefined,
  });

  const { mutate: updateTechnician } = useMutation({
    mutationFn: async (values: z.infer<typeof technicianSchema>) => {
      // Simulate API update
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      return values;
    },
    onSuccess: (data) => {
      if (!technician) return;
      
      const updatedTechnician: Technician = {
        ...technician,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        specialty: data.specialty,
        status: data.status,
        paymentType: data.paymentType,
        paymentRate: parseFloat(data.paymentRate),
        hireDate: data.hireDate,
        notes: data.notes,
        imageUrl: selectedImage || technician.imageUrl,
      };
      
      onUpdateTechnician(updatedTechnician);
      
      toast({
        title: "Technician updated successfully!",
      });
      
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Something went wrong.",
        description: error instanceof Error ? error.message : "Failed to update technician.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: z.infer<typeof technicianSchema>) => {
    updateTechnician(data);
  };

  if (!technician) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Technician</DialogTitle>
          <DialogDescription>
            Make changes to your technician here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <TechnicianImageUpload 
              initials={technician.initials} 
              defaultImage={technician.imageUrl} 
              onImageChange={setSelectedImage}
            />
            
            <TechnicianBasicInfoFields control={form.control} />
            
            <TechnicianStatusFields control={form.control} />
            
            <div className="grid gap-2 py-2">
              <div className="flex justify-between text-sm">
                <div className="text-muted-foreground">Pay Rate:</div>
                <div className="font-medium">
                  {technician.paymentType === "percentage"
                    ? `${technician.paymentRate}%`
                    : technician.paymentType === "hourly"
                    ? `$${technician.paymentRate}/hr`
                    : `$${technician.paymentRate} flat`}
                </div>
              </div>
              
              <TechnicianDateField 
                control={form.control}
                name="hireDate"
                label="Hire Date"
                description="The date the technician was hired."
              />
            </div>
            
            <div className="flex justify-end">
              <Button type="submit">Update Technician</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// For backward compatibility
export default EditTechnicianModal;
