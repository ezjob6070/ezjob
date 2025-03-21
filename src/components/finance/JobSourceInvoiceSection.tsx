
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { JobSource } from "@/types/finance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, ChevronDown, FileText, Download, Eye, X, Filter } from "lucide-react";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { DateRange } from "react-day-picker";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import DateRangeSelector from "@/components/finance/DateRangeSelector";
import { addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, format } from "date-fns";
import { toast } from "sonner";
import InvoiceFilterOptions from "./invoice-section/InvoiceFilterOptions";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface JobSourceInvoiceSectionProps {
  jobSources: JobSource[];
}

const JobSourceInvoiceSection: React.FC<JobSourceInvoiceSectionProps> = ({
  jobSources
}) => {
  const [filteredJobSources, setFilteredJobSources] = useState<JobSource[]>(jobSources);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobSource, setSelectedJobSource] = useState<JobSource | null>(null);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // First day of current month
    to: new Date(),
  });
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  
  const [displayOptions, setDisplayOptions] = useState({
    showJobAddress: true,
    showJobDate: true,
    showCompanyProfit: false,
    showPartsValue: true,
    showDetails: true,
    showJobSourceRate: true,
    showJobBreakdown: true,
    showTotalSummary: true,
  });

  const form = useForm({
    defaultValues: {
      invoiceNumber: generateInvoiceNumber(),
      paymentTerms: "30",
      notes: "",
      jobStatus: "completed"
    }
  });

  function generateInvoiceNumber() {
    const prefix = "INV";
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setFilteredJobSources(jobSources);
    } else {
      const filtered = jobSources.filter(source => 
        source.name.toLowerCase().includes(query.toLowerCase()) ||
        (source.category && source.category.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredJobSources(filtered);
    }
  };

  const selectJobSource = (jobSource: JobSource) => {
    setSelectedJobSource(jobSource);
  };

  const handlePreviewInvoice = () => {
    if (!selectedJobSource) {
      toast.error("Please select a job source first");
      return;
    }
    
    setPreviewDialogOpen(true);
  };

  const handleGenerateInvoice = () => {
    if (!selectedJobSource) {
      toast.error("Please select a job source first");
      return;
    }
    
    setInvoiceDialogOpen(true);
  };

  const handleInvoiceSettingsSaved = (settings: any) => {
    // In a real app, we would save these settings and generate the invoice
    console.log("Invoice settings saved:", settings);
    setInvoiceDialogOpen(false);
    
    toast.success("Invoice generated successfully!");
  };

  const handleDatePresetSelection = (preset: string) => {
    const today = new Date();
    
    switch (preset) {
      case "today":
        setDate({ from: today, to: today });
        break;
      case "yesterday":
        const yesterday = subDays(today, 1);
        setDate({ from: yesterday, to: yesterday });
        break;
      case "this-week":
        setDate({ from: startOfWeek(today, { weekStartsOn: 1 }), to: today });
        break;
      case "last-week":
        const lastWeekStart = startOfWeek(subDays(today, 7), { weekStartsOn: 1 });
        const lastWeekEnd = endOfWeek(subDays(today, 7), { weekStartsOn: 1 });
        setDate({ from: lastWeekStart, to: lastWeekEnd });
        break;
      case "this-month":
        setDate({ from: startOfMonth(today), to: today });
        break;
      case "last-month":
        const lastMonthDate = subDays(startOfMonth(today), 1);
        setDate({ from: startOfMonth(lastMonthDate), to: endOfMonth(lastMonthDate) });
        break;
      case "last-30-days":
        setDate({ from: subDays(today, 30), to: today });
        break;
      case "last-90-days":
        setDate({ from: subDays(today, 90), to: today });
        break;
      case "last-year":
        setDate({ from: startOfYear(subDays(startOfYear(today), 1)), to: endOfYear(subDays(startOfYear(today), 1)) });
        break;
      default:
        break;
    }
  };

  const handleDisplayOptionChange = (option: string, checked: boolean) => {
    setDisplayOptions(prev => ({
      ...prev,
      [option]: checked
    }));
  };

  const resetFilters = () => {
    // Reset all filters to default
    setDisplayOptions({
      showJobAddress: true,
      showJobDate: true,
      showCompanyProfit: false,
      showPartsValue: true,
      showDetails: true,
      showJobSourceRate: true,
      showJobBreakdown: true,
      showTotalSummary: true,
    });
    
    setDate({
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to: new Date(),
    });
    
    form.setValue("jobStatus", "completed");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Source Invoices</CardTitle>
        <CardDescription>Generate and manage job source invoices</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left side - Job Source List */}
          <div className="w-full md:w-1/3">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search job sources..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              
              <div className="border rounded-md overflow-y-auto max-h-[300px]">
                {filteredJobSources.length > 0 ? (
                  <div className="divide-y">
                    {filteredJobSources.map(source => (
                      <div 
                        key={source.id}
                        className={`p-3 cursor-pointer hover:bg-slate-50 transition-colors ${
                          selectedJobSource?.id === source.id ? 'bg-blue-50 border-blue-300' : ''
                        }`}
                        onClick={() => selectJobSource(source)}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 mr-3 text-xs">
                            {source.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{source.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <span>{source.totalJobs || 0} jobs</span>
                              <span className="text-xs">•</span>
                              <span>{source.category || "Other"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No job sources found matching your search.
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right side - Filters and Action Buttons */}
          <div className="w-full md:w-2/3">
            <div className="space-y-4">
              {/* Filter & Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  className="flex gap-2 items-center"
                  onClick={() => setShowFilterOptions(!showFilterOptions)}
                >
                  <Filter className="h-4 w-4" />
                  Filter Options
                </Button>
                
                <Button
                  onClick={handlePreviewInvoice}
                  className="flex gap-2 items-center"
                  variant="outline"
                >
                  <Eye className="h-4 w-4" />
                  Preview Invoice
                </Button>
                
                <Button
                  onClick={handleGenerateInvoice}
                  className="flex gap-2 items-center"
                >
                  <FileText className="h-4 w-4" />
                  Generate Invoice
                </Button>
              </div>
              
              {/* Filter Options Card */}
              {showFilterOptions && (
                <InvoiceFilterOptions
                  date={date}
                  setDate={setDate}
                  jobStatus={form.getValues("jobStatus")}
                  setJobStatus={(value) => form.setValue("jobStatus", value)}
                  displayOptions={displayOptions}
                  onDisplayOptionChange={handleDisplayOptionChange}
                  onClose={() => setShowFilterOptions(false)}
                  onReset={resetFilters}
                  onApply={() => setShowFilterOptions(false)}
                  handleDatePresetSelection={handleDatePresetSelection}
                />
              )}
              
              {/* Custom Invoice Card */}
              <Card className="border border-gray-200 bg-gray-50">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Custom Invoice Settings</h3>
                    <Form {...form}>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name="invoiceNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Invoice #</FormLabel>
                                <FormControl>
                                  <Input {...field} className="h-8 text-sm" />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="paymentTerms"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Payment Terms</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-8 text-sm">
                                      <SelectValue placeholder="Select terms" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="0">Due on receipt</SelectItem>
                                    <SelectItem value="15">Net 15 days</SelectItem>
                                    <SelectItem value="30">Net 30 days</SelectItem>
                                    <SelectItem value="60">Net 60 days</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Invoice Notes</FormLabel>
                              <FormControl>
                                <Input {...field} className="h-8 text-sm" placeholder="Add notes to invoice..." />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </Form>
                  </div>
                </CardContent>
              </Card>
              
              {/* Selected Job Source Info */}
              {selectedJobSource && (
                <Card className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-sm">
                          {selectedJobSource.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-medium">{selectedJobSource.name}</h3>
                          <p className="text-sm text-muted-foreground">{selectedJobSource.category || "Other"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="font-semibold text-blue-600">${selectedJobSource.totalRevenue?.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="text-center p-2 bg-gray-50 rounded-md">
                        <p className="text-xs text-muted-foreground">Total Jobs</p>
                        <p className="font-semibold">{selectedJobSource.totalJobs || 0}</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-md">
                        <p className="text-xs text-muted-foreground">Expenses</p>
                        <p className="font-semibold text-red-600">${selectedJobSource.expenses?.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-md">
                        <p className="text-xs text-muted-foreground">Profit</p>
                        <p className="font-semibold text-green-600">${selectedJobSource.companyProfit?.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* Invoice Dialog */}
      <Dialog open={invoiceDialogOpen} onOpenChange={setInvoiceDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generate Invoice for {selectedJobSource?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <FormLabel>Invoice Number</FormLabel>
                <Input value={form.getValues("invoiceNumber")} readOnly className="bg-gray-50" />
              </div>
              
              <div className="space-y-2">
                <FormLabel>Date Range</FormLabel>
                <DateRangeSelector date={date} setDate={setDate} />
              </div>
              
              <div className="space-y-2">
                <FormLabel>Payment Terms</FormLabel>
                <Select defaultValue={form.getValues("paymentTerms")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Due on receipt</SelectItem>
                    <SelectItem value="7">Net 7 days</SelectItem>
                    <SelectItem value="15">Net 15 days</SelectItem>
                    <SelectItem value="30">Net 30 days</SelectItem>
                    <SelectItem value="60">Net 60 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <FormLabel>Notes</FormLabel>
                <Input placeholder="Add invoice notes..." />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setInvoiceDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast.success("Invoice generated successfully!");
                setInvoiceDialogOpen(false);
              }}>
                Generate Invoice
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Invoice Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedJobSource && (
              <div className="border rounded-md p-6 bg-white">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">INVOICE</h2>
                    <p className="text-gray-500">#{form.getValues("invoiceNumber")}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">Your Company Name</p>
                    <p>123 Business Street</p>
                    <p>City, State 12345</p>
                    <p>contact@yourcompany.com</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="font-bold mb-2 text-gray-700">Bill To:</h3>
                    <p className="font-medium">{selectedJobSource.name}</p>
                    <p>{selectedJobSource.category || "Job Source"}</p>
                    {selectedJobSource.website && <p>{selectedJobSource.website}</p>}
                  </div>
                  <div>
                    <h3 className="font-bold mb-2 text-gray-700">Invoice Details:</h3>
                    <div className="grid grid-cols-2 gap-1">
                      <p className="text-gray-600">Issue Date:</p>
                      <p>{new Date().toLocaleDateString()}</p>
                      <p className="text-gray-600">Due Date:</p>
                      <p>{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                      <p className="text-gray-600">Period:</p>
                      <p>{date?.from?.toLocaleDateString()} - {date?.to?.toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="py-4">
                          <p className="font-medium">Job Source Services</p>
                          <p className="text-gray-500 text-sm">
                            For the period {date?.from?.toLocaleDateString()} - {date?.to?.toLocaleDateString()}
                          </p>
                        </td>
                        <td className="py-4 text-right">${selectedJobSource.totalRevenue?.toLocaleString()}</td>
                      </tr>
                      {displayOptions.showPartsValue && (
                        <tr>
                          <td className="py-4">
                            <p className="font-medium">Parts and Materials</p>
                            <p className="text-gray-500 text-sm">
                              For {selectedJobSource.totalJobs} jobs
                            </p>
                          </td>
                          <td className="py-4 text-right">${(selectedJobSource.totalRevenue * 0.2).toLocaleString()}</td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td className="py-4 text-right font-bold">Total:</td>
                        <td className="py-4 text-right font-bold">
                          ${displayOptions.showPartsValue 
                            ? (selectedJobSource.totalRevenue * 1.2).toLocaleString() 
                            : selectedJobSource.totalRevenue?.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                
                <div className="border-t pt-4">
                  <p className="font-bold mb-2">Notes:</p>
                  <p className="text-gray-600">{form.getValues("notes") || "Thank you for your business!"}</p>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
                Close
              </Button>
              <Button onClick={() => {
                toast.success("Invoice downloaded successfully!");
                setPreviewDialogOpen(false);
              }}>
                <Download className="mr-2 h-4 w-4" />
                Download Invoice
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default JobSourceInvoiceSection;
