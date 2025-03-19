
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Technician } from "@/types/technician";
import { Button } from "@/components/ui/button";
import { Filter, Eye, DollarSign } from "lucide-react";
import { useForm } from "react-hook-form";
import { DateRange } from "react-day-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import TechnicianInvoiceDialog from "@/components/technicians/invoices/TechnicianInvoiceDialog";
import TechnicianList from "./invoice-section/TechnicianList";
import InvoiceFilterOptions from "./invoice-section/InvoiceFilterOptions";
import SelectedTechnicianCard from "./invoice-section/SelectedTechnicianCard";
import InvoicePreviewDialog from "./invoice-section/InvoicePreviewDialog";

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

  const resetFilters = () => {
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
          <div className="w-full md:w-1/3">
            <TechnicianList
              technicians={filteredTechnicians}
              selectedTechnician={selectedTechnician}
              onSelectTechnician={selectTechnician}
              searchQuery={searchQuery}
              onSearchChange={handleSearch}
            />
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
              
              {/* Selected Technician Info */}
              {selectedTechnician && (
                <SelectedTechnicianCard
                  technician={selectedTechnician}
                  dateRange={date}
                />
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
      
      {/* Preview Dialog */}
      <InvoicePreviewDialog
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        technician={selectedTechnician}
        date={date}
        displayOptions={displayOptions}
      />
    </Card>
  );
};

export default TechnicianInvoiceSection;
