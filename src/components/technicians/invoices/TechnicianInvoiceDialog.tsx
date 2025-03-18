
import { useState } from "react";
import { Technician } from "@/types/technician";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FileText, Eye } from "lucide-react";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";

interface TechnicianInvoiceDialogProps {
  technician: Technician;
  onSettingsSaved?: (settings: any) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const invoiceSchema = z.object({
  // Invoice settings
  showJobAddress: z.boolean().default(true),
  showJobDate: z.boolean().default(true),
  showTechnicianEarnings: z.boolean().default(true),
  showCompanyProfit: z.boolean().default(false),
  showPartsValue: z.boolean().default(true),
  showDetails: z.boolean().default(true),
  
  // Job filters
  jobStatus: z.enum(["all", "completed", "in_progress", "scheduled"]).default("completed"),
  dateRange: z.enum(["all", "current_month", "previous_month", "custom"]).default("current_month"),
  customDateFrom: z.string().optional(),
  customDateTo: z.string().optional(),
  
  // Invoice details
  invoiceNumber: z.string().optional(),
  invoiceTitle: z.string().default("Technician Invoice"),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

const TechnicianInvoiceDialog = ({ 
  technician, 
  onSettingsSaved,
  open, 
  onOpenChange 
}: TechnicianInvoiceDialogProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      showJobAddress: true,
      showJobDate: true,
      showTechnicianEarnings: true,
      showCompanyProfit: false,
      showPartsValue: true,
      showDetails: true,
      jobStatus: "completed",
      dateRange: "current_month",
      invoiceTitle: `${technician.name} - Invoice`,
    },
  });
  
  const watchDateRange = form.watch("dateRange");
  
  const handleGenerateInvoice = (values: InvoiceFormValues) => {
    setIsGenerating(true);
    
    // In a real app, this would call an API to generate the invoice
    console.log("Generating invoice with settings:", values);
    console.log("For technician:", technician);
    
    // Call the callback with the settings
    if (onSettingsSaved) {
      onSettingsSaved(values);
    }
    
    // If this is being used in a dialog that we control
    if (onOpenChange) {
      setTimeout(() => {
        setIsGenerating(false);
        onOpenChange(false);
      }, 500);
    } else {
      setIsGenerating(false);
    }
  };
  
  const dialogContent = (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 py-4">
      {/* Left column: Invoice settings */}
      <div className="space-y-6 md:col-span-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleGenerateInvoice)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Invoice Information</h3>
              
              <FormField
                control={form.control}
                name="invoiceTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Invoice title" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="invoiceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="INV-00001" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            
              <h3 className="text-lg font-medium mt-6">Content Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="showJobAddress"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Show Job Address</FormLabel>
                        <FormDescription>Include job location on invoice</FormDescription>
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
                
                <FormField
                  control={form.control}
                  name="showJobDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Show Job Date</FormLabel>
                        <FormDescription>Include job date on invoice</FormDescription>
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
                
                <FormField
                  control={form.control}
                  name="showTechnicianEarnings"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Show Technician Earnings</FormLabel>
                        <FormDescription>Display earnings per job</FormDescription>
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
                
                <FormField
                  control={form.control}
                  name="showCompanyProfit"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Show Company Profit</FormLabel>
                        <FormDescription>Display profit calculations</FormDescription>
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
                
                <FormField
                  control={form.control}
                  name="showPartsValue"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Show Parts Value</FormLabel>
                        <FormDescription>Include parts cost on invoice</FormDescription>
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
                
                <FormField
                  control={form.control}
                  name="showDetails"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Show Job Details</FormLabel>
                        <FormDescription>Include job descriptions</FormDescription>
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
              </div>
              
              <h3 className="text-lg font-medium mt-6">Filter Options</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="jobStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select job status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">All Jobs</SelectItem>
                          <SelectItem value="completed">Completed Jobs Only</SelectItem>
                          <SelectItem value="in_progress">In Progress Jobs Only</SelectItem>
                          <SelectItem value="scheduled">Scheduled Jobs Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dateRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Range</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select date range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">All Time</SelectItem>
                          <SelectItem value="current_month">Current Month</SelectItem>
                          <SelectItem value="previous_month">Previous Month</SelectItem>
                          <SelectItem value="custom">Custom Date Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                {watchDateRange === "custom" && (
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="customDateFrom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="customDateTo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>To Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              {onOpenChange && (
                <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isGenerating} className="gap-2">
                {isGenerating ? (
                  <>Generating...</>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Preview Invoice
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      
      {/* Right column: Preview */}
      <div className="md:col-span-2">
        <div className="border rounded-lg p-4 h-full flex flex-col">
          <h3 className="text-lg font-medium mb-4">Invoice Summary</h3>
          <div className="flex-1 bg-gray-50 rounded-md p-4 overflow-y-auto space-y-4">
            <div className="text-center">
              <h4 className="font-bold">{form.watch("invoiceTitle")}</h4>
              {form.watch("invoiceNumber") && (
                <p className="text-sm text-muted-foreground">Invoice #{form.watch("invoiceNumber")}</p>
              )}
            </div>
            
            <div className="text-sm">
              <p className="font-medium">Technician: {technician?.name || "Name"}</p>
              <p>Date: {new Date().toLocaleDateString()}</p>
            </div>
            
            <div className="border-t pt-2">
              <h5 className="font-medium">Job Summary</h5>
              <div className="text-sm mt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Total Revenue:</span>
                  <span>{formatCurrency(technician?.totalRevenue || 0)}</span>
                </div>
                
                {form.watch("showTechnicianEarnings") && (
                  <div className="flex justify-between">
                    <span>Technician Earnings:</span>
                    <span>
                      {formatCurrency(
                        (technician?.totalRevenue || 0) * 
                        (technician?.paymentType === "percentage" 
                          ? (technician?.paymentRate || 0) / 100 
                          : 1)
                      )}
                    </span>
                  </div>
                )}
                
                {form.watch("showPartsValue") && (
                  <div className="flex justify-between">
                    <span>Parts Value:</span>
                    <span>{formatCurrency((technician?.totalRevenue || 0) * 0.2)}</span>
                  </div>
                )}
                
                {form.watch("showCompanyProfit") && (
                  <div className="flex justify-between">
                    <span>Company Profit:</span>
                    <span>{formatCurrency((technician?.totalRevenue || 0) * 0.4)}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-sm bg-blue-50 p-3 rounded border border-blue-100 mt-6">
              <p className="font-medium text-blue-600">Preview Settings</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>
                  {form.watch("jobStatus") === "all" ? "All jobs" : 
                   form.watch("jobStatus") === "completed" ? "Completed jobs only" :
                   form.watch("jobStatus") === "in_progress" ? "In progress jobs only" :
                   "Scheduled jobs only"}
                </li>
                <li>
                  {form.watch("showJobAddress") ? "Showing job addresses" : "Not showing job addresses"}
                </li>
                <li>
                  {form.watch("showJobDate") ? "Showing job dates" : "Not showing job dates"}
                </li>
                <li>
                  {form.watch("showDetails") ? "Showing job details" : "Not showing job details"}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // If this is being used in a dialog that we don't control, just return the content
  if (open === undefined || onOpenChange === undefined) {
    return dialogContent;
  }
  
  return null;
};

export default TechnicianInvoiceDialog;
