
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { technicianSchema } from "@/lib/validations/technician";
import { Technician } from "@/types/technician";
import { getInitials } from "@/lib/utils";
import { SalaryBasis, IncentiveType } from "@/types/employee";

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
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";

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
  const [date, setDate] = useState<Date>();
  
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
    },
  });
  
  function onSubmit(values: z.infer<typeof technicianSchema>) {
    const newTechnician: Technician = {
      id: uuidv4(),
      name: values.name,
      email: values.email,
      phone: values.phone,
      address: values.address,
      specialty: values.specialty,
      status: values.status as "active" | "inactive" | "onLeave",
      paymentType: values.paymentType as "percentage" | "flat" | "hourly",
      paymentRate: Number(values.paymentRate), // Convert string to number
      hireDate: values.hireDate,
      notes: values.notes,
      initials: getInitials(values.name),
      // Default values for new technicians
      completedJobs: 0,
      cancelledJobs: 0,
      totalRevenue: 0,
      rating: 5.0,
      // Default salary-related fields if they're used elsewhere
      salaryBasis: values.paymentType === "hourly" ? SalaryBasis.HOURLY : undefined,
      hourlyRate: values.paymentType === "hourly" ? Number(values.paymentRate) : undefined,
    };
    
    onAddTechnician(newTechnician);
    form.reset();
    onOpenChange(false);
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Technician</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technician Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name" {...field} />
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
                    <FormLabel>Phone Number</FormLabel>
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
                    <FormLabel>Specialty</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Plumbing, Electrical, etc." {...field} />
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
                name="hireDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Hire Date</FormLabel>
                    <div className="grid gap-2">
                      {date ? (
                        <Button
                          variant="outline"
                          className="justify-start text-left font-normal"
                          onClick={() => form.setValue("hireDate", format(date, "yyyy-MM-dd"))}
                          type="button"
                        >
                          {format(date, "PPP")}
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          className="justify-start text-left font-normal"
                          type="button"
                        >
                          Pick a date
                        </Button>
                      )}
                      <div className="border rounded-md p-3">
                        <DatePicker
                          mode="single"
                          selected={date}
                          onSelect={(date) => {
                            setDate(date as Date);
                            if (date) {
                              form.setValue("hireDate", format(date as Date, "yyyy-MM-dd"));
                            }
                          }}
                        />
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address" {...field} />
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
              <Button type="submit">Add Technician</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTechnicianModal;
