
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Technician } from "@/types/technician";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as z from "zod";
import { TechnicianImageUpload } from "./TechnicianImageUpload";
import { TechnicianBasicInfoFields } from "./TechnicianBasicInfoFields";
import { TechnicianStatusFields } from "./TechnicianStatusFields";
import { TechnicianDateField } from "./TechnicianDateField";
import { Textarea } from "@/components/ui/textarea";

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
  const [activeTab, setActiveTab] = useState("basic");
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
      department: technician.department || "",
      position: technician.position || "",
      contractType: technician.contractType || "fullTime",
      salaryBasis: technician.salaryBasis || "HOURLY",
      hourlyRate: technician.hourlyRate?.toString() || "",
      incentiveType: technician.incentiveType || "HOURLY",
      incentiveAmount: technician.incentiveAmount?.toString() || "",
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
        department: data.department,
        position: data.position,
        contractType: data.contractType,
        salaryBasis: data.salaryBasis as any,
        hourlyRate: data.hourlyRate ? parseFloat(data.hourlyRate) : undefined,
        incentiveType: data.incentiveType as any,
        incentiveAmount: data.incentiveAmount ? parseFloat(data.incentiveAmount) : undefined,
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Technician</DialogTitle>
          <DialogDescription>
            Make changes to your technician here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="flex justify-between items-start mb-6">
              <TechnicianImageUpload 
                initials={technician.initials} 
                defaultImage={technician.imageUrl} 
                onImageChange={setSelectedImage}
              />
              
              <div className="flex flex-col items-end">
                <div className="text-sm font-medium">{technician.name}</div>
                <div className="text-sm text-muted-foreground">{technician.email}</div>
              </div>
            </div>
            
            <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="contract">Contract</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4 mt-0">
                <TechnicianBasicInfoFields control={form.control} />
                
                <TechnicianDateField 
                  control={form.control}
                  name="hireDate"
                  label="Hire Date"
                  description="The date the technician was hired."
                />
              </TabsContent>
              
              <TabsContent value="contract" className="space-y-4 mt-0">
                <TechnicianBasicInfoFields control={form.control} showContractFields={true} />
              </TabsContent>
              
              <TabsContent value="payment" className="space-y-4 mt-0">
                <TechnicianStatusFields control={form.control} showAdvancedFields={true} />
              </TabsContent>
              
              <TabsContent value="notes" className="space-y-4 mt-0">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add notes about this technician..."
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Technician</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// For backward compatibility
export default EditTechnicianModal;
