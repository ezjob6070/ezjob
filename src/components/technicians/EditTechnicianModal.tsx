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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Technician } from "@/types/technician";
import { cn } from "@/lib/utils";
import { DatePicker } from "@/components/ui/date-picker";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  SalaryBasis,
  IncentiveType,
  SALARY_BASIS_OPTIONS,
  INCENTIVE_TYPE_OPTIONS,
} from "@/types/employee";

export interface EditTechnicianModalProps {
  technician: Technician;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateTechnician: (values: z.infer<typeof formSchema>) => void;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Technician name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  phone: z.string().optional(),
  address: z.string().optional(),
  specialty: z.string().min(2, {
    message: "Specialty must be at least 2 characters.",
  }),
  status: z.enum(["active", "inactive", "onLeave"]),
  paymentType: z.enum(["percentage", "flat", "hourly"]),
  paymentRate: z.string().refine((value) => {
    try {
      const num = parseFloat(value);
      return !isNaN(num) && num >= 0;
    } catch (e) {
      return false;
    }
  }, {
    message: "Payment rate must be a valid number.",
  }),
  startDate: z.string().optional(),
  hireDate: z.string(),
  notes: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  salaryBasis: z.nativeEnum(SalaryBasis).optional(),
  hourlyRate: z.string().optional(),
  incentiveType: z.nativeEnum(IncentiveType).optional(),
  incentiveAmount: z.string().optional(),
});

const EditTechnicianModal: React.FC<EditTechnicianModalProps> = ({
  technician,
  open,
  onOpenChange,
  onUpdateTechnician,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: technician.name || "",
      email: technician.email || "",
      phone: technician.phone || "",
      address: technician.address || "",
      specialty: technician.specialty || "",
      status: technician.status || "active",
      paymentType: technician.paymentType || "percentage",
      paymentRate: String(technician.paymentRate || ""),
      startDate: technician.startDate || "",
      hireDate: technician.hireDate || "",
      notes: technician.notes || "",
      department: technician.department || "",
      position: technician.position || "",
      salaryBasis: technician.salaryBasis || undefined, // Fix: Using undefined instead of "HOURLY"
      hourlyRate: String(technician.hourlyRate || ""),
      incentiveType: technician.incentiveType || undefined,
      incentiveAmount: String(technician.incentiveAmount || ""),
    },
  });

  function onSubmitForm(values: z.infer<typeof formSchema>) {
    onUpdateTechnician(values);
    onOpenChange(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Technician Name" {...field} />
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
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone number" {...field} />
                  </FormControl>
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
                    <Input placeholder="Address" {...field} />
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
                    <Input placeholder="Specialty" {...field} />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="flat">Flat</SelectItem>
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
                  <FormLabel>Payment Rate</FormLabel>
                  <FormControl>
                    <Input placeholder="Payment Rate" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => {
                          field.onChange(date ? format(date, "yyyy-MM-dd") : undefined)
                        }}
                        disabled={(date) =>
                          date > new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => {
                          field.onChange(date ? format(date, "yyyy-MM-dd") : undefined)
                        }}
                        disabled={(date) =>
                          date > new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="Notes" {...field} />
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
                    <Input placeholder="Department" {...field} />
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
                    <Input placeholder="Position" {...field} />
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
                    onValueChange={(value) => {
                      field.onChange(value as SalaryBasis);
                    }}
                    defaultValue={technician.salaryBasis || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select salary basis" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SALARY_BASIS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hourly Rate</FormLabel>
                  <FormControl>
                    <Input placeholder="Hourly Rate" {...field} />
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
                    onValueChange={(value) => {
                      field.onChange(value as IncentiveType);
                    }}
                    defaultValue={technician.incentiveType || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select incentive type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {INCENTIVE_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
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
                    <Input placeholder="Incentive Amount" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
