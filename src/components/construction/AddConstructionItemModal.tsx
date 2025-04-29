
import * as React from "react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

type ConstructionItemType = "project" | "equipment" | "material" | "inspection" | "safety-report";

interface AddConstructionItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: ConstructionItemType;
  onSubmit: (data: any) => void;
}

// Common form fields for all construction items
const baseSchema = {
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
};

// Type-specific fields
const schemaMap: Record<ConstructionItemType, z.ZodObject<any>> = {
  project: z.object({
    ...baseSchema,
    type: z.string().min(1, "Type is required"),
    location: z.string().min(1, "Location is required"),
  }),
  equipment: z.object({
    ...baseSchema,
    status: z.string().min(1, "Status is required"),
    lastMaintenance: z.string().optional(),
  }),
  material: z.object({
    ...baseSchema,
    quantity: z.string().min(1, "Quantity is required"),
    unit: z.string().min(1, "Unit is required"),
  }),
  inspection: z.object({
    ...baseSchema,
    project: z.string().min(1, "Project is required"),
    date: z.string().min(1, "Date is required"),
  }),
  "safety-report": z.object({
    ...baseSchema,
    project: z.string().min(1, "Project is required"),
    date: z.string().min(1, "Date is required"),
    severity: z.string().min(1, "Severity level is required"),
  }),
};

const titleMap: Record<ConstructionItemType, string> = {
  project: "New Project",
  equipment: "Add Equipment",
  material: "Add Material",
  inspection: "Create Inspection",
  "safety-report": "Report Safety Issue",
};

export const AddConstructionItemModal = ({
  open,
  onOpenChange,
  type,
  onSubmit,
}: AddConstructionItemModalProps) => {
  const schema = schemaMap[type];
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });
  
  const handleSubmit = (data: z.infer<typeof schema>) => {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
    
    toast.success(`${titleMap[type]} created successfully`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{titleMap[type]}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Project-specific fields */}
            {type === "project" && (
              <>
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Commercial, Residential" {...field} />
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
                      <FormControl>
                        <Input placeholder="Project location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            {/* Equipment-specific fields */}
            {type === "equipment" && (
              <>
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Available, In Use, Under Repair" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastMaintenance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Maintenance Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            {/* Material-specific fields */}
            {type === "material" && (
              <>
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., kg, tons, pieces" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            {/* Inspection & Safety Report fields */}
            {(type === "inspection" || type === "safety-report") && (
              <>
                <FormField
                  control={form.control}
                  name="project"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project</FormLabel>
                      <FormControl>
                        <Input placeholder="Select project" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            {/* Safety-report-specific fields */}
            {type === "safety-report" && (
              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Severity Level</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Low, Medium, High" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
