
import React, { useState } from "react";
import { Technician } from "@/types/technician";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  FormField, 
  FormControl, 
  FormItem, 
  FormLabel, 
  Form 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

export interface TechnicianInvoiceDialogProps {
  technician: Technician;
  onSettingsSaved: (settings: any) => void;
}

const TechnicianInvoiceDialog: React.FC<TechnicianInvoiceDialogProps> = ({ 
  technician, 
  onSettingsSaved 
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const form = useForm({
    defaultValues: {
      invoiceTitle: `Invoice - ${technician.name}`,
      period: "last-month",
      customPeriod: "",
      invoiceNumber: `INV-${Date.now().toString().substring(8)}`,
      description: `Payment for services - ${technician.name}`,
      notes: "",
      showJobAddress: true,
      showJobDate: true,
      showTechnicianEarnings: true,
      showCompanyProfit: false,
      showPartsValue: true,
      showDetails: true,
      jobStatus: "completed"
    }
  });

  const handleSubmit = (data: any) => {
    onSettingsSaved({
      ...data,
      date,
      technician,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="invoiceTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="invoiceNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
          
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <FormLabel>Invoice Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <FormField
            control={form.control}
            name="period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Period</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="last-week">Last Week</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="current-month">Current Month</SelectItem>
                    <SelectItem value="custom">Custom Period</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
          
        {form.watch("period") === "custom" && (
          <FormField
            control={form.control}
            name="customPeriod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Period</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Jan-Feb 2023" />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
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
                <Textarea {...field} rows={3} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="jobStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Status Filter</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">All Jobs</SelectItem>
                    <SelectItem value="completed">Completed Jobs</SelectItem>
                    <SelectItem value="in_progress">In Progress Jobs</SelectItem>
                    <SelectItem value="scheduled">Scheduled Jobs</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Display Options</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Add toggle controls for different display options */}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit">Generate Invoice</Button>
        </div>
      </form>
    </Form>
  );
};

export default TechnicianInvoiceDialog;
