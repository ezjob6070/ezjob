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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { technicianSchema } from "@/lib/validations/technician";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import { forwardRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { getInitials } from "@/lib/utils";
import { v4 as uuidv4 } from 'uuid';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { PopoverClose } from "@radix-ui/react-popover";
import { DatePicker } from "../ui/date-picker";
import { Technician } from "@/types/technician";

interface EditTechnicianModalProps {
  technician: Technician;
}

export const EditTechnicianModal = ({ technician }: EditTechnicianModalProps) => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof technicianSchema>>({
    resolver: zodResolver(technicianSchema),
    defaultValues: {
      name: technician.name,
      email: technician.email,
      phone: technician.phone,
      address: technician.address,
      specialty: technician.specialty,
      status: technician.status,
      paymentType: technician.paymentType,
      paymentRate: technician.paymentRate.toString(),
      hireDate: technician.hireDate,
    },
  });

  const { mutate: updateTechnician } = useMutation({
    mutationFn: async (values: z.infer<typeof technicianSchema>) => {
      // Simulate API update
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Optimistically update the cache
      queryClient.setQueryData<Technician[]>(['technicians'], (old) => {
        if (!old) return [];
        return old.map((tech) => tech.id === technician.id ? { ...technician, ...values } : tech);
      });

      return values;
    },
    onSuccess: () => {
      toast({
        title: "Technician updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['technicians'] });
      setOpen(false);
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
    updateTechnician({
      ...data,
      status: data.status as "active" | "inactive" | "onLeave",
      paymentType: data.paymentType as "percentage" | "flat" | "hourly",
      paymentRate: parseFloat(data.paymentRate),
    });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Technician</DialogTitle>
          <DialogDescription>
            Make changes to your technician here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Technician Avatar"
                    className="rounded-full"
                  />
                ) : (
                  <AvatarFallback>{technician.initials}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <Label htmlFor="picture">Change Picture</Label>
                <Input
                  id="picture"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
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
                    <Input placeholder="mail@example.com" {...field} />
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
                    <Input placeholder="+1 (555) 123-4567" {...field} />
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
                    <Textarea placeholder="123 Example St. City, State" {...field} />
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
                    <Input placeholder="Plumbing, Electrical, etc." {...field} />
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
                        <SelectValue placeholder="Select a payment type" />
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
              
              {/* Remove or comment out the salary display that doesn't exist */}
              {/* <div className="flex justify-between text-sm">
                <div className="text-muted-foreground">Salary:</div>
                <div className="font-medium">${technician.salary}/yr</div>
              </div> */}

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
                        <DatePicker
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date?.toISOString())}
                          disabled={false}
                          initialFocus
                        />
                        <PopoverClose>
                          <Button className="w-full" variant={'secondary'}>Close</Button>
                        </PopoverClose>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      The date the technician was hired.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
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
};
