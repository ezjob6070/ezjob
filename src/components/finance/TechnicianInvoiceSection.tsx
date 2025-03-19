
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Technician } from "@/types/technician";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, ChevronDown, FileText, DollarSign, Filter, Eye, X } from "lucide-react";
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
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TechnicianInvoiceDialog from "@/components/technicians/invoices/TechnicianInvoiceDialog";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface TechnicianInvoiceSectionProps {
  activeTechnicians: Technician[];
}

const TechnicianInvoiceSection: React.FC<TechnicianInvoiceSectionProps> = ({
  activeTechnicians
}) => {
  const [filteredTechnicians, setFilteredTechnicians] = useState<Technician[]>(activeTechnicians);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
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
    showTechnicianEarnings: true,
    showCompanyProfit: false,
    showPartsValue: true,
    showDetails: true,
    showTechnicianRate: true,
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
      setFilteredTechnicians(activeTechnicians);
    } else {
      const filtered = activeTechnicians.filter(tech => 
        tech.name.toLowerCase().includes(query.toLowerCase()) ||
        tech.specialty.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTechnicians(filtered);
    }
  };

  const selectTechnician = (technician: Technician) => {
    setSelectedTechnician(technician);
  };

  const handlePreviewInvoice = () => {
    if (!selectedTechnician) {
      toast({
        title: "Error",
        description: "Please select a technician first",
        variant: "destructive"
      });
      return;
    }
    
    setPreviewDialogOpen(true);
  };

  const handleDollarInvoice = () => {
    if (!selectedTechnician) {
      toast({
        title: "Error",
        description: "Please select a technician first",
        variant: "destructive"
      });
      return;
    }
    
    setInvoiceDialogOpen(true);
  };

  const handleInvoiceSettingsSaved = (settings: any) => {
    // In a real app, we would save these settings and generate the invoice
    console.log("Invoice settings saved:", settings);
    setInvoiceDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Invoice generated successfully!"
    });
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technician Invoices</CardTitle>
        <CardDescription>Generate and manage technician invoices</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left side - Technician List */}
          <div className="w-full md:w-1/3 space-y-4">
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search technicians..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            
            <div className="grid gap-2 max-h-[400px] overflow-y-auto border rounded-md p-2">
              {filteredTechnicians.map(tech => (
                <div 
                  key={tech.id}
                  className={`p-3 rounded-md border cursor-pointer hover:bg-slate-50 transition-colors
                    ${selectedTechnician?.id === tech.id ? 'bg-blue-50 border-blue-300' : ''}`}
                  onClick={() => selectTechnician(tech)}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-2 text-xs">
                      {tech.initials}
                    </div>
                    <div>
                      <div className="font-medium">{tech.name}</div>
                      <div className="text-sm text-muted-foreground">{tech.specialty}</div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredTechnicians.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">
                  No technicians found matching your search.
                </div>
              )}
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
                  onClick={handleDollarInvoice}
                  className="flex gap-2 items-center"
                >
                  <DollarSign className="h-4 w-4" />
                  Dollar Invoice
                </Button>
              </div>
              
              {/* Filter Options Card */}
              {showFilterOptions && (
                <Card className="border-blue-200 shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg text-blue-700">Invoice Filter Options</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setShowFilterOptions(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                      {/* Date Range Selection */}
                      <div className="space-y-2">
                        <FormLabel>Date Range</FormLabel>
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8">
                                  <Calendar className="mr-2 h-4 w-4" />
                                  <span>Past Periods</span>
                                  <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                <DropdownMenuItem onClick={() => handleDatePresetSelection("today")}>
                                  Today
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDatePresetSelection("yesterday")}>
                                  Yesterday
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDatePresetSelection("this-week")}>
                                  This Week
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDatePresetSelection("last-week")}>
                                  Last Week
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDatePresetSelection("this-month")}>
                                  This Month
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDatePresetSelection("last-month")}>
                                  Last Month
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDatePresetSelection("last-30-days")}>
                                  Last 30 Days
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDatePresetSelection("last-90-days")}>
                                  Last 90 Days
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDatePresetSelection("last-year")}>
                                  Last Year
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <DateRangeSelector date={date} setDate={setDate} />
                        </div>
                      </div>

                      <Separator />
                      
                      {/* Job Status Filter */}
                      <div className="space-y-2">
                        <FormLabel>Job Status</FormLabel>
                        <Select 
                          defaultValue={form.getValues("jobStatus")}
                          onValueChange={(value) => form.setValue("jobStatus", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select job status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Jobs</SelectItem>
                            <SelectItem value="completed">Completed Jobs</SelectItem>
                            <SelectItem value="in_progress">In Progress Jobs</SelectItem>
                            <SelectItem value="scheduled">Scheduled Jobs</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator />
                      
                      {/* Display Options */}
                      <div className="space-y-2">
                        <FormLabel>Display Options</FormLabel>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Job Address</FormLabel>
                            </div>
                            <Switch
                              checked={displayOptions.showJobAddress}
                              onCheckedChange={(checked) => handleDisplayOptionChange("showJobAddress", checked)}
                            />
                          </div>
                          
                          <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Job Date</FormLabel>
                            </div>
                            <Switch
                              checked={displayOptions.showJobDate}
                              onCheckedChange={(checked) => handleDisplayOptionChange("showJobDate", checked)}
                            />
                          </div>
                          
                          <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Technician Earnings</FormLabel>
                            </div>
                            <Switch
                              checked={displayOptions.showTechnicianEarnings}
                              onCheckedChange={(checked) => handleDisplayOptionChange("showTechnicianEarnings", checked)}
                            />
                          </div>
                          
                          <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Company Profit</FormLabel>
                            </div>
                            <Switch
                              checked={displayOptions.showCompanyProfit}
                              onCheckedChange={(checked) => handleDisplayOptionChange("showCompanyProfit", checked)}
                            />
                          </div>
                          
                          <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Parts Value</FormLabel>
                            </div>
                            <Switch
                              checked={displayOptions.showPartsValue}
                              onCheckedChange={(checked) => handleDisplayOptionChange("showPartsValue", checked)}
                            />
                          </div>
                          
                          <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Job Details</FormLabel>
                            </div>
                            <Switch
                              checked={displayOptions.showDetails}
                              onCheckedChange={(checked) => handleDisplayOptionChange("showDetails", checked)}
                            />
                          </div>

                          <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Technician Rate</FormLabel>
                            </div>
                            <Switch
                              checked={displayOptions.showTechnicianRate}
                              onCheckedChange={(checked) => handleDisplayOptionChange("showTechnicianRate", checked)}
                            />
                          </div>

                          <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Job Breakdown</FormLabel>
                            </div>
                            <Switch
                              checked={displayOptions.showJobBreakdown}
                              onCheckedChange={(checked) => handleDisplayOptionChange("showJobBreakdown", checked)}
                            />
                          </div>

                          <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Total Summary</FormLabel>
                            </div>
                            <Switch
                              checked={displayOptions.showTotalSummary}
                              onCheckedChange={(checked) => handleDisplayOptionChange("showTotalSummary", checked)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => {
                      // Reset all filters to default
                      setDisplayOptions({
                        showJobAddress: true,
                        showJobDate: true,
                        showTechnicianEarnings: true,
                        showCompanyProfit: false,
                        showPartsValue: true,
                        showDetails: true,
                        showTechnicianRate: true,
                        showJobBreakdown: true,
                        showTotalSummary: true,
                      });
                      
                      setDate({
                        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                        to: new Date(),
                      });
                      
                      form.setValue("jobStatus", "completed");
                    }}>
                      Reset Filters
                    </Button>
                    <Button onClick={() => setShowFilterOptions(false)}>
                      Apply Filters
                    </Button>
                  </CardFooter>
                </Card>
              )}
              
              {/* Selected Technician Info */}
              {selectedTechnician && (
                <Card className="border-green-200 bg-green-50/50">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 text-sm">
                          {selectedTechnician.initials}
                        </div>
                        <div>
                          <h3 className="font-medium">{selectedTechnician.name}</h3>
                          <p className="text-sm text-muted-foreground">{selectedTechnician.specialty}</p>
                        </div>
                      </div>
                      {date?.from && date?.to && (
                        <div className="text-sm text-right">
                          <div className="font-medium">Selected Period:</div>
                          <div>{format(date.from, "MMM d, yyyy")} - {format(date.to, "MMM d, yyyy")}</div>
                        </div>
                      )}
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
            <DialogTitle>Generate Invoice</DialogTitle>
          </DialogHeader>
          {selectedTechnician && (
            <TechnicianInvoiceDialog 
              technician={selectedTechnician}
              onSettingsSaved={handleInvoiceSettingsSaved}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Preview Dialog - In a real app, this would show the actual invoice preview */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Invoice Preview</DialogTitle>
          </DialogHeader>
          {selectedTechnician && (
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-md">
                <h2 className="text-xl font-bold mb-2">Invoice for {selectedTechnician.name}</h2>
                <p className="text-sm mb-2">Period: {date?.from && date?.to ? `${format(date.from, "MMM d, yyyy")} - ${format(date.to, "MMM d, yyyy")}` : "All time"}</p>
                <p className="text-sm">Filter Options:</p>
                <ul className="text-sm ml-4 mt-1">
                  <li>Show Job Address: {displayOptions.showJobAddress ? "Yes" : "No"}</li>
                  <li>Show Job Date: {displayOptions.showJobDate ? "Yes" : "No"}</li>
                  <li>Show Technician Earnings: {displayOptions.showTechnicianEarnings ? "Yes" : "No"}</li>
                  <li>Show Company Profit: {displayOptions.showCompanyProfit ? "Yes" : "No"}</li>
                  <li>Show Parts Value: {displayOptions.showPartsValue ? "Yes" : "No"}</li>
                  <li>Show Job Details: {displayOptions.showDetails ? "Yes" : "No"}</li>
                  <li>Show Technician Rate: {displayOptions.showTechnicianRate ? "Yes" : "No"}</li>
                  <li>Show Job Breakdown: {displayOptions.showJobBreakdown ? "Yes" : "No"}</li>
                  <li>Show Total Summary: {displayOptions.showTotalSummary ? "Yes" : "No"}</li>
                </ul>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  toast({
                    title: "Success",
                    description: "Invoice downloaded successfully!"
                  });
                  setPreviewDialogOpen(false);
                }}>
                  Download Preview
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TechnicianInvoiceSection;
