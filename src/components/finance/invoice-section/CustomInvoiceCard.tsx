
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WandSparkles, Filter, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Technician } from "@/types/technician";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TechnicianDateFilter from "@/components/technicians/filters/TechnicianDateFilter";

interface CustomInvoiceCardProps {
  technicians: Technician[];
  selectedTechnician: Technician | null;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
}

const CustomInvoiceCard: React.FC<CustomInvoiceCardProps> = ({
  technicians,
  selectedTechnician,
  dateRange,
  setDateRange
}) => {
  const [open, setOpen] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [filters, setFilters] = useState({
    showJobAddress: true,
    showJobDate: true,
    showClientName: true,
    showTechnicianEarnings: true,
    showCompanyProfit: false,
    showPartsValue: true,
    showDetails: true,
    showTechnicianRate: true,
    showJobBreakdown: true,
    showTotalSummary: true,
    showPaymentMethod: true,
    showTaxes: false,
    showNotes: true,
    showLineItems: true,
  });
  const [invoiceSettings, setInvoiceSettings] = useState({
    title: "Professional Invoice",
    subtitle: selectedTechnician ? `Services by ${selectedTechnician.name}` : "Service Invoice",
    logo: true,
    color: "blue",
    format: "detailed",
    includeCompanyHeader: true,
    includeFooter: true,
    paymentTerms: "30",
    sortJobsBy: "date",
  });

  const handleFilterChange = (filterName: string) => (checked: boolean) => {
    setFilters(prev => ({ ...prev, [filterName]: checked }));
  };

  const handleSettingChange = (settingName: string) => (value: string) => {
    setInvoiceSettings(prev => ({ ...prev, [settingName]: value }));
  };

  const generateCustomInvoice = () => {
    if (!selectedTechnician) {
      toast({
        title: "Error",
        description: "Please select a technician first",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Custom invoice generated successfully!",
    });
    
    setOpen(false);
  };

  return (
    <>
      <Card className="border-blue-200 bg-blue-50/30 hover:bg-blue-50/70 transition-colors cursor-pointer" onClick={() => setOpen(true)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
            <WandSparkles className="h-5 w-5 text-blue-600" />
            Create Custom Invoice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-700 mb-3">
            Generate professional, highly customizable invoices with advanced filtering options
          </p>
          <Button 
            variant="outline"
            size="sm" 
            className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            <FileText className="mr-2 h-4 w-4" />
            Design Custom Invoice
          </Button>
        </CardContent>
      </Card>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full md:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-blue-800 flex items-center gap-2">
              <WandSparkles className="h-5 w-5 text-blue-600" />
              Custom Invoice Designer
            </SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            {/* Date Range Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="font-medium">Invoice Period</Label>
              </div>
              <TechnicianDateFilter
                localDateRange={dateRange}
                setLocalDateRange={setDateRange}
                showDateFilter={showDateFilter}
                setShowDateFilter={setShowDateFilter}
                clearFilters={() => setDateRange(undefined)}
                applyFilters={() => setShowDateFilter(false)}
              />
              {dateRange?.from && dateRange?.to && (
                <p className="text-xs text-muted-foreground mt-1">
                  {format(dateRange.from, "PPP")} - {format(dateRange.to, "PPP")}
                </p>
              )}
            </div>

            <Separator />

            {/* Invoice Settings Section */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="appearance">
                <AccordionTrigger className="text-blue-700 hover:text-blue-800 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <WandSparkles className="h-4 w-4" />
                    Invoice Appearance
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 py-2">
                    <div className="grid gap-2">
                      <Label>Invoice Title</Label>
                      <Select 
                        value={invoiceSettings.title} 
                        onValueChange={handleSettingChange("title")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select title style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Professional Invoice">Professional Invoice</SelectItem>
                          <SelectItem value="Service Invoice">Service Invoice</SelectItem>
                          <SelectItem value="Payment Statement">Payment Statement</SelectItem>
                          <SelectItem value="Earnings Report">Earnings Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label>Color Theme</Label>
                      <Select 
                        value={invoiceSettings.color} 
                        onValueChange={handleSettingChange("color")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select color theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blue">Blue</SelectItem>
                          <SelectItem value="green">Green</SelectItem>
                          <SelectItem value="purple">Purple</SelectItem>
                          <SelectItem value="gray">Gray (Professional)</SelectItem>
                          <SelectItem value="teal">Teal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label>Invoice Format</Label>
                      <Select 
                        value={invoiceSettings.format} 
                        onValueChange={handleSettingChange("format")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="detailed">Detailed</SelectItem>
                          <SelectItem value="compact">Compact</SelectItem>
                          <SelectItem value="minimal">Minimal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="include-logo"
                        checked={invoiceSettings.logo}
                        onCheckedChange={(checked) => 
                          setInvoiceSettings(prev => ({ ...prev, logo: checked }))
                        }
                      />
                      <Label htmlFor="include-logo">Include Company Logo</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="include-header"
                        checked={invoiceSettings.includeCompanyHeader}
                        onCheckedChange={(checked) => 
                          setInvoiceSettings(prev => ({ ...prev, includeCompanyHeader: checked }))
                        }
                      />
                      <Label htmlFor="include-header">Include Company Header</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="include-footer"
                        checked={invoiceSettings.includeFooter}
                        onCheckedChange={(checked) => 
                          setInvoiceSettings(prev => ({ ...prev, includeFooter: checked }))
                        }
                      />
                      <Label htmlFor="include-footer">Include Footer</Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="content-filters">
                <AccordionTrigger className="text-blue-700 hover:text-blue-800 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Content Filters
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 gap-3 py-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-job-address">Job Address</Label>
                      <Switch
                        id="show-job-address"
                        checked={filters.showJobAddress}
                        onCheckedChange={handleFilterChange("showJobAddress")}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-job-date">Job Date</Label>
                      <Switch
                        id="show-job-date"
                        checked={filters.showJobDate}
                        onCheckedChange={handleFilterChange("showJobDate")}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-client-name">Client Name</Label>
                      <Switch
                        id="show-client-name"
                        checked={filters.showClientName}
                        onCheckedChange={handleFilterChange("showClientName")}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-technician-earnings">Technician Earnings</Label>
                      <Switch
                        id="show-technician-earnings"
                        checked={filters.showTechnicianEarnings}
                        onCheckedChange={handleFilterChange("showTechnicianEarnings")}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-company-profit">Company Profit</Label>
                      <Switch
                        id="show-company-profit"
                        checked={filters.showCompanyProfit}
                        onCheckedChange={handleFilterChange("showCompanyProfit")}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-parts-value">Parts Value</Label>
                      <Switch
                        id="show-parts-value"
                        checked={filters.showPartsValue}
                        onCheckedChange={handleFilterChange("showPartsValue")}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-details">Job Details</Label>
                      <Switch
                        id="show-details"
                        checked={filters.showDetails}
                        onCheckedChange={handleFilterChange("showDetails")}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-technician-rate">Technician Rate</Label>
                      <Switch
                        id="show-technician-rate"
                        checked={filters.showTechnicianRate}
                        onCheckedChange={handleFilterChange("showTechnicianRate")}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-payment-method">Payment Method</Label>
                      <Switch
                        id="show-payment-method"
                        checked={filters.showPaymentMethod}
                        onCheckedChange={handleFilterChange("showPaymentMethod")}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-taxes">Taxes</Label>
                      <Switch
                        id="show-taxes"
                        checked={filters.showTaxes}
                        onCheckedChange={handleFilterChange("showTaxes")}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="sorting-options">
                <AccordionTrigger className="text-blue-700 hover:text-blue-800 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <ChevronDown className="h-4 w-4" />
                    Sorting & Advanced Options
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 py-2">
                    <div className="grid gap-2">
                      <Label>Sort Jobs By</Label>
                      <Select 
                        value={invoiceSettings.sortJobsBy} 
                        onValueChange={handleSettingChange("sortJobsBy")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select sorting option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="date">Date (Newest First)</SelectItem>
                          <SelectItem value="date-asc">Date (Oldest First)</SelectItem>
                          <SelectItem value="amount">Amount (Highest First)</SelectItem>
                          <SelectItem value="amount-asc">Amount (Lowest First)</SelectItem>
                          <SelectItem value="client">Client Name (A-Z)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label>Payment Terms</Label>
                      <Select 
                        value={invoiceSettings.paymentTerms} 
                        onValueChange={handleSettingChange("paymentTerms")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment terms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Due on receipt</SelectItem>
                          <SelectItem value="15">Net 15 days</SelectItem>
                          <SelectItem value="30">Net 30 days</SelectItem>
                          <SelectItem value="60">Net 60 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <SheetFooter className="mt-6 flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={generateCustomInvoice} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              Generate Custom Invoice
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CustomInvoiceCard;
