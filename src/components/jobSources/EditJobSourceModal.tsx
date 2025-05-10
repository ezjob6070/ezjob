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
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";
import { JobSource } from "@/types/finance";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const jobSourceEditSchema = z.object({
  name: z.string().min(2, {
    message: "Job source name must be at least 2 characters.",
  }),
  type: z.string().min(2, {
    message: "Job source type must be at least 2 characters.",
  }),
  paymentType: z.enum(["fixed", "percentage"]),
  paymentValue: z.number({
    invalid_type_error: "Payment value must be a number.",
  }),
  isActive: z.boolean().default(true),
});

interface EditJobSourceModalProps {
  jobSource: JobSource;
  onJobSourceUpdated: (jobSource: JobSource) => void;
  onJobSourceDeleted: (jobSourceId: string) => void;
}

type JobSourceEditFormValues = z.infer<typeof jobSourceEditSchema>;

const EditJobSourceModal: React.FC<EditJobSourceModalProps> = ({
  jobSource,
  onJobSourceUpdated,
  onJobSourceDeleted,
}) => {
  const [open, setOpen] = useState(false);
  const { updateJobSource, deleteJobSource } = useGlobalState();

  const form = useForm<JobSourceEditFormValues>({
    resolver: zodResolver(jobSourceEditSchema),
    defaultValues: {
      name: jobSource.name,
      type: jobSource.type,
      paymentType: jobSource.paymentType as "fixed" | "percentage",
      paymentValue: jobSource.paymentValue,
      isActive: jobSource.active,
    },
  });

  useEffect(() => {
    // Type assertion to ensure paymentType is correctly typed
    const typedPaymentType = (jobSource.paymentType as "fixed" | "percentage") || "fixed";

    form.setValue('name', jobSource.name);
    form.setValue('type', jobSource.type);
    form.setValue('paymentType', typedPaymentType);
    form.setValue('paymentValue', jobSource.paymentValue);
    form.setValue('isActive', jobSource.active);
  }, [jobSource, form]);

  const onSubmit = async (values: JobSourceEditFormValues) => {
    try {
      const updatedJobSource = {
        ...jobSource,
        ...values,
        paymentValue: Number(values.paymentValue),
        active: values.isActive,
      };

      await updateJobSource(updatedJobSource);
      onJobSourceUpdated(updatedJobSource);
      toast({
        title: "Success",
        description: "Job source updated successfully.",
      });
      setOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update job source.",
      });
    }
  };

  const onDelete = async () => {
    try {
      await deleteJobSource(jobSource.id);
      onJobSourceDeleted(jobSource.id);
      toast({
        title: "Success",
        description: "Job source deleted successfully.",
      });
      setOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete job source.",
      });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Job Source Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Type" {...field} />
                  </FormControl>
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
                      <SelectItem value="fixed">Fixed</SelectItem>
                      <SelectItem value="percentage">Percentage</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Value</FormLabel>
                  <FormControl>
                    <Input placeholder="Payment Value" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>
                      Whether the job source is currently active.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the job source from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button type="submit" size="sm">
                Update
              </Button>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};

export default EditJobSourceModal;

const FormDescription = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-sm text-muted-foreground">{children}</p>;
};
