
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Technician } from "@/types/technician";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, ChevronDown, FileText, Download } from "lucide-react";
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

  const form = useForm({
    defaultValues: {
      invoiceNumber: generateInvoiceNumber(),
      paymentTerms: "30",
      notes: "",
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

  const generateInvoice = () => {
    if (!selectedTechnician || !date?.from || !date?.to) {
      toast.error("Please select a technician and date range");
      return;
    }

    const invoiceData = {
      invoiceNumber: form.getValues("invoiceNumber"),
      technician: selectedTechnician,
      dateRange: {
        from: date.from,
        to: date.to
      },
      paymentTerms: form.getValues("paymentTerms"),
      notes: form.getValues("notes"),
      createdAt: new Date()
    };

    // In a real app, we would save the invoice to the database
    console.log("Generated invoice:", invoiceData);
    toast.success("Invoice generated successfully!");
  };

  const downloadInvoicePdf = () => {
    if (!selectedTechnician) {
      toast.error("Please select a technician first");
      return;
    }
    
    // In a real app, we would generate a PDF and download it
    console.log("Downloading invoice as PDF...");
    toast.success("Invoice PDF downloaded successfully!");
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technician Invoices</CardTitle>
        <CardDescription>Generate and manage technician invoices</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium mb-2">Select Technician</h3>
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search technicians..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            
            <div className="grid gap-2 max-h-[200px] overflow-y-auto">
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
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium mb-2">Invoice Details</h3>
            <Form {...form}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="invoiceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Number</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly className="bg-slate-50" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
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
                
                <FormField
                  control={form.control}
                  name="paymentTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Terms</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment terms" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">Due on receipt</SelectItem>
                          <SelectItem value="7">Net 7 days</SelectItem>
                          <SelectItem value="15">Net 15 days</SelectItem>
                          <SelectItem value="30">Net 30 days</SelectItem>
                          <SelectItem value="60">Net 60 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Notes</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Add any additional notes..." />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </Form>
            
            <div className="flex space-x-2 pt-4">
              <Button 
                onClick={generateInvoice} 
                className="flex items-center"
              >
                <FileText className="mr-2 h-4 w-4" />
                Generate Invoice
              </Button>
              <Button 
                variant="outline" 
                onClick={downloadInvoicePdf}
                className="flex items-center"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicianInvoiceSection;
